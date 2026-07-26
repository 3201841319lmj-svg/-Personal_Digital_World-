import os
import json
import zipfile

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAROT_IMG_DIR = os.path.join(PROJECT_DIR, "public", "assets", "tarot")
MANIFEST_PATH = os.path.join(PROJECT_DIR, "src", "assets", "tarot", "tarot_manifest.json")

ARTIFACT_DIR = r"C:\Users\黎敏君\.gemini\antigravity\brain\b5d0f05d-8689-42c7-924f-90b500881ad6"
ZIP_OUT_PATH = os.path.join(ARTIFACT_DIR, "tarot_78_cards_pack.zip")
PUBLIC_ZIP_PATH = os.path.join(PROJECT_DIR, "public", "tarot_78_cards_pack.zip")

def package_tarot():
    print("Packing 78 tarot card images and manifest...")
    
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest_data = json.load(f)

    # Prepare a human-readable txt summary file
    txt_lines = ["========== 78张标准伟特像素塔罗牌 序号与名称对照清单 ==========\n"]
    for item in manifest_data:
        txt_lines.append(f"ID: {item['id']:02d} | 编号与名称: {item['name']:<14} | 文件名: {item['file_name']}")

    txt_content = "\n".join(txt_lines)

    # Create zip file in artifact directory
    for zip_path in [ZIP_OUT_PATH, PUBLIC_ZIP_PATH]:
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            # 1. Add manifest JSON (without huge base64 data_url for clean review)
            clean_manifest = [
                {
                    "id": item["id"],
                    "name": item["name"],
                    "file_name": item["file_name"],
                    "image_path": item["image_path"]
                }
                for item in manifest_data
            ]
            zipf.writestr("tarot_manifest.json", json.dumps(clean_manifest, ensure_ascii=False, indent=2))
            
            # 2. Add human-readable TXT list
            zipf.writestr("78张塔罗牌对照清单.txt", txt_content)
            
            # 3. Add all 78 card PNG images
            for item in manifest_data:
                fname = item["file_name"]
                fpath = os.path.join(TAROT_IMG_DIR, fname)
                if os.path.exists(fpath):
                    zipf.write(fpath, arcname=f"images/{fname}")
                else:
                    print(f"Warning: file {fname} not found!")

    print(f"Zip created successfully at: {ZIP_OUT_PATH}")

if __name__ == "__main__":
    package_tarot()
