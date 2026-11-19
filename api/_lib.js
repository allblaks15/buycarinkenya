// Shared helpers for the marketplace API (Vercel functions). Files starting with _ are not routes.
import { neon } from '@neondatabase/serverless';
import { createHmac, createHash, timingSafeEqual, randomInt } from 'node:crypto';
import nodemailer from 'nodemailer';

export const SITE = { name: 'Buy Car in Kenya', url: 'https://buycarinkenya.co.ke', domain: 'buycarinkenya.co.ke' };
export const PAYMENT = { paybill: '880100', account: '747328' };
// Listing packages: the seller picks one when posting; days = null means listed until sold
export const PACKAGES = {
  '2w': { name: '2 weeks', days: 14, price: 450 },
  '1m': { name: '1 month', days: 30, price: 950 },
  unlimited: { name: 'Unlimited until sold', days: null, price: 1350 },
};
export const pkgOf = (l) => PACKAGES[l.package] || PACKAGES.unlimited;
export const MAX_PHOTOS = 12;

export const sql = neon(process.env.DATABASE_URL);

// ---------------------------------------------------------------- schema (created on first use)
let ready;
export const db = () => (ready ||= sql.transaction([
  sql`CREATE TABLE IF NOT EXISTS otps (email text PRIMARY KEY, code_hash text NOT NULL, expires_at timestamptz NOT NULL, attempts int NOT NULL DEFAULT 0, sent_at timestamptz NOT NULL DEFAULT now(), sends_hour int NOT NULL DEFAULT 1, hour_start timestamptz NOT NULL DEFAULT now())`,
  sql`CREATE TABLE IF NOT EXISTS listings (
    id serial PRIMARY KEY, slug text UNIQUE, user_email text NOT NULL,
    make text NOT NULL, model text NOT NULL, year int NOT NULL, price bigint NOT NULL, mileage int, fuel text, transmission text, body text,
    engine_cc int, colour text, condition text, location text NOT NULL, description text, seller_name text, phone text NOT NULL,
    photos jsonb NOT NULL DEFAULT '[]', status text NOT NULL DEFAULT 'awaiting_payment', mpesa_code text, reject_reason text,
    views int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
    paid_at timestamptz, approved_at timestamptz, sold_at timestamptz)`,
  sql`CREATE INDEX IF NOT EXISTS listings_status_idx ON listings (status, approved_at DESC)`,
  sql`CREATE INDEX IF NOT EXISTS listings_user_idx ON listings (user_email)`,
  sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS package text, ADD COLUMN IF NOT EXISTS expires_at timestamptz, ADD COLUMN IF NOT EXISTS accident text, ADD COLUMN IF NOT EXISTS extras jsonb NOT NULL DEFAULT '[]'`,
  sql`CREATE TABLE IF NOT EXISTS editors (email text PRIMARY KEY, added_by text, created_at timestamptz NOT NULL DEFAULT now())`,
]).catch((e) => { ready = null; throw e; }));

// ---------------------------------------------------------------- responses
export const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
export const fail = (status, error) => json({ error }, status);
export async function body(req) {
  if (!(req.headers.get('content-type') || '').includes('application/json')) throw new HttpError(415, 'Send JSON');
  try { return await req.json(); } catch { throw new HttpError(400, 'Invalid JSON'); }
}
export class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
// Wrap a handler so thrown HttpErrors become JSON responses
export const route = (fn) => async (req) => {
  try { await db(); return await fn(req); } catch (e) {
    if (e instanceof HttpError) return fail(e.status, e.message);
    console.error(e);
    return fail(500, 'Something went wrong. Please try again.');
  }
};

// ---------------------------------------------------------------- sessions (signed cookie, no server state)
const SECRET = process.env.SESSION_SECRET || '';
const COOKIE = 'bcik_session';
const sign = (v) => createHmac('sha256', SECRET).update(v).digest('base64url');
export function sessionCookie(email) {
  const v = Buffer.from(JSON.stringify({ e: email, x: Date.now() + 30 * 864e5 })).toString('base64url');
  return `${COOKIE}=${v}.${sign(v)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${30 * 86400}`;
}
export const clearCookie = `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
export function currentUser(req) {
  if (!SECRET) return null;
  const raw = (req.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
  if (!raw) return null;
  const [v, s] = raw.split('.');
  const good = sign(v || '');
  if (!s || s.length !== good.length || !timingSafeEqual(Buffer.from(s), Buffer.from(good))) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(v, 'base64url').toString());
    return x > Date.now() ? { email: e } : null;
  } catch { return null; }
}
export function requireUser(req) {
  const u = currentUser(req);
  if (!u) throw new HttpError(401, 'Please sign in again.');
  return u;
}
const admins = () => (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
// Staff roles: 'admin' (ADMIN_EMAILS env) manages everything incl. editors; 'editor' (editors table, added by an admin) can approve listings
export async function roleOf(email) {
  if (!email) return null;
  if (admins().includes(email)) return 'admin';
  const [row] = await sql`SELECT 1 FROM editors WHERE email = ${email}`;
  return row ? 'editor' : null;
}
export async function requireStaff(req, role = 'editor') {
  const u = requireUser(req);
  const r = await roleOf(u.email);
  if (!r || (role === 'admin' && r !== 'admin')) throw new HttpError(403, role === 'admin' ? 'Only the admin can do this.' : 'Admins and editors only.');
  return { ...u, role: r };
}

// ---------------------------------------------------------------- OTP
export const newCode = () => String(randomInt(0, 1e6)).padStart(6, '0');
export const hashCode = (email, code) => createHash('sha256').update(`${SECRET}:${email}:${code}`).digest('hex');
export const normEmail = (e) => String(e || '').trim().toLowerCase();
export const validEmail = (e) => /^[^\s@]{1,64}@[^\s@]+\.[a-z]{2,}$/i.test(e) && e.length <= 254;

// ---------------------------------------------------------------- email (SMTP from the hosting mailbox)
let transport;
export async function sendMail({ to, subject, text, html }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PASS) throw new Error('SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS)');
  transport ||= nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 465), secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, connectionTimeout: 10000, greetingTimeout: 10000,
  });
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  await transport.sendMail({ from: `"${SITE.name}" <${from}>`, to, subject, text, html });
}
export const notifyStaff = async (subject, text) => Promise.all([...admins(), ...(await sql`SELECT email FROM editors`).map((r) => r.email)].map((to) => sendMail({ to, subject, text }).catch((e) => console.error('admin mail', e.message))));

