import urllib.request
import os
import time
from io import BytesIO
from PIL import Image, ImageStat

SHEETS = [
    ('Major_01', 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-major-arcana-01.jpg'),
    ('Major_02', 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-major-arcana-02.jpg'),
    ('Major_03', 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-major-arcana-03.jpg'),
    ('Wands_01', 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-wands-01.jpg'),
    ('Wands_02', 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-wands-02.jpg'),
    ('Cups_01', 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-cups-01.jpg'),
    ('Cups_02', 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-cups-02.jpg'),
    ('Swords_01', 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-swords-01.jpg'),
    ('Swords_02', 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-swords-02.jpg'),
    ('Coins_01', 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-coins-01.jpg'),
    ('Coins_02', 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-coins-02.jpg')
]

lines = []
for name, url in SHEETS:
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            content = urllib.request.urlopen(req, timeout=15).read()
            img = Image.open(BytesIO(content))
            break
        except Exception as e:
            time.sleep(1)
            
    w, h = img.size
    cols, rows = 4, 2
    cw, ch = w / cols, h / rows
    
    for r in range(rows):
        for c in range(cols):
            box = (c * cw, r * ch, (c + 1) * cw, (r + 1) * ch)
            crop = img.crop(box).convert('L')
            # Compute variance of central area
            cw_inner = crop.crop((cw*0.2, ch*0.2, cw*0.8, ch*0.8))
            stat = ImageStat.Stat(cw_inner)
            stddev = stat.stddev[0]
            mean = stat.mean[0]
            is_blank = (stddev < 15.0 or mean > 240.0)
            lines.append(f"{name} ({r},{c}): mean={mean:.1f}, stddev={stddev:.1f} -> {'BLANK' if is_blank else 'CARD'}")

out_path = os.path.join(os.path.dirname(__file__), "../slots_stats.txt")
with open(out_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print("Wrote stats to slots_stats.txt!")
