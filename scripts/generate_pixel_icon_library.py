import os
from PIL import Image, ImageDraw

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS_BASE_DIR = os.path.join(PROJECT_DIR, "src", "assets", "icons")
PUBLIC_ICONS_DIR = os.path.join(PROJECT_DIR, "public", "assets", "icons")

# Cozy Warm Color Palette
C_CREAM = (247, 232, 200, 255)      # #F7E8C8
C_MALT_GOLD = (217, 164, 65, 255)   # #D9A441
C_FOREST_GREEN = (89, 115, 74, 255) # #59734A
C_LEAF_GREEN = (122, 163, 85, 255)  # #7AA355
C_BRIGHT_LEAF = (150, 200, 95, 255) # #96C85F
C_TERRACOTTA = (200, 109, 81, 255)  # #C86D51
C_POT_DARK = (130, 60, 40, 255)     # #823C28
C_WOOD_BROWN = (139, 90, 54, 255)   # #8B5A36
C_WOOD_DEEP = (62, 39, 20, 255)     # #3E2714
C_WARM_GREY = (184, 165, 138, 255)  # #B8A58A
C_LAVENDER = (125, 82, 149, 255)    # #7D5295
C_STAR_BLUE = (91, 140, 168, 255)   # #5B8CA8
C_WHITE = (255, 252, 245, 255)
C_RED = (195, 68, 68, 255)
C_ROOF_RED = (175, 55, 55, 255)
C_TRANSPARENT = (0, 0, 0, 0)

def create_pixel_canvas():
    return Image.new("RGBA", (32, 32), C_TRANSPARENT)

def draw_pixels(img, pixel_list):
    pixels = img.load()
    for x, y, col in pixel_list:
        if 0 <= x < 32 and 0 <= y < 32:
            pixels[x, y] = col

def draw_rect(pixels_acc, x1, y1, x2, y2, color):
    for x in range(x1, x2 + 1):
        for y in range(y1, y2 + 1):
            pixels_acc.append((x, y, color))

def draw_border_rect(pixels_acc, x1, y1, x2, y2, fill_col, border_col):
    for x in range(x1, x2 + 1):
        for y in range(y1, y2 + 1):
            if x == x1 or x == x2 or y == y1 or y == y2:
                pixels_acc.append((x, y, border_col))
            else:
                pixels_acc.append((x, y, fill_col))

# --- DISTINCT STUDY SUB-TAB ICONS ---

# 1. Gazette Newspaper Clip (📰 剪报)
def draw_gazette_clip_icon():
    img = create_pixel_canvas()
    p = []
    draw_border_rect(p, 6, 6, 25, 26, C_CREAM, C_WOOD_DEEP)
    draw_rect(p, 8, 8, 23, 11, C_WOOD_BROWN) # Headline banner
    # Article text lines & photo thumbnail
    draw_border_rect(p, 8, 14, 14, 20, C_STAR_BLUE, C_WOOD_DEEP) # Photo box
    draw_rect(p, 16, 14, 23, 15, C_WOOD_DEEP) # Text line 1
    draw_rect(p, 16, 17, 23, 18, C_WOOD_DEEP) # Text line 2
    draw_rect(p, 16, 20, 22, 21, C_WOOD_DEEP) # Text line 3
    draw_rect(p, 8, 23, 23, 24, C_WOOD_DEEP)  # Bottom text line
    draw_pixels(img, p)
    return img

# 2. Tarot Crystal Ball / Cards (🔮 传讯)
def draw_tarot_crystal_icon():
    img = create_pixel_canvas()
    p = []
    # Crystal Ball Stand
    draw_border_rect(p, 9, 23, 22, 27, C_MALT_GOLD, C_WOOD_DEEP)
    draw_rect(p, 11, 21, 20, 23, C_WOOD_BROWN)
    # Glowing Lavender Crystal Sphere
    draw_border_rect(p, 8, 6, 23, 21, C_LAVENDER, C_WOOD_DEEP)
    draw_rect(p, 10, 8, 21, 19, (175, 130, 205, 255))
    p.append((11, 9, C_WHITE)) # Highlight
    p.append((12, 10, C_WHITE))
    p.append((15, 14, C_MALT_GOLD)) # Center Star
    draw_pixels(img, p)
    return img

# 3. Mail Envelope with Red Wax Seal (✉️ 信件)
def draw_wax_envelope_icon():
    img = create_pixel_canvas()
    p = []
    draw_border_rect(p, 5, 8, 26, 24, C_CREAM, C_WOOD_DEEP) # Cream Envelope
    for i in range(10):
        p.append((6 + i, 9 + i, C_WOOD_BROWN))
        p.append((25 - i, 9 + i, C_WOOD_BROWN))
    # Red Wax Seal Stamp
    draw_border_rect(p, 12, 13, 19, 20, C_RED, C_WOOD_DEEP)
    draw_rect(p, 14, 15, 17, 18, (230, 90, 90, 255))
    draw_pixels(img, p)
    return img

