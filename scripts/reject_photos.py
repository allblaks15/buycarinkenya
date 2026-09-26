"""Reject bad photos after review.  Usage: python scripts/reject_photos.py toyota-gr-supra:1,2,3 toyota-dyna:1
Numbers are positions in the model's photo list (1 = main photo). Rejected photos are removed,
their files deleted and their titles blocklisted so `npm run images` never picks them again.
Then run: python scripts/fetch_images.py   (refills models left with fewer than 2 photos)
"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CREDITS = ROOT / 'src/data/image-credits.json'
BLOCKLIST = ROOT / 'src/data/image-blocklist.json'
IMG = ROOT / 'src/assets/img'

credits = json.loads(CREDITS.read_text('utf8'))
blocked = set(json.loads(BLOCKLIST.read_text('utf8'))) if BLOCKLIST.exists() else set()
for arg in sys.argv[1:]:
    slug, nums = arg.split(':')
    photos = credits.get(slug, [])
    drop = {int(n) - 1 for n in nums.split(',')}
    for i in sorted(drop):
        if i >= len(photos):
            print(f'  {slug}: no photo #{i + 1}'); continue
        p = photos[i]
        blocked.add(p['title'])
        for d in ('cars', 'cars-wm'):
            for f in (p['file'], p['file'].replace('.webp', '-sm.webp')):
                (IMG / d / f).unlink(missing_ok=True)
    credits[slug] = [p for i, p in enumerate(photos) if i not in drop]
    print(f'{slug}: kept {len(credits[slug])}')
CREDITS.write_text(json.dumps(credits, indent=1, ensure_ascii=False), 'utf8')
BLOCKLIST.write_text(json.dumps(sorted(blocked), indent=1, ensure_ascii=False), 'utf8')
