// /sitemap-listings.xml: every live car for sale, with its photos (rewritten here by vercel.json).
import { sql, db, esc, listingTitle, listingUrl } from './_lib.js';

export async function GET() {
  let rows = [];
  try { await db(); rows = await sql`SELECT slug, make, model, year, location, photos, updated_at FROM listings WHERE status = 'active' ORDER BY approved_at DESC LIMIT 45000`; } catch (e) { console.error(e); }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${rows.map((l) => `<url><loc>${esc(listingUrl(l))}</loc><lastmod>${new Date(l.updated_at).toISOString().slice(0, 10)}</lastmod><priority>0.7</priority>${(l.photos || []).slice(0, 5).map((p) => `<image:image><image:loc>${esc(p.url)}</image:loc><image:title>${esc(`${listingTitle(l)} for sale in ${l.location}`)}</image:title></image:image>`).join('')}</url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, s-maxage=600, stale-while-revalidate=3600' } });
}
