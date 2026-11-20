// Online payment with Paystack (M-Pesa or card). A successful payment puts the listing live straight away.
//   POST { id, package }  -> { url }  Paystack checkout to redirect the seller to
//   GET  ?reference=...   -> { paid, listing? }  called when Paystack sends the seller back to /account/
import { randomBytes } from 'node:crypto';
import { route, body, json, fail, sql, requireUser, paystack, settlePayment, statusOf, PACKAGES, SITE, listingTitle } from './_lib.js';

export const POST = route(async (req) => {
  const u = requireUser(req);
  const b = await body(req);
  const [l] = await sql`SELECT * FROM listings WHERE id = ${Number(b.id) || 0}`;
  if (!l || l.user_email !== u.email) return fail(404, 'Listing not found.');
  if (!['awaiting_payment', 'rejected', 'expired'].includes(statusOf(l))) return fail(400, 'This listing does not need a payment.');
  const pkg = PACKAGES[b.package] ? b.package : (l.package || 'unlimited');
  const p = PACKAGES[pkg];
  const reference = `bcik_${l.id}_${randomBytes(6).toString('hex')}`;
  await sql`INSERT INTO payments (reference, listing_id, user_email, package, amount) VALUES (${reference}, ${l.id}, ${u.email}, ${pkg}, ${p.price})`;
  const tx = await paystack('/transaction/initialize', { method: 'POST', body: JSON.stringify({
    email: u.email, amount: p.price * 100, currency: 'KES', reference, callback_url: `${SITE.url}/account/`,
    metadata: { listing_id: l.id, package: pkg, custom_fields: [{ display_name: 'Car', variable_name: 'car', value: listingTitle(l) }, { display_name: 'Package', variable_name: 'package', value: p.name }] },
  }) });
  return json({ url: tx.authorization_url, reference });
});

export const GET = route(async (req) => {
  requireUser(req);
  const reference = (new URL(req.url).searchParams.get('reference') || '').replace(/[^\w-]/g, '');
  const [pay] = reference ? await sql`SELECT * FROM payments WHERE reference = ${reference}` : [];
  if (!pay) return fail(404, 'Payment not found.');
  if (pay.status !== 'success') {
    const tx = await paystack(`/transaction/verify/${encodeURIComponent(reference)}`);
    await settlePayment(tx);
  }
  const [after] = await sql`SELECT status FROM payments WHERE reference = ${reference}`;
  return json({ paid: after.status === 'success', package: PACKAGES[pay.package].name, amount: pay.amount });
});
