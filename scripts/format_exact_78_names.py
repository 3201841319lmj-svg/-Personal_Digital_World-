import urllib.request
import os
import json
import base64
from io import BytesIO
from PIL import Image

SRC_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../src/assets/tarot")
PUBLIC_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../public/assets/tarot")
os.makedirs(SRC_OUTPUT_DIR, exist_ok=True)
os.makedirs(PUBLIC_OUTPUT_DIR, exist_ok=True)

WOPC_SHEET_URLS = [
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-major-arcana-01.jpg",
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-major-arcana-02.jpg",
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-major-arcana-03.jpg",
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-wands-01.jpg",
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-wands-02.jpg",
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-cups-01.jpg",
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-cups-02.jpg",
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-swords-01.jpg",
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-swords-02.jpg",
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-coins-01.jpg",
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-coins-02.jpg",
]

# STRICT 100% "两位数编号_卡牌名字" FORMAT FOR ALL 78 CARDS
CARD_NAMES_STRICT = [
    # Major Arcana (00-21)
    "00_愚者", "01_魔术师", "02_女祭司", "03_女皇", "04_皇帝",
    "05_教皇", "06_恋人", "07_战车", "08_力量", "09_隐士",
    "10_命运之轮", "11_正义", "12_倒吊人", "13_死神", "14_节制",
    "15_恶魔", "16_高塔", "17_星星", "18_月亮", "19_太阳",
    "20_审判", "21_世界",
    # Wands (22-35)
    "22_权杖 Ace", "23_权杖 2", "24_权杖 3", "25_权杖 4", "26_权杖 5", "27_权杖 6", "28_权杖 7",
    "29_权杖 8", "30_权杖 9", "31_权杖 10", "32_权杖侍从", "33_权杖骑士", "34_权杖王后", "35_权杖国王",
    # Cups (36-49)
    "36_圣杯 Ace", "37_圣杯 2", "38_圣杯 3", "39_圣杯 4", "40_圣杯 5", "41_圣杯 6", "42_圣杯 7",
    "43_圣杯 8", "44_圣杯 9", "45_圣杯 10", "46_圣杯侍从", "47_圣杯骑士", "48_圣杯王后", "49_圣杯国王",
    # Swords (50-63)
    "50_宝剑 Ace", "51_宝剑 2", "52_宝剑 3", "53_宝剑 4", "54_宝剑 5", "55_宝剑 6", "56_宝剑 7",
    "57_宝剑 8", "58_宝剑 9", "59_宝剑 10", "60_宝剑侍从", "61_宝剑骑士", "62_宝剑王后", "63_宝剑国王",
    # Pentacles / Coins (64-77)
    "64_钱币 Ace", "65_钱币 2", "66_钱币 3", "67_钱币 4", "68_钱币 5", "69_钱币 6", "70_钱币 7",
    "71_钱币 8", "72_钱币 9", "73_钱币 10", "74_钱币侍从", "75_钱币骑士", "76_钱币王后", "77_钱币国王"
]

def fetch_image(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    content = urllib.request.urlopen(req).read()
    return Image.open(BytesIO(content))

def format_all_78():
    print("开始生成全套 78 张【两位数字+卡牌名字】规格清单...")
    all_cropped = []
    
    for url in WOPC_SHEET_URLS:
        try:
            sheet_img = fetch_image(url)
            w, h = sheet_img.size
            cols = 4
            rows = 2
            card_w = w / cols
            card_h = h / rows
            
            for r in range(rows):
                for c in range(cols):
                    box = (c * card_w, r * card_h, (c + 1) * card_w, (r + 1) * card_h)
                    card_crop = sheet_img.crop(box)
                    all_cropped.append(card_crop)
        except Exception as e:
            print(f"Error fetching sheet {url}: {e}")

    exact_78_cards = all_cropped[:78]

    manifest = []
    for idx in range(78):
        name = CARD_NAMES_STRICT[idx]
        file_name = f"tarot_{idx:02d}.png"
        card_img = exact_78_cards[idx].resize((140, 210), Image.Resampling.LANCZOS)
        
        src_path = os.path.join(SRC_OUTPUT_DIR, file_name)
        pub_path = os.path.join(PUBLIC_OUTPUT_DIR, file_name)
        
        card_img.save(src_path, "PNG")
        card_img.save(pub_path, "PNG")
        
        buffered = BytesIO()
        card_img.save(buffered, format="PNG")
        b64_str = "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        manifest.append({
            "id": idx,
            "name": name,
            "file_name": file_name,
            "image_path": f"/assets/tarot/{file_name}",
            "data_url": b64_str
        })
        
    manifest_json_str = json.dumps(manifest, ensure_ascii=False, indent=2)
    with open(os.path.join(SRC_OUTPUT_DIR, "tarot_manifest.json"), "w", encoding="utf-8") as f:
        f.write(manifest_json_str)
        
    with open(os.path.join(PUBLIC_OUTPUT_DIR, "tarot_manifest.json"), "w", encoding="utf-8") as f:
        f.write(manifest_json_str)

    print("78 张卡牌 100% 格式为【两位数_卡牌名字】写入成功！")

if __name__ == "__main__":
    format_all_78()
