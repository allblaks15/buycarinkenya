// Marketplace listings.
//   GET  ?make&body&fuel&q&min&max&sort&page  -> active listings for buyers
//   GET  ?mine=1                              -> the signed-in seller's listings (any status)
//   POST { action: 'create' | 'update' | 'pay' | 'sold' | 'relist' | 'delete', ... }
import { del } from '@vercel/blob';
import { route, body, json, fail, sql, requireUser, cleanListing, publicListing, slugify, listingTitle, notifyStaff, kes, PAYMENT, HttpError } from './_lib.js';

const PAGE = 24;
const mine = (l) => ({ ...publicListing(l), phone: l.phone, status: l.status, mpesa_code: l.mpesa_code, reject_reason: l.reject_reason, views: l.views, created_at: l.created_at });

export const GET = route(async (req) => {
  const q = new URL(req.url).searchParams;
  if (q.get('mine')) {
    const u = requireUser(req);
    const rows = await sql`SELECT * FROM listings WHERE user_email = ${u.email} ORDER BY created_at DESC`;
    return json({ listings: rows.map(mine) });
  }
  const where = [`status = 'active'`]; const args = [];
  const add = (clause, v) => { args.push(v); where.push(clause.replace('?', '$' + args.length)); };
  if (q.get('make')) add('make ILIKE ?', q.get('make'));
  if (q.get('body')) add('body = ?', q.get('body'));
  if (q.get('fuel')) add('fuel = ?', q.get('fuel'));
  if (q.get('min')) add('price >= ?', Number(q.get('min')) || 0);
  if (q.get('max')) add('price <= ?', Number(q.get('max')) || 1e12);
  if (q.get('q')) add(`(make || ' ' || model || ' ' || year || ' ' || location) ILIKE ?`, `%${q.get('q').slice(0, 60).replace(/[%_\\]/g, '\\$&')}%`);
  const order = { price_asc: 'price ASC', price_desc: 'price DESC', year: 'year DESC' }[q.get('sort')] || 'approved_at DESC';
  const page = Math.max(1, Math.min(100, Number(q.get('page')) || 1));
  const limit = Math.min(PAGE, Number(q.get('limit')) || PAGE);
  const rows = await sql.query(`SELECT *, count(*) OVER() AS total FROM listings WHERE ${where.join(' AND ')} ORDER BY ${order}, id DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`, args);
  return json({ listings: rows.map(publicListing), total: Number(rows[0]?.total || 0), page, pages: Math.ceil((rows[0]?.total || 0) / limit) },
    200, { 'cache-control': 'public, s-maxage=30, stale-while-revalidate=120' });
});

async function own(id, email) {
  const [l] = await sql`SELECT * FROM listings WHERE id = ${Number(id) || 0}`;
  if (!l || l.user_email !== email) throw new HttpError(404, 'Listing not found.');
  return l;
}

