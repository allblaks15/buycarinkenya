"""Dev helper: render a labelled grid of every model's photos to eyeball wrong/poor images.
Usage: python scripts/contact_sheet.py OUT.png [start] [count]"""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw
ROOT = Path(__file__).resolve().parent.parent
cred = json.loads((ROOT / 'src/data/image-credits.json').read_text('utf8'))
items = list(cred.items())[int(sys.argv[2]) if len(sys.argv) > 2 else 0:][: int(sys.argv[3]) if len(sys.argv) > 3 else 999]
W, H, cols = 240, 160, 3
sheet = Image.new('RGB', (cols * W + 170, len(items) * (H + 4)), 'white')
d = ImageDraw.Draw(sheet)
for r, (slug, imgs) in enumerate(items):
    y = r * (H + 4)
    d.text((4, y + 55), slug[:26], fill='black')
    for c, im in enumerate(imgs[:cols]):
        p = ROOT / 'src/assets/img/cars' / im['file'].replace('.webp', '-sm.webp')
        if p.exists(): sheet.paste(Image.open(p).resize((W, H)), (170 + c * W, y))
sheet.save(sys.argv[1])
