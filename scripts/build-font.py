#!/usr/bin/env python3
"""Build the self-hosted reading serif shipped with the theme.

The blog reads in a Chinese serif. Naming system fonts only is fragile: Windows
often has no good song-ti, phones vary, and the fallback switches the whole
article to a sans-serif. So the theme carries its own subset of Noto Serif CJK
SC (SIL OFL 1.1, the licence sits next to the file).

What goes in:

  * the complete GB/T 2312 set (6763 hanzi, both levels) plus punctuation, so
    ordinary Chinese prose renders entirely in the serif — no half-serif
    paragraphs;
  * every character the theme prints itself — four languages of i18n strings,
    the labels ruri.js injects, the archive and collection UI;
  * Latin letters, digits and punctuation for mixed text.

Anything outside that (rare names, variant characters) falls back to the
reader's system font: a single missing glyph, never a broken page. The file is
about 1.8 MB, so it is only loaded on pages that contain CJK text (baseof.html
adds data-font for CN/TW/JP, and the @font-face carries a unicode-range) —
an English-only site never fetches it.

CJK OpenType layout tables (GSUB/GPOS) are dropped on purpose: at body sizes
the win is invisible, and keeping them roughly doubles the file. Latin kerning
therefore comes from the system fallback list when a paragraph is all Latin.

Rebuild after changing the theme's own wording:

    pip install fonttools brotli
    python3 scripts/build-font.py
"""

from __future__ import annotations

import io
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTCollection

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "static" / "fonts" / "ruri-serif-sc.woff2"

# Noto Serif CJK ships as a collection; index 2 is the Simplified Chinese face.
COLLECTION_CANDIDATES = [
    "/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc",
    "/usr/share/fonts/noto-cjk/NotoSerifCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSerifCJK-Regular.ttc",
    "C:/Windows/Fonts/NotoSerifCJK-Regular.ttc",
]
SC_FACE_INDEX = 2

# Symbols the theme's scripts emit, plus the punctuation a Chinese page uses.
EXTRA_CHARS = (
    " ·—–…“”‘’「」『』（）《》〈〉【】〔〕、。，：；！？〓"
    "％‰°′″№±×÷≈≠≤≥∞→←↑↓↻★☆♥♪♫①②③④⑤"
    "0123456789"
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    "#$%&*+-/=@_~^|<>"
)


def gb2312_hanzi() -> str:
    """Every hanzi of GB/T 2312 (levels 1 and 2), decoded from its byte ranges."""
    chars = []
    for high in range(0xB0, 0xF8):
        for low in range(0xA1, 0xFF):
            try:
                chars.append(bytes((high, low)).decode("gb2312"))
            except UnicodeDecodeError:
                continue
    return "".join(chars)


def template_characters() -> set[str]:
    """Every character written in the theme's templates, strings and content."""
    collected: set[str] = set()
    for pattern in ("i18n/*.yml", "layouts/**/*.html", "exampleSite/content/**/*.md"):
        for path in ROOT.glob(pattern):
            collected.update(path.read_text(encoding="utf-8"))
    return {c for c in collected if ord(c) > 0x20}


def find_font() -> str:
    for candidate in COLLECTION_CANDIDATES:
        if Path(candidate).exists():
            return candidate
    raise SystemExit(
        "Noto Serif CJK not found; install it (Debian: fonts-noto-cjk) or add its path "
        "to COLLECTION_CANDIDATES."
    )


def main() -> None:
    source = find_font()
    face = TTCollection(source).fonts[SC_FACE_INDEX]
    available = set(face.getBestCmap())

    wanted = set(gb2312_hanzi()) | set(EXTRA_CHARS) | template_characters()
    wanted.discard("\n")
    missing = sorted(c for c in wanted if ord(c) not in available and ord(c) > 0x7F)

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = []
    options.drop_tables = ["BASE", "JSTF", "DSIG", "MATH", "GDEF", "GSUB", "GPOS"]
    options.name_IDs = ["*"]
    options.notdef_outline = True

    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes={ord(c) for c in wanted if ord(c) in available})
    subsetter.subset(face)
    face.flavor = "woff2"

    buffer = io.BytesIO()
    face.save(buffer)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(buffer.getvalue())

    print(
        f"wrote {OUT.relative_to(ROOT)} · {len(wanted) - len(missing)} characters · "
        f"{len(buffer.getvalue()) / 1024:.0f} KB"
    )
    if missing:
        print(f"{len(missing)} characters absent from the source face: {''.join(missing[:16])}")


if __name__ == "__main__":
    main()
