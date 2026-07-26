import os
import json
from PIL import Image, ImageDraw

# Target output directories
SRC_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../src/assets/tarot")
PUBLIC_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../public/assets/tarot")
os.makedirs(SRC_OUTPUT_DIR, exist_ok=True)
os.makedirs(PUBLIC_OUTPUT_DIR, exist_ok=True)

# 78 Standard Waite Tarot Card Names
CARD_NAMES = [
    # Major Arcana (0-21)
    "00_愚者", "01_魔术师", "02_女祭司", "03_女皇", "04_皇帝",
    "05_教皇", "06_恋人", "07_战车", "08_力量", "09_隐士",
    "10_命运之轮", "11_正义", "12_倒吊人", "13_死神", "14_节制",
    "15_恶魔", "16_高塔", "17_星星", "18_月亮", "19_太阳",
    "20_审判", "21_世界",
    # Wands (22-35)
    "权杖 Ace", "权杖 2", "权杖 3", "权杖 4", "权杖 5", "权杖 6", "权杖 7",
    "权杖 8", "权杖 9", "权杖 10", "权杖侍从", "权杖骑士", "权杖王后", "权杖国王",
    # Cups (36-49)
    "圣杯 Ace", "圣杯 2", "圣杯 3", "圣杯 4", "圣杯 5", "圣杯 6", "圣杯 7",
    "圣杯 8", "圣杯 9", "圣杯 10", "圣杯侍从", "圣杯骑士", "圣杯王后", "圣杯国王",
    # Swords (50-63)
    "宝剑 Ace", "宝剑 2", "宝剑 3", "宝剑 4", "宝剑 5", "宝剑 6", "宝剑 7",
    "宝剑 8", "宝剑 9", "宝剑 10", "宝剑侍从", "宝剑骑士", "宝剑王后", "宝剑国王",
    # Pentacles (64-77)
    "钱币 Ace", "钱币 2", "钱币 3", "钱币 4", "钱币 5", "钱币 6", "钱币 7",
    "钱币 8", "钱币 9", "钱币 10", "钱币侍从", "钱币骑士", "钱币王后", "钱币国王"
]

ROMAN_NUMS = [
    "0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
    "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"
]

SUIT_SHORT_LABELS = ["ACE", "2", "3", "4", "5", "6", "7", "8", "9", "10", "PAGE", "KNIGHT", "QUEEN", "KING"]

THEME_COLORS = {
    "major": {"bg": "#2B1A40", "border": "#D8A65B", "accent": "#E3CEFF", "symbol": "🔮", "tag": "MAJOR"},
    "wands": {"bg": "#3D1E10", "border": "#C86D51", "accent": "#F9DB8C", "symbol": "🪄", "tag": "WANDS"},
    "cups": {"bg": "#122838", "border": "#589BB5", "accent": "#B6EEFF", "symbol": "🏆", "tag": "CUPS"},
    "swords": {"bg": "#18261D", "border": "#7C8455", "accent": "#C9DAB6", "symbol": "⚔️", "tag": "SWORDS"},
    "pentacles": {"bg": "#302610", "border": "#D8A65B", "accent": "#FFE5A3", "symbol": "🪙", "tag": "PENTS"}
}

def get_card_meta(idx):
    if idx <= 21:
        return THEME_COLORS["major"], ROMAN_NUMS[idx], THEME_COLORS["major"]["tag"]
    elif idx <= 35:
        sub_idx = idx - 22
        return THEME_COLORS["wands"], SUIT_SHORT_LABELS[sub_idx], "WANDS"
    elif idx <= 49:
        sub_idx = idx - 36
        return THEME_COLORS["cups"], SUIT_SHORT_LABELS[sub_idx], "CUPS"
    elif idx <= 63:
        sub_idx = idx - 50
        return THEME_COLORS["swords"], SUIT_SHORT_LABELS[sub_idx], "SWORDS"
    else:
        sub_idx = idx - 64
        return THEME_COLORS["pentacles"], SUIT_SHORT_LABELS[sub_idx], "PENTS"

def create_pixel_tarot_card(idx):
    width, height = 120, 180
    theme, num_str, suit_tag = get_card_meta(idx)
    
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Outer Border (Wood/Gold Frame)
    draw.rectangle([0, 0, width - 1, height - 1], fill=theme["bg"], outline=theme["border"], width=4)
    
    # Inner Parchment Line Frame
    draw.rectangle([6, 6, width - 7, height - 7], outline=theme["accent"], width=2)
    
    # Inner Background Box
    draw.rectangle([10, 10, width - 11, height - 11], fill="#140D1C")
    
    # Top Card Number
    draw.text((width // 2, 24), num_str, fill=theme["accent"], anchor="ms")
    
    # Center Symbol & Circle Frame
    draw.ellipse([width // 2 - 24, height // 2 - 24, width // 2 + 24, height // 2 + 24], outline=theme["border"], width=2)
    draw.text((width // 2, height // 2 + 2), theme["symbol"], fill="#FFFFFF", anchor="mm")
    
    # Bottom Suit Tag Label Box
    draw.rectangle([14, height - 34, width - 15, height - 16], fill=theme["bg"], outline=theme["border"])
    draw.text((width // 2, height - 25), suit_tag, fill=theme["accent"], anchor="mm")

    return img

def main():
    manifest = []
    print("重新使用英文字符生成 78 张高清像素塔罗牌（解决乱码 `` 问题）...")
    
    for idx, name in enumerate(CARD_NAMES):
        file_name = f"tarot_{idx:02d}.png"
        card_img = create_pixel_tarot_card(idx)
        
        card_img.save(os.path.join(SRC_OUTPUT_DIR, file_name), "PNG")
        card_img.save(os.path.join(PUBLIC_OUTPUT_DIR, file_name), "PNG")
        
        manifest.append({
            "id": idx,
            "name": name,
            "file_name": file_name,
            "image_path": f"/assets/tarot/{file_name}"
        })
    
    with open(os.path.join(SRC_OUTPUT_DIR, "tarot_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        
    with open(os.path.join(PUBLIC_OUTPUT_DIR, "tarot_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        
    print("78 张像素塔罗牌全量重新生成完毕！乱码问题已完全解决。")

if __name__ == "__main__":
    main()
