#!/usr/bin/env python3
"""
Build the trimmed display font used for headings.

Archivo (SIL OFL 1.1, no Reserved Font Name) ships as a variable font with a
62-125% width axis and a 100-900 weight axis. The site only sets headings in
condensed widths (62-80%) and heavy weights (700-900), so this limits both axes
to those ranges and keeps the Latin subset Fontsource already provides. The
result is a much smaller file that renders identically for the values in use.

Run after `npm ci` (needs: pip install fonttools brotli):

    python scripts/make-display-font.py

Writes src/fonts/archivo-display-latin.woff2 and copies the OFL licence next to
it. The output is committed; CI does not need Python font tools.
"""
from pathlib import Path
import shutil

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SITE = Path(__file__).resolve().parent.parent
SRC = SITE / "node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2"
OUT_DIR = SITE / "src/fonts"
OUT = OUT_DIR / "archivo-display-latin.woff2"

font = TTFont(SRC)
trimmed = instancer.instantiateVariableFont(font, {"wdth": (62, 80), "wght": (700, 900)})
trimmed.flavor = "woff2"
OUT_DIR.mkdir(parents=True, exist_ok=True)
trimmed.save(OUT)
shutil.copyfile(SITE / "node_modules/@fontsource-variable/archivo/LICENSE", OUT_DIR / "OFL-Archivo.txt")
print(f"{SRC.name}: {SRC.stat().st_size // 1024} KB -> {OUT.name}: {OUT.stat().st_size // 1024} KB")
