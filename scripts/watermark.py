"""Stamp "Import car with Elisa Motors" onto every car photo.

Originals stay in src/assets/img/cars/ (untouched); watermarked copies go to src/assets/img/cars-wm/,
which the build publishes. Only new or changed photos are processed.
Usage: python scripts/watermark.py [--force]
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src' / 'assets' / 'img' / 'cars'
OUT = ROOT / 'src' / 'assets' / 'img' / 'cars-wm'
TEXT = 'Import car with Elisa Motors'
SUB = 'elisamotors.co.ke'
NAVY, ORANGE = (14, 42, 58), (224, 86, 26)
FONT_BOLD = ['C:/Windows/Fonts/segoeuib.ttf', 'C:/Windows/Fonts/arialbd.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']
FONT_REG = ['C:/Windows/Fonts/segoeui.ttf', 'C:/Windows/Fonts/arial.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']


def font(paths, size):
    for p in paths:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def logo(size):
    """The Elisa Motors 'E' mark, drawn at `size` px."""
    m = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=size // 4, fill=NAVY + (255,))
    k, w = size / 40, max(2, int(size / 10))
    for x1, y1, x2, y2 in [(13, 11, 27, 11), (13, 20, 23, 20), (13, 29, 27, 29), (13, 11, 13, 29)]:
        d.line([(x1 * k, y1 * k), (x2 * k, y2 * k)], fill='white', width=w)
    d.ellipse([(26) * k, (17) * k, (32) * k, (23) * k], fill=ORANGE + (255,))
    return m


def stamp(path_in, path_out):
    im = Image.open(path_in).convert('RGBA')
    W, H = im.size
    s = W / 1200                                   # scale relative to the large image
    big, small = font(FONT_BOLD, max(12, int(30 * s))), font(FONT_REG, max(9, int(18 * s)))
    pad, gap = int(14 * s) + 4, int(12 * s) + 3
    tb, sb = big.getbbox(TEXT), small.getbbox(SUB)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    sw, sh = sb[2] - sb[0], sb[3] - sb[1]
    lg = int((th + sh) * 1.25)
    bw = pad * 2 + lg + gap + max(tw, sw)
    bh = pad * 2 + max(lg, th + sh + int(8 * s))
    margin = int(22 * s) + 4
    x0, y0 = W - bw - margin, H - bh - margin

    layer = Image.new('RGBA', im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle([x0, y0, x0 + bw, y0 + bh], radius=bh // 2 if bh < 60 else int(18 * s) + 6, fill=(255, 255, 255, 215))
    layer.alpha_composite(logo(lg), (x0 + pad, y0 + (bh - lg) // 2))
    tx = x0 + pad + lg + gap
    ty = y0 + (bh - (th + sh + int(8 * s))) // 2
    d.text((tx, ty - tb[1]), TEXT, font=big, fill=NAVY + (255,))
    d.text((tx, ty + th + int(8 * s) - sb[1]), SUB, font=small, fill=ORANGE + (255,))
    # subtle diagonal brand mark in the centre to deter re-use
    cf = font(FONT_BOLD, max(16, int(64 * s)))
    cw = cf.getbbox('ELISA MOTORS')
    tile = Image.new('RGBA', (cw[2] + 20, cw[3] + 20), (0, 0, 0, 0))
    ImageDraw.Draw(tile).text((10, 10 - cw[1]), 'ELISA MOTORS', font=cf, fill=(255, 255, 255, 38))
    tile = tile.rotate(18, expand=True, resample=Image.BICUBIC)
    layer.alpha_composite(tile, ((W - tile.width) // 2, (H - tile.height) // 2 - int(20 * s)))

    out = Image.alpha_composite(im, layer).convert('RGB')
    out.save(path_out, 'WEBP', quality=78 if W >= 1000 else 74, method=6)


def main():
    force = '--force' in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    done = 0
    for f in sorted(SRC.glob('*.webp')):
        dest = OUT / f.name
        if not force and dest.exists() and dest.stat().st_mtime >= f.stat().st_mtime:
            continue
        stamp(f, dest)
        done += 1
    # remove watermarked copies whose original no longer exists
    for f in OUT.glob('*.webp'):
        if not (SRC / f.name).exists():
            f.unlink()
    print(f'Watermarked {done} new/changed photos ({len(list(OUT.glob("*.webp")))} total)')


if __name__ == '__main__':
    main()
