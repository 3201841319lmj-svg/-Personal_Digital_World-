import urllib.request
import re
import os

url = 'https://www.wopc.co.uk/tarot/pixel-tarot'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    imgs = re.findall(r'src=["\']([^"\']+\.(?:png|jpg|jpeg|gif))["\']', html, re.IGNORECASE)
    print('Found image URLs on WOPC page:')
    for img_url in imgs:
        if not img_url.startswith('http'):
            img_url = 'https://www.wopc.co.uk' + (img_url if img_url.startswith('/') else '/' + img_url)
        print(' -', img_url)
except Exception as e:
    print('Error fetching WOPC page:', e)
