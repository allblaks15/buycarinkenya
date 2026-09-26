# Elisa Motors – elisamotors.co.ke

Car import website for Kenya (Japan · UK · South Africa). It is a static site generator with no framework and no dependencies. Node builds plain HTML that any shared host (Hostinger, cPanel, Truehost, etc.) can serve.

## 1. Set your contact details (important)
Edit **`src/config.js`**:
- `whatsapp`: your WhatsApp number, digits only, e.g. `254712345678`. Every order goes here.
- `phone`, `email`, `address`, `hours`
- `email` is where orders are emailed. Create this mailbox in your hosting panel.
- `mailFrom` must be an address on **your own domain** (e.g. `orders@elisamotors.co.ke`) or hosts will reject the mail.

## 2. Build
```bash
npm run build        # writes everything to ./dist
node scripts/serve.js   # preview at http://localhost:5173
```

## 3. Upload
Upload the **contents** of `dist/` (including the hidden `.htaccess`) into `public_html/` on your host.
PHP must be enabled (it is on all normal shared hosting), because `send-order.php` emails the orders.

After going live:
1. Open https://elisamotors.co.ke, place a test order, and confirm the email arrives (check spam).
2. **Google Search Console** (https://search.google.com/search-console):
   - Add property → *URL prefix* → `https://elisamotors.co.ke/`
   - Choose *HTML tag* verification, copy only the `content="…"` value into `googleVerification` in `src/config.js`, rebuild, re-upload, click *Verify*
   - Sitemaps → submit `sitemap.xml` (it lists all ~800 pages plus every car photo)
   - Use *URL Inspection → Request indexing* for the home page and your top 10 car pages to speed things up
3. Optional: add the site to **Bing Webmaster Tools** (it can import from Search Console; `bingVerification` in config).
4. Create a **Google Business Profile** for Elisa Motors. This matters a lot for "car importers Nairobi" searches.

Run `npm run audit` after any change. It checks every page for canonical URL, index/follow, sitemap presence, inbound links (no orphans), unique titles and descriptions, a single H1, image alt/title text and broken links.

## Editing cars
All models, versions, specs and prices are in **`src/data/cars.js`** and **`src/data/more-cars.js`**; key features per model are in **`src/data/features.js`**. Each version is one line:
```js
V('TX-L 2.8 Diesel', 2755, 'Diesel', 204, '6-speed Automatic', '4WD', '11 km/L', 7.8, 8.8, 'Leather, sunroof, 7 seats')
//  name              cc    fuel      hp   gearbox              drive  economy   price (KES millions)  what this trim adds
```
Add a model, then run `npm run images` (fetches photos from Wikimedia Commons for new models only) and `npm run build`.
To replace a model's photos with your own, drop `slug-1.webp`, `slug-1-sm.webp` (1200×800 / 600×400) into `src/assets/img/cars/` and update `src/data/image-credits.json`.

## How orders work
Customer picks a version → "Order this spec" → fills name/phone → **WhatsApp opens with the full order pre-typed** to your number, and at the same time `send-order.php` **emails** the order to you (with a reference number, e.g. `EM-K3F9AB`) and sends the customer an acknowledgement if they gave an email.

## SEO included
- A unique page per model (`/cars/toyota-land-cruiser-prado/`) **and per version** (`/cars/toyota-land-cruiser-prado/tx-l-2-8-diesel/`), per make, body type, fuel and source country
- Keyword image filenames (`…-for-sale-kenya-1.webp`), keyword alt + title text on every image, and an image sitemap
- HTML sitemap page at `/sitemap/` linking every page
- Import guide page targeting "how to import a car to Kenya"
- Titles, meta descriptions, canonical URLs, Open Graph/Twitter cards, `en-KE` locale
- Schema.org: AutoDealer, Product/Car with KES AggregateOffer, FAQPage, BreadcrumbList, HowTo, ItemList, WebSite search
- `sitemap.xml`, `robots.txt`, fast static pages, WebP images, lazy loading, mobile-first layout

Prices in `cars.js` are indicative estimates. Review them against current KRA CRSP values and your supplier costs.
