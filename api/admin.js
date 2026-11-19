// Staff dashboard: confirm M-Pesa payments and moderate listings.
// Admin = emails in ADMIN_EMAILS; editors are added by the admin and can approve, reject and unpublish.
//   GET  ?status=pending_review|active|...|all  -> listings with seller details (+ editors list for the admin)
//   POST { action: 'approve' | 'reject' | 'unpublish', id, reason? }      admin or editor
//   POST { action: 'delete', id } | { action: 'add_editor' | 'remove_editor', email }   admin only
import { del } from '@vercel/blob';
import { route, body, json, fail, sql, requireStaff, sendMail, normEmail, validEmail, listingTitle, listingUrl, STATUSES, SITE, PAYMENT, HttpError } from './_lib.js';


export const GET = route(async (req) => {
  const me = await requireStaff(req);
  const status = new URL(req.url).searchParams.get('status') || 'pending_review';
  const rows = status === 'all'
    ? await sql`SELECT * FROM listings ORDER BY updated_at DESC LIMIT 300`
    : await sql`SELECT * FROM listings WHERE status = ${STATUSES.includes(status) ? status : 'pending_review'} ORDER BY updated_at DESC LIMIT 300`;
  const [counts] = await sql`SELECT count(*) FILTER (WHERE status = 'pending_review')::int AS pending_review, count(*) FILTER (WHERE status = 'active')::int AS active,
    count(*) FILTER (WHERE status = 'sold')::int AS sold, count(*) FILTER (WHERE status = 'awaiting_payment')::int AS awaiting_payment, count(*) FILTER (WHERE status = 'rejected')::int AS rejected FROM listings`;
  const editors = me.role === 'admin' ? await sql`SELECT email, added_by, created_at FROM editors ORDER BY created_at` : undefined;
  return json({ me, listings: rows.map((l) => ({ ...l, price: Number(l.price), title: listingTitle(l), url: `/used-cars/${l.slug}/` })), counts, editors });
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
    const [saved] = await sql`UPDATE listings SET status = 'active', approved_at = COALESCE(approved_at, now()), reject_reason = NULL, updated_at = now() WHERE id = ${l.id} RETURNING *`;
    await tell(saved, `Your ${listingTitle(saved)} is now live`, `Good news! We confirmed your payment and your ${listingTitle(saved)} is now live:\n${listingUrl(saved)}\n\nBuyers will contact you directly on WhatsApp or by phone. It stays listed until you mark it as sold.`);
    return json({ ok: true });
  }
  if (b.action === 'reject') {
    const reason = String(b.reason || '').trim().slice(0, 300) || `We could not find your KSh ${PAYMENT.amount} payment.`;
    await sql`UPDATE listings SET status = 'rejected', reject_reason = ${reason}, updated_at = now() WHERE id = ${l.id}`;
    await tell(l, `Action needed for your ${listingTitle(l)} listing`, `Your ${listingTitle(l)} listing is not live yet.\n\nReason: ${reason}\n\nPay KSh ${PAYMENT.amount} via M-Pesa Paybill ${PAYMENT.paybill}, account ${PAYMENT.account}, then enter the M-Pesa code on your account page.`);
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