# 4. Locked Leather Diary (📕 日记)
def draw_locked_diary_icon():
    img = create_pixel_canvas()
    p = []
    draw_border_rect(p, 6, 5, 25, 27, (175, 55, 55, 255), C_WOOD_DEEP) # Red Leather Cover
    draw_rect(p, 23, 6, 24, 26, C_CREAM) # Page Edges
    # Gold Lock Strap
    draw_border_rect(p, 12, 13, 19, 19, C_MALT_GOLD, C_WOOD_DEEP)
    p.append((15, 16, C_WOOD_DEEP)) # Keyhole
    draw_pixels(img, p)
    return img

# 5. Farmhouse & Other Icons
def draw_farm_house_icon():
    img = create_pixel_canvas()
    p = []
    draw_rect(p, 4, 25, 27, 28, C_LEAF_GREEN)
    draw_border_rect(p, 8, 14, 23, 25, C_CREAM, C_WOOD_DEEP)
    for i in range(7):
        draw_rect(p, 7 + i, 14 - i, 24 - i, 14 - i, C_ROOF_RED)
    draw_rect(p, 6, 14, 25, 14, C_WOOD_DEEP)
    draw_border_rect(p, 13, 18, 18, 25, C_WOOD_BROWN, C_WOOD_DEEP)
    p.append((17, 21, C_MALT_GOLD))
    draw_border_rect(p, 9, 16, 11, 19, C_STAR_BLUE, C_WOOD_DEEP)
    draw_pixels(img, p)
    return img

def draw_sprout_field_icon():
    img = create_pixel_canvas()
    p = []
    draw_border_rect(p, 6, 20, 25, 27, C_WOOD_BROWN, C_WOOD_DEEP)
    draw_rect(p, 8, 22, 23, 25, (105, 65, 35, 255))
    draw_rect(p, 15, 12, 16, 20, C_FOREST_GREEN)
    draw_border_rect(p, 9, 8, 15, 14, C_BRIGHT_LEAF, C_FOREST_GREEN)
    draw_border_rect(p, 16, 7, 22, 13, C_BRIGHT_LEAF, C_FOREST_GREEN)
    p.append((11, 10, C_WHITE))
    p.append((18, 9, C_WHITE))
    draw_pixels(img, p)
    return img

def draw_potted_plant_icon():
    img = create_pixel_canvas()
    p = []
    draw_border_rect(p, 9, 18, 22, 27, C_TERRACOTTA, C_POT_DARK)
    draw_border_rect(p, 7, 16, 24, 19, C_TERRACOTTA, C_POT_DARK)
    draw_rect(p, 9, 17, 22, 17, (225, 130, 100, 255))
    draw_rect(p, 10, 16, 21, 16, C_WOOD_DEEP)
    draw_rect(p, 15, 10, 16, 16, C_FOREST_GREEN)
    draw_border_rect(p, 13, 4, 18, 10, C_BRIGHT_LEAF, C_FOREST_GREEN)
    draw_border_rect(p, 7, 10, 13, 14, C_LEAF_GREEN, C_FOREST_GREEN)
    draw_border_rect(p, 18, 9, 24, 13, C_LEAF_GREEN, C_FOREST_GREEN)
    p.append((25, 6, C_MALT_GOLD))
    draw_pixels(img, p)
    return img

def draw_feather_ink_icon():
    img = create_pixel_canvas()
    p = []
    draw_border_rect(p, 18, 18, 27, 27, C_WOOD_DEEP, (30, 30, 30, 255))
    draw_rect(p, 20, 15, 25, 17, C_STAR_BLUE)
    draw_rect(p, 20, 20, 25, 25, C_LAVENDER)
    for i in range(16):
        p.append((22 - i, 5 + i, C_CREAM))
        p.append((23 - i, 5 + i, C_MALT_GOLD))
        p.append((21 - i, 6 + i, C_WOOD_BROWN))
    draw_rect(p, 7, 20, 18, 20, C_WOOD_DEEP)
    draw_pixels(img, p)
    return img

def draw_ancient_tome_icon():
    img = create_pixel_canvas()
    p = []
    draw_border_rect(p, 6, 6, 25, 26, (140, 50, 40, 255), C_WOOD_DEEP)
    draw_rect(p, 23, 7, 24, 25, C_CREAM)
    draw_border_rect(p, 12, 12, 18, 20, C_MALT_GOLD, C_WOOD_DEEP)
    p.append((15, 16, C_RED))
    draw_pixels(img, p)
    return img

