import urllib.request
from io import BytesIO
from PIL import Image

url = 'https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-major-arcana-01.jpg'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
img = Image.open(BytesIO(urllib.request.urlopen(req).read()))

print('Image size:', img.size)

# If size is (1200, 1006), let's test grid layouts
# Usually 4 columns and 2 rows per sheet = 8 cards per image file!
# Or 7 columns and 2 rows!
# A standard tarot card has width:height ratio approx 1:1.6 or 1:1.7
for cols in [4, 5, 6, 7, 8]:
    for rows in [2, 3, 4]:
        cw = 1200 / cols
        ch = 1006 / rows
        ratio = ch / cw
        print(f"Cols: {cols}, Rows: {rows} -> Card width: {cw:.1f}, height: {ch:.1f}, Aspect Ratio: {ratio:.2f}")
