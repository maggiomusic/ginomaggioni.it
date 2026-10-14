"""Genera media-web/ a partire dagli originali in media/.

Crea le versioni web solo per le immagini usate dal sito (elencate in
js/main.js e referenziate in index.html) e cancella quelle che non servono più.

  media-web/t/<percorso>  miniature delle gallerie (lato lungo 640 px)
  media-web/l/<percorso>  ingrandimenti e immagini della pagina (lato lungo 1800 px)

Uso: python3 tools/build_images.py
"""
import json
import os
import re
import sys
from urllib.parse import unquote

from PIL import Image, ImageOps

SRC = "media"
OUT = "media-web"
SIZES = {"t": (640, 74), "l": (1800, 80)}


def wanted():
    """Ritorna l'insieme di 't/<rel>' e 'l/<rel>' richiesti dal sito."""
    need = set()
    js = open("js/main.js", encoding="utf-8").read()
    for m in re.finditer(r'folder:\s*"([^"]+)".*?files:\s*\[(.*?)\]', js, re.S):
        folder, body = m.groups()
        for f in json.loads("[" + body + "]"):
            rel = f if "/" in f else f"{folder}/{f}"
            rel = re.sub(r"^media/", "", rel)
            need.add("t/" + rel)
            need.add("l/" + rel)
    html = open("index.html", encoding="utf-8").read()
    for ref in re.findall(r'media-web/([^"\s]+)"', html):
        need.add(unquote(ref))
    return need


def main():
    need = wanted()
    made = missing = 0
    for key_rel in sorted(need):
        key, rel = key_rel.split("/", 1)
        src = os.path.join(SRC, rel)
        dst = os.path.join(OUT, key_rel)
        if not os.path.exists(src):
            print("MANCA l'originale:", src)
            missing += 1
            continue
        if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
            continue
        edge, quality = SIZES[key]
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        im.thumbnail((edge, edge), Image.LANCZOS)
        im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)
        made += 1

    removed = 0
    for root, dirs, files in os.walk(OUT, topdown=False):
        for name in files:
            p = os.path.join(root, name)
            if os.path.relpath(p, OUT) not in need:
                os.remove(p)
                removed += 1
        if root != OUT and not os.listdir(root):
            os.rmdir(root)

    print(f"generati {made}, rimossi {removed}, totale {len(need)}")
    if missing:
        sys.exit(f"{missing} originali mancanti")


if __name__ == "__main__":
    main()