def draw_livingroom_sofa_icon():
    img = create_pixel_canvas()
    p = []
    draw_border_rect(p, 6, 12, 25, 26, (175, 95, 60, 255), C_WOOD_DEEP)
    draw_border_rect(p, 4, 14, 8, 24, (150, 75, 45, 255), C_WOOD_DEEP)
    draw_border_rect(p, 23, 14, 27, 24, (150, 75, 45, 255), C_WOOD_DEEP)
    draw_rect(p, 8, 17, 23, 23, C_CREAM)
    draw_pixels(img, p)
    return img

def draw_restaurant_tea_icon():
    img = create_pixel_canvas()
    p = []
    draw_border_rect(p, 6, 16, 19, 25, C_CREAM, C_WOOD_DEEP)
    draw_rect(p, 19, 18, 21, 22, C_CREAM)
    p.append((21, 20, C_WOOD_DEEP))
    p.append((9, 11, C_WARM_GREY))
    p.append((10, 10, C_WARM_GREY))
    p.append((14, 11, C_WARM_GREY))
    p.append((15, 10, C_WARM_GREY))
    draw_border_rect(p, 21, 21, 28, 26, C_MALT_GOLD, C_WOOD_DEEP)
    draw_pixels(img, p)
    return img

def draw_clear_paperclip_icon():
    img = create_pixel_canvas()
    p = []
    clip_path = [
        (12, 8), (13, 7), (14, 7), (15, 7), (16, 7), (17, 7), (18, 8),
        (19, 9), (19, 10), (19, 11), (19, 12), (19, 13), (19, 14), (19, 15), (19, 16), (19, 17), (19, 18), (19, 19), (19, 20), (19, 21), (19, 22), (18, 23),
        (17, 24), (16, 24), (15, 24), (14, 24), (13, 24), (12, 23),
        (11, 22), (11, 21), (11, 20), (11, 19), (11, 18), (11, 17), (11, 16), (11, 15), (11, 14), (11, 13), (11, 12), (12, 11),
        (13, 10), (14, 10), (15, 10), (16, 11),
        (16, 12), (16, 13), (16, 14), (16, 15), (16, 16), (16, 17), (16, 18), (15, 19), (14, 19), (13, 18)
    ]
    for x, y in clip_path:
        p.append((x, y, C_MALT_GOLD))
        p.append((x+1, y, C_WOOD_DEEP))
    draw_pixels(img, p)
    return img

def draw_static_thinking_gem_icon():
    img = create_pixel_canvas()
    p = []
    draw_border_rect(p, 11, 8, 20, 23, C_MALT_GOLD, C_WOOD_DEEP)
    draw_rect(p, 13, 10, 18, 21, (255, 215, 110, 255))
    draw_rect(p, 14, 11, 17, 13, C_WHITE)
    draw_rect(p, 15, 14, 16, 18, C_MALT_GOLD)
    p.append((12, 9, C_WHITE))
    p.append((19, 22, C_WOOD_BROWN))
    draw_pixels(img, p)
    return img

# --- ALL PNG ASSETS ROUTINE ---

ALL_ICONS = {
    # Study Sub-tabs (100% Unique)
    "library/gazette_clip.png": draw_gazette_clip_icon,
    "library/tarot_crystal.png": draw_tarot_crystal_icon,
    "library/wax_envelope.png": draw_wax_envelope_icon,
    "library/locked_diary.png": draw_locked_diary_icon,

    # Entry & Category Icons
    "farm/farm_house.png": draw_farm_house_icon,
    "farm/sprout_field.png": draw_sprout_field_icon,
    "library/feather_ink.png": draw_feather_ink_icon,
    "library/ancient_tome.png": draw_ancient_tome_icon,
    "livingroom/sofa.png": draw_livingroom_sofa_icon,
    "restaurant/tea_bread.png": draw_restaurant_tea_icon,

    # UI Glyphs
    "ui/attachment.png": draw_clear_paperclip_icon,
    "ui/thinking.png": draw_static_thinking_gem_icon,
    "decoration/potted_plant.png": draw_potted_plant_icon,
}

def generate_all():
    print("Generating 100% Unique Study & Cozy Icon Library PNGs...")
    count = 0
    for rel_path, draw_fn in ALL_ICONS.items():
        src_path = os.path.join(ICONS_BASE_DIR, rel_path)
        pub_path = os.path.join(PUBLIC_ICONS_DIR, rel_path)
        
        os.makedirs(os.path.dirname(src_path), exist_ok=True)
        os.makedirs(os.path.dirname(pub_path), exist_ok=True)
        
        img = draw_fn()
        img.save(src_path, "PNG")
        img.save(pub_path, "PNG")
        count += 1

    print(f"SUCCESS: Total {count} unique pixel icons generated!")

if __name__ == "__main__":
    generate_all()
