// Email one-time-code sign-in.
//   GET                                   -> { user }            current session (or null)
//   POST { action: 'request', email }     -> emails a 6-digit code
//   POST { action: 'verify', email, code} -> sets the session cookie
//   POST { action: 'logout' }
import { route, body, json, fail, sql, currentUser, sessionCookie, clearCookie, newCode, hashCode, normEmail, validEmail, sendMail, roleOf, SITE, HttpError } from './_lib.js';

export const GET = route(async (req) => { const u = currentUser(req); return json({ user: u && { ...u, role: await roleOf(u.email) } }); });

export const POST = route(async (req) => {
  if (!process.env.SESSION_SECRET) throw new HttpError(503, 'Sign-in is not set up yet.');
  const b = await body(req);
  if (b.action === 'logout') return json({ ok: true }, 200, { 'set-cookie': clearCookie });
  const email = normEmail(b.email);
  if (!validEmail(email)) return fail(400, 'Enter a valid email address.');

  if (b.action === 'request') {
    const [row] = await sql`SELECT sent_at, sends_hour, hour_start FROM otps WHERE email = ${email}`;
    if (row) {
      if (Date.now() - new Date(row.sent_at) < 60e3) return fail(429, 'Please wait a minute before asking for another code.');
      if (Date.now() - new Date(row.hour_start) < 3600e3 && row.sends_hour >= 5) return fail(429, 'Too many codes requested. Try again in an hour.');
    }
    const code = newCode();
    await sql`INSERT INTO otps (email, code_hash, expires_at, attempts, sent_at, sends_hour, hour_start)
      VALUES (${email}, ${hashCode(email, code)}, now() + interval '10 minutes', 0, now(), 1, now())
      ON CONFLICT (email) DO UPDATE SET code_hash = EXCLUDED.code_hash, expires_at = EXCLUDED.expires_at, attempts = 0, sent_at = now(),
        sends_hour = CASE WHEN otps.hour_start > now() - interval '1 hour' THEN otps.sends_hour + 1 ELSE 1 END,
        hour_start = CASE WHEN otps.hour_start > now() - interval '1 hour' THEN otps.hour_start ELSE now() END`;
    try {
      await sendMail({
        to: email, subject: `${code} is your ${SITE.name} sign-in code`,
        text: `Your ${SITE.name} sign-in code is ${code}\n\nIt expires in 10 minutes. If you did not ask for this code, you can ignore this email.\n\n${SITE.url}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#101820"><h2 style="margin:0 0 12px">${SITE.name}</h2><p>Your sign-in code is:</p><p style="font-size:32px;font-weight:800;letter-spacing:8px;margin:12px 0;color:#c8410b">${code}</p><p>It expires in 10 minutes. If you did not ask for this code, you can ignore this email.</p><p style="color:#6b7682;font-size:13px"><a href="${SITE.url}/sell-your-car/" style="color:#6b7682">${SITE.domain}</a></p></div>`,
      });
    } catch (e) {
      console.error('OTP mail failed', e.message);
      await sql`DELETE FROM otps WHERE email = ${email}`;
      return fail(502, 'We could not send the email right now. Please try again shortly.');
    }
    return json({ ok: true });
  }

  if (b.action === 'verify') {
    const code = String(b.code || '').replace(/\D/g, '');
    const [row] = await sql`UPDATE otps SET attempts = attempts + 1 WHERE email = ${email} RETURNING code_hash, expires_at, attempts`;
    if (!row || new Date(row.expires_at) < new Date()) return fail(400, 'That code has expired. Request a new one.');
    if (row.attempts > 5) return fail(429, 'Too many wrong attempts. Request a new code.');
    if (code.length !== 6 || hashCode(email, code) !== row.code_hash) return fail(400, 'Wrong code. Check the email and try again.');
    await sql`DELETE FROM otps WHERE email = ${email}`;
    return json({ user: { email, role: await roleOf(email) } }, 200, { 'set-cookie': sessionCookie(email) });
  }
  return fail(400, 'Unknown action');
});