export const POST = route(async (req) => {
  const u = requireUser(req);
  const b = await body(req);

  if (b.action === 'create') {
    const [{ n }] = await sql`SELECT count(*)::int AS n FROM listings WHERE user_email = ${u.email} AND status IN ('awaiting_payment', 'rejected')`;
    if (n >= 5) return fail(429, 'You have 5 unpaid listings. Pay for or delete one before adding another.');
    const l = cleanListing(b);
    const [row] = await sql`INSERT INTO listings (user_email, make, model, year, price, mileage, fuel, transmission, body, engine_cc, colour, condition, location, description, seller_name, phone, photos)
      VALUES (${u.email}, ${l.make}, ${l.model}, ${l.year}, ${l.price}, ${l.mileage}, ${l.fuel}, ${l.transmission}, ${l.body}, ${l.engine_cc}, ${l.colour}, ${l.condition}, ${l.location}, ${l.description}, ${l.seller_name}, ${l.phone}, ${JSON.stringify(l.photos)})
      RETURNING id`;
    const slug = `${slugify(`${l.year} ${l.make} ${l.model} ${l.location}`)}-${row.id}`;
    const [saved] = await sql`UPDATE listings SET slug = ${slug} WHERE id = ${row.id} RETURNING *`;
    return json({ listing: mine(saved) });
  }

  const l = await own(b.id, u.email);

  if (b.action === 'update') {
    const n = cleanListing(b);
    // Once paid, the car itself can't be swapped for another one
    if (l.status !== 'awaiting_payment' && l.status !== 'rejected') Object.assign(n, { make: l.make, model: l.model, year: l.year });
    const removed = l.photos.filter((p) => !n.photos.some((q) => q.url === p.url));
    const [saved] = await sql`UPDATE listings SET make = ${n.make}, model = ${n.model}, year = ${n.year}, price = ${n.price}, mileage = ${n.mileage}, fuel = ${n.fuel},
      transmission = ${n.transmission}, body = ${n.body}, engine_cc = ${n.engine_cc}, colour = ${n.colour}, condition = ${n.condition}, location = ${n.location},
      description = ${n.description}, seller_name = ${n.seller_name}, phone = ${n.phone}, photos = ${JSON.stringify(n.photos)}, updated_at = now()
      WHERE id = ${l.id} RETURNING *`;
    if (removed.length) await del(removed.flatMap((p) => [p.url, p.thumb])).catch((e) => console.error('blob del', e.message));
    return json({ listing: mine(saved) });
  }

  if (b.action === 'pay') {
    if (!['awaiting_payment', 'rejected'].includes(l.status)) return fail(400, 'This listing does not need a payment.');
    const code = String(b.mpesa_code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!/^[A-Z0-9]{10}$/.test(code)) return fail(400, 'Enter the 10-character M-Pesa code from your confirmation SMS, e.g. TKL4XY7Q2B.');
    const [dupe] = await sql`SELECT id FROM listings WHERE mpesa_code = ${code} AND id <> ${l.id}`;
    if (dupe) return fail(400, 'That M-Pesa code has already been used for another listing.');
    const [saved] = await sql`UPDATE listings SET mpesa_code = ${code}, status = 'pending_review', paid_at = now(), reject_reason = NULL, updated_at = now() WHERE id = ${l.id} RETURNING *`;
    await notifyStaff(`New payment to confirm: ${listingTitle(saved)} (${code})`,
      `A seller says they paid KSh ${PAYMENT.amount} to Paybill ${PAYMENT.paybill}, account ${PAYMENT.account}.\n\nM-Pesa code: ${code}\nCar: ${listingTitle(saved)}, ${kes(saved.price)}\nSeller: ${saved.seller_name || ''} ${saved.phone} <${saved.user_email}>\n\nApprove or reject it: https://buycarinkenya.co.ke/admin/`);
    return json({ listing: mine(saved) });
  }

  if (b.action === 'sold') {
    if (l.status !== 'active') return fail(400, 'Only live listings can be marked as sold.');
    const [saved] = await sql`UPDATE listings SET status = 'sold', sold_at = now(), updated_at = now() WHERE id = ${l.id} RETURNING *`;
    return json({ listing: mine(saved) });
  }

  if (b.action === 'relist') {
    // Undo an accidental "sold" within 7 days
    if (l.status !== 'sold' || Date.now() - new Date(l.sold_at) > 7 * 864e5) return fail(400, 'This listing can no longer be relisted. Contact us for help.');
    const [saved] = await sql`UPDATE listings SET status = 'active', sold_at = NULL, updated_at = now() WHERE id = ${l.id} RETURNING *`;
    return json({ listing: mine(saved) });
  }

  if (b.action === 'delete') {
    await sql`DELETE FROM listings WHERE id = ${l.id}`;
    await del(l.photos.flatMap((p) => [p.url, p.thumb])).catch((e) => console.error('blob del', e.message));
    return json({ ok: true });
  }
  return fail(400, 'Unknown action');
});
