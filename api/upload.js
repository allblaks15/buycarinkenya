// Photo upload. The browser resizes each photo first, then POSTs the JPEG/WebP bytes here.
//   POST ?kind=main|thumb  (body: image bytes)  -> { url }
import { put } from '@vercel/blob';
import { createHash } from 'node:crypto';
import { route, json, fail, requireUser } from './_lib.js';

const TYPES = { 'image/jpeg': 'jpg', 'image/webp': 'webp' };
const MAX = 3 * 1024 * 1024;

export const POST = route(async (req) => {
  const u = requireUser(req);
  const type = (req.headers.get('content-type') || '').split(';')[0];
  if (!TYPES[type]) return fail(415, 'Photos must be JPEG or WebP.');
  if (Number(req.headers.get('content-length') || 0) > MAX) return fail(413, 'Photo is too large.');
  const bytes = Buffer.from(await req.arrayBuffer());
  if (!bytes.length || bytes.length > MAX) return fail(413, 'Photo is too large.');
  const kind = new URL(req.url).searchParams.get('kind') === 'thumb' ? 'thumb' : 'main';
  const owner = createHash('sha256').update(u.email).digest('hex').slice(0, 16);
  const blob = await put(`listings/${owner}/${kind}.${TYPES[type]}`, bytes, { access: 'public', addRandomSuffix: true, contentType: type, cacheControlMaxAge: 31536000 });
  return json({ url: blob.url });
});