// ---------------------------------------------------------------- listings
export const STATUSES = ['awaiting_payment', 'pending_review', 'active', 'expired', 'sold', 'rejected'];
// A paid listing stays 'active' in the table; once its package runs out it is shown as 'expired'
export const LIVE = `status = 'active' AND (expires_at IS NULL OR expires_at > now())`;
export const statusOf = (l) => (l.status === 'active' && l.expires_at && new Date(l.expires_at) <= new Date() ? 'expired' : l.status);
export const slugify = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const listingTitle = (l) => `${l.year} ${l.make} ${l.model}`;
export const listingUrl = (l) => `${SITE.url}/used-cars/${l.slug}/`;
// Kenyan numbers to 2547XXXXXXXX / 2541XXXXXXXX
export function normPhone(p) {
  const d = String(p || '').replace(/\D/g, '');
  const m = d.match(/^(?:254|0)?([17]\d{8})$/);
  return m ? '254' + m[1] : null;
}
const txt = (v, max) => String(v ?? '').trim().replace(/\s+/g, ' ').slice(0, max);
const int = (v, min, max) => { const n = Math.round(Number(String(v ?? '').replace(/[^\d.]/g, ''))); return Number.isFinite(n) && n >= min && n <= max ? n : null; };
const oneOf = (v, list) => (list.includes(v) ? v : null);
export const OPTIONS = {
  fuel: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
  transmission: ['Automatic', 'Manual'],
  body: ['SUV', 'Sedan', 'Hatchback', 'Station Wagon', 'MPV', 'Pickup', 'Van', 'Truck', 'Bus', 'Sports Car'],
  condition: ['Locally used', 'Foreign used', 'Brand new'],
  accident: ['Accident free', 'Has been in an accident'],
  extras: ['Sunroof', 'Extra tyres', 'Spare wheel', 'Alloy rims', 'Leather seats', 'Electric seats', 'Reverse camera', 'Parking sensors', 'Navigation', 'Bluetooth / Android Auto', 'Push start / keyless', 'Cruise control',
    'Climate control', 'Tinted windows', 'Roof rails', 'Tow bar', 'Bull bar', 'Car tracker', 'Alarm', 'Dash cam', '4WD / AWD', 'Third row seats', 'New tyres', 'Full service history'],
};
const blobHost = (u) => { try { const h = new URL(u).hostname; return h.endsWith('.public.blob.vercel-storage.com'); } catch { return false; } };

