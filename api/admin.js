// Staff dashboard: confirm M-Pesa payments and moderate listings.
// Admin = emails in ADMIN_EMAILS; editors are added by the admin and can approve, reject and unpublish.
//   GET  ?status=pending_review|active|...|all  -> listings with seller details (+ editors list for the admin)
//   POST { action: 'approve' | 'reject' | 'unpublish', id, reason? }      admin or editor
//   POST { action: 'delete', id } | { action: 'add_editor' | 'remove_editor', email }   admin only
import { del } from '@vercel/blob';
import { route, body, json, fail, sql, requireStaff, sendMail, normEmail, validEmail, listingTitle, listingUrl, STATUSES, SITE, PAYMENT, pkgOf, statusOf, LIVE, activate, HttpError } from './_lib.js';

export const GET = route(async (req) => {
  const me = await requireStaff(req);
  const status = new URL(req.url).searchParams.get('status') || 'pending_review';
  const EXPIRED = `status = 'active' AND expires_at <= now()`;
  const filter = status === 'all' ? 'TRUE' : status === 'active' ? LIVE : status === 'expired' ? EXPIRED : 'status = $1';
  const rows = await sql.query(`SELECT * FROM listings WHERE ${filter} ORDER BY updated_at DESC LIMIT 300`, filter.includes('$1') ? [STATUSES.includes(status) ? status : 'pending_review'] : []);
  const [counts] = await sql.query(`SELECT count(*) FILTER (WHERE status = 'pending_review')::int AS pending_review, count(*) FILTER (WHERE ${LIVE})::int AS active,
    count(*) FILTER (WHERE ${EXPIRED})::int AS expired, count(*) FILTER (WHERE status = 'sold')::int AS sold, count(*) FILTER (WHERE status = 'awaiting_payment')::int AS awaiting_payment,
    count(*) FILTER (WHERE status = 'rejected')::int AS rejected FROM listings`);
  const editors = me.role === 'admin' ? await sql`SELECT email, added_by, created_at FROM editors ORDER BY created_at` : undefined;
  return json({ me, listings: rows.map((l) => ({ ...l, status: statusOf(l), price: Number(l.price), title: listingTitle(l), url: `/used-cars/${l.slug}/`, package_name: pkgOf(l).name, package_price: pkgOf(l).price })), counts, editors });
});

const tell = (l, subject, text) => sendMail({ to: l.user_email, subject, text: `${text}\n\nManage your listings: ${SITE.url}/account/\n\n${SITE.name}` }).catch((e) => console.error('seller mail', e.message));

export const POST = route(async (req) => {
  const me = await requireStaff(req);
  const b = await body(req);
  if (b.action === 'add_editor' || b.action === 'remove_editor') {
    if (me.role !== 'admin') throw new HttpError(403, 'Only the admin can manage editors.');
    const email = normEmail(b.email);
    if (!validEmail(email)) return fail(400, 'Enter a valid email address.');
    if (b.action === 'add_editor') await sql`INSERT INTO editors (email, added_by) VALUES (${email}, ${me.email}) ON CONFLICT DO NOTHING`;
    else await sql`DELETE FROM editors WHERE email = ${email}`;
    return json({ editors: await sql`SELECT email, added_by, created_at FROM editors ORDER BY created_at` });
  }
  const [l] = await sql`SELECT * FROM listings WHERE id = ${Number(b.id) || 0}`;
  if (!l) return fail(404, 'Listing not found.');

  if (b.action === 'approve') {
    // The package clock starts when the listing goes live
    await activate(l);
    return json({ ok: true });
  }
  if (b.action === 'reject') {
    const reason = String(b.reason || '').trim().slice(0, 300) || `We could not find your KSh ${pkgOf(l).price} payment.`;
    await sql`UPDATE listings SET status = 'rejected', reject_reason = ${reason}, updated_at = now() WHERE id = ${l.id}`;
    await tell(l, `Action needed for your ${listingTitle(l)} listing`, `Your ${listingTitle(l)} listing is not live yet.\n\nReason: ${reason}\n\nPay KSh ${pkgOf(l).price} (${pkgOf(l).name} package) via M-Pesa Paybill ${PAYMENT.paybill}, account ${PAYMENT.account}, then enter the M-Pesa code on your account page.`);
    return json({ ok: true });
  }
  if (b.action === 'unpublish') {
    await sql`UPDATE listings SET status = 'rejected', reject_reason = ${String(b.reason || 'Removed by admin').slice(0, 300)}, updated_at = now() WHERE id = ${l.id}`;
    return json({ ok: true });
  }
  if (b.action === 'delete') {
    if (me.role !== 'admin') throw new HttpError(403, 'Only the admin can delete listings.');
    await sql`DELETE FROM listings WHERE id = ${l.id}`;
    await del(l.photos.flatMap((p) => [p.url, p.thumb])).catch((e) => console.error('blob del', e.message));
    return json({ ok: true });
  }
  return fail(400, 'Unknown action');
});
