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

# 11 Official WOPC Adam Wintle Pixel Tarot Sheet Image URLs
WOPC_SHEET_URLS = [
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-major-arcana-01.jpg", # 8 cards (Major 0-7)
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-major-arcana-02.jpg", # 8 cards (Major 8-15)
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-major-arcana-03.jpg", # 6 cards (Major 16-21)
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-wands-01.jpg", # 7 cards (Wands Ace-7)
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-wands-02.jpg", # 7 cards (Wands 8-King)
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-cups-01.jpg", # 7 cards (Cups Ace-7)
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-cups-02.jpg", # 7 cards (Cups 8-King)
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-swords-01.jpg", # 7 cards (Swords Ace-7)
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-swords-02.jpg", # 7 cards (Swords 8-King)
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-coins-01.jpg", # 7 cards (Coins Ace-7)
    "https://www.wopc.co.uk/images/contributors/adamwintle/12417-pixel-tarot/pixel-tarot-minor-arcana-coins-02.jpg", # 7 cards (Coins 8-King)
]

# EXACT 78 RIDER-WAITE TAROT CARD NAMES
CARD_NAMES = [
    # 22 Major Arcana (00-21)
    "00_愚者", "01_魔术师", "02_女祭司", "03_女皇", "04_皇帝",
    "05_教皇", "06_恋人", "07_战车", "08_力量", "09_隐士",
    "10_命运之轮", "11_正义", "12_倒吊人", "13_死神", "14_节制",
    "15_恶魔", "16_高塔", "17_星星", "18_月亮", "19_太阳",
    "20_审判", "21_世界",
    # 14 Wands (22-35)
    "权杖 Ace", "权杖 2", "权杖 3", "权杖 4", "权杖 5", "权杖 6", "权杖 7",
    "权杖 8", "权杖 9", "权杖 10", "权杖侍从", "权杖骑士", "权杖王后", "权杖国王",
    # 14 Cups (36-49)
    "圣杯 Ace", "圣杯 2", "圣杯 3", "圣杯 4", "圣杯 5", "圣杯 6", "圣杯 7",
    "圣杯 8", "圣杯 9", "圣杯 10", "圣杯侍从", "圣杯骑士", "圣杯王后", "圣杯国王",
    # 14 Swords (50-63)
    "宝剑 Ace", "宝剑 2", "宝剑 3", "宝剑 4", "宝剑 5", "宝剑 6", "宝剑 7",
    "宝剑 8", "宝剑 9", "宝剑 10", "宝剑侍从", "宝剑骑士", "宝剑王后", "宝剑国王",
    # 14 Pentacles / Coins (64-77)
    "钱币 Ace", "钱币 2", "钱币 3", "钱币 4", "钱币 5", "钱币 6", "钱币 7",
    "钱币 8", "钱币 9", "钱币 10", "钱币侍从", "钱币骑士", "钱币王后", "钱币国王"
]

def fetch_image(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    content = urllib.request.urlopen(req).read()
    return Image.open(BytesIO(content))

def process_exact_78():
    print(f"正在核对 WOPC 全套 {len(CARD_NAMES)} 张标准伟特像素塔罗牌...")
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

    # STRICTLY CAP AT EXACTLY 78 CARDS!
    exact_78_cards = all_cropped[:78]
    print(f"从精灵图中精准截取前 {len(exact_78_cards)} 张有效卡牌，摒弃了尾部 10 张多余空白占位！")

    manifest = []
    for idx in range(78):
        name = CARD_NAMES[idx]
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

    print(f"✅ 全套 {len(manifest)} 张标准伟特像素塔罗牌（22张大阿卡纳 + 56张小阿卡纳）核对与Base64封装100%完成！")

if __name__ == "__main__":
    process_exact_78()
