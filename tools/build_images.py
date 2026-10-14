"""Genera versioni web leggere delle immagini in media/.

media-web/t/<percorso>  miniature per le gallerie (lato lungo 640 px)
media-web/l/<percorso>  versioni per l'ingrandimento (lato lungo 1800 px)

Uso: python3 tools/build_images.py   (rigenera solo i file mancanti o modificati)
"""
import os
from PIL import Image, ImageOps

SRC = "media"
OUT = "media-web"
SKIP_DIRS = {"Borsani_Maggioni"}
SIZES = {"t": (640, 74), "l": (1800, 80)}
EXTS = {".jpg", ".jpeg", ".png"}

def main():
    made = 0
    for root, dirs, files in os.walk(SRC):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in files:
            if os.path.splitext(name)[1].lower() not in EXTS:
                continue
            src = os.path.join(root, name)
            rel = os.path.relpath(src, SRC)
            for key, (edge, quality) in SIZES.items():
                dst = os.path.join(OUT, key, rel)
                if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
                    continue
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
                im.thumbnail((edge, edge), Image.LANCZOS)
                im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)
                made += 1
    print(f"{made} file generati")

if __name__ == "__main__":
    main()
