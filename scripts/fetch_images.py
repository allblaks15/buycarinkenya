"""Download free-licensed car photos from Wikimedia Commons for every model in src/data/cars.js.

Usage:  python scripts/fetch_images.py            (skips models that already have images)
        python scripts/fetch_images.py toyota-vitz (re-fetch specific slugs)
Writes: src/assets/img/cars/<slug>-<n>.webp and src/data/image-credits.json
"""
import io, json, re, subprocess, sys, time, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'assets' / 'img' / 'cars'
CREDITS = ROOT / 'src' / 'data' / 'image-credits.json'
# Photos rejected after manual review (wrong car, interior, close-up…) – never picked again
BLOCKLIST = ROOT / 'src' / 'data' / 'image-blocklist.json'
BLOCKED = set(json.loads(BLOCKLIST.read_text('utf8'))) if BLOCKLIST.exists() else set()
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'ElisaMotorsSiteBuild/1.0 (https://elisamotors.co.ke; image credits kept on /credits/)'
PER_MODEL = 3
BAD = re.compile(r'(?<![a-z])(?:interior|innen|innenraum|int[ée]rieur|cockpit|dashboard|engine|powertrain|hybrid system|motor(?:raum)?|heck|rear|back|tail|badge|logo|emblem|wheel|rim|seat|trunk|boot|light|lamp|detail|steering|instrument|scale|model car|diecast|tomica|minicar|toy|crash|damaged|wreck|accident|burn|rally|race|racing|drift|police|polizei|ambulance|svg|drawing|sketch|map|chassis|cutaway|display|dealer|showroom|museum|mirror|door|grille|console|gauge|meter|key|navi|screen|shifter|lever|hood|bonnet|roof|tire|tyre|brake|underside|pickup bed|cargo)(?![a-z])', re.I)
GOOD = re.compile(r'front|vorne|avant|frontal|\bf\b|3/4|three.quarter|fl\b', re.I)


def get(params):
    url = API + '?' + urllib.parse.urlencode({**params, 'format': 'json'})
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:  # noqa
            time.sleep(2 + attempt * 3)
    raise RuntimeError('API failed: ' + url)


def download(url):
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except Exception:
            time.sleep(3 + attempt * 5)
    return None


def strip_html(s):
    return re.sub(r'<[^>]+>', '', s or '').strip()


def candidates(query):
    data = get({'action': 'query', 'list': 'search', 'srnamespace': 6, 'srsearch': query + ' filetype:bitmap', 'srlimit': 40})
    titles = [h['title'] for h in data.get('query', {}).get('search', [])]
    titles = [t for t in titles if re.search(r'\.(jpe?g|png)$', t, re.I) and not BAD.search(t) and t.replace('File:', '') not in BLOCKED]
    # bump likely front three-quarter shots but otherwise keep search relevance order
    titles.sort(key=lambda t: 0 if GOOD.search(t) else 1)
    return titles[:14]


def info(titles):
    data = get({'action': 'query', 'titles': '|'.join(titles), 'prop': 'imageinfo',
                'iiprop': 'url|size|extmetadata', 'iiurlwidth': 1280})
    out = {}
    for p in data.get('query', {}).get('pages', {}).values():
        ii = (p.get('imageinfo') or [None])[0]
        if not ii:
            continue
        meta = ii.get('extmetadata', {})
        out[p['title']] = {
            'thumb': ii.get('thumburl') or ii['url'], 'w': ii['width'], 'h': ii['height'],
            'page': ii.get('descriptionurl'),
            'artist': strip_html(meta.get('Artist', {}).get('value'))[:120] or 'Unknown',
            'license': strip_html(meta.get('LicenseShortName', {}).get('value')) or 'See source',
        }
    return out


def save(raw, dest):
    im = Image.open(io.BytesIO(raw)).convert('RGB')
    w, h = im.size
    target = 3 / 2
    if w / h > target:  # too wide: trim sides
        nw = int(h * target); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
    else:  # too tall: trim top/bottom, biased to keep the car (lower-middle)
        nh = int(w / target); y = int((h - nh) * 0.55); im = im.crop((0, y, w, y + nh))
    im.resize((1200, 800), Image.LANCZOS).save(dest.with_suffix('.webp'), 'WEBP', quality=78, method=6)
    im.resize((600, 400), Image.LANCZOS).save(dest.with_name(dest.stem + '-sm.webp'), 'WEBP', quality=74, method=6)


def load_cars():
    js = "import('./src/data/cars.js').then(m=>console.log(JSON.stringify(m.cars.map(c=>({slug:c.slug,q:c.q,make:c.make,model:c.model})))))"
    res = subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True)
    return json.loads(res.stdout)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    credits = json.loads(CREDITS.read_text('utf8')) if CREDITS.exists() else {}
    only = set(sys.argv[1:])
    for car in load_cars():
        slug = car['slug']
        if only and slug not in only:
            continue
        have = [c for c in credits.get(slug, []) if (OUT / c['file']).exists()]
        if not only and len(have) >= 2:
            continue
        # Try the curated query first, then broader fallbacks until we have enough photos
        queries = list(dict.fromkeys([car['q'], f"{car['make']} {car['model']}", f"{car['make']} {car['model']} front", f"{car['make']} {car['model'].split(' (')[0].split(' /')[0]}"]))
        picked, seen = [], set()
        for q in queries:
            titles = [t for t in candidates(q) if t not in seen]
            seen.update(titles)
            if not titles:
                continue
            meta = info(titles)
            for t in titles:
                m = meta.get(t)
                if not m or m['w'] < 800 or m['w'] <= m['h'] * 1.1:  # need decent landscape photos
                    continue
                raw = download(m['thumb'])
                if not raw:
                    continue
                n = len(picked) + 1
                try:
                    save(raw, OUT / f'{slug}-{n}.jpg')
                except Exception as e:
                    print('   skip', t, e); continue
                picked.append({'file': f'{slug}-{n}.webp', 'title': t.replace('File:', ''), 'artist': m['artist'], 'license': m['license'], 'source': m['page']})
                time.sleep(0.4)
                if len(picked) == PER_MODEL:
                    break
            if len(picked) == PER_MODEL:
                break
        if not picked:
            print('!! no results', slug); continue
        credits[slug] = picked
        print(f'{slug}: {len(picked)} images')
        CREDITS.write_text(json.dumps(credits, indent=1, ensure_ascii=False), 'utf8')


if __name__ == '__main__':
    main()
