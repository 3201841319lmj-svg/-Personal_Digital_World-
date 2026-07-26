import urllib.request
from io import BytesIO
from PIL import Image

url = 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-major-arcana-01.jpg'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
sheet_img = Image.open(BytesIO(urllib.request.urlopen(req).read()))

w, h = sheet_img.size
cols = 4
rows = 2
card_w = w / cols
card_h = h / rows

print(f"Sheet size: {w}x{h}, Slicing into 4x2 grid (Card size: {card_w}x{card_h})...")

for r in range(rows):
    for c in range(cols):
        box = (c * card_w, r * card_h, (c + 1) * card_w, (r + 1) * card_h)
        card_crop = sheet_img.crop(box)
        print(f"Slice ({r},{c}) cropped size:", card_crop.size)