// Validate seller input; returns a clean object or throws a 400 with the first problem
export function cleanListing(input) {
  const year = new Date().getFullYear();
  const l = {
    make: txt(input.make, 40), model: txt(input.model, 60), year: int(input.year, 1970, year + 1), price: int(input.price, 50000, 1e9),
    mileage: input.mileage === '' || input.mileage == null ? null : int(input.mileage, 0, 2e6),
    fuel: oneOf(input.fuel, OPTIONS.fuel), transmission: oneOf(input.transmission, OPTIONS.transmission), body: oneOf(input.body, OPTIONS.body),
    engine_cc: input.engine_cc === '' || input.engine_cc == null ? null : int(input.engine_cc, 50, 10000),
    colour: txt(input.colour, 30) || null, condition: oneOf(input.condition, OPTIONS.condition), location: txt(input.location, 60),
    description: String(input.description ?? '').trim().slice(0, 4000), seller_name: txt(input.seller_name, 60) || null, phone: normPhone(input.phone),
    accident: oneOf(input.accident, OPTIONS.accident),
    extras: Array.isArray(input.extras) ? [...new Set(input.extras.filter((x) => OPTIONS.extras.includes(x)))] : [],
    photos: Array.isArray(input.photos) ? input.photos.filter((p) => p && blobHost(p.url) && blobHost(p.thumb)).slice(0, MAX_PHOTOS).map((p) => ({ url: p.url, thumb: p.thumb })) : [],
  };
  const need = [['make', 'Choose the make'], ['model', 'Enter the model'], ['year', 'Enter a valid year'], ['price', 'Enter a price between KES 50,000 and KES 1 billion'], ['location', 'Enter where the car is (town)'], ['accident', 'Say whether the car has been in an accident'], ['phone', 'Enter a valid Kenyan phone number, e.g. 0712 345 678']];
  for (const [k, msg] of need) if (!l[k]) throw new HttpError(400, msg);
  if (input.mileage && l.mileage == null) throw new HttpError(400, 'Enter mileage in km');
  if (!l.photos.length) throw new HttpError(400, 'Add at least one photo');
  return l;
}
// What buyers may see
export const publicListing = (l) => ({
  id: l.id, slug: l.slug, url: `/used-cars/${l.slug}/`, title: listingTitle(l), make: l.make, model: l.model, year: l.year, price: Number(l.price), mileage: l.mileage,
  fuel: l.fuel, transmission: l.transmission, body: l.body, engine_cc: l.engine_cc, colour: l.colour, condition: l.condition, location: l.location,
  description: l.description, seller_name: l.seller_name, accident: l.accident, extras: l.extras || [], photos: l.photos, status: statusOf(l),
  phone: statusOf(l) === 'active' ? l.phone : null, posted: l.approved_at || l.created_at,
});
export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const kes = (n) => 'KES ' + Number(n).toLocaleString('en-KE');
