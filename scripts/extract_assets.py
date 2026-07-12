"""
Asset extraction tooling for StudyQuest (docs/02_design/asset-manifest.md).

Crops sprite/icon regions out of the concept sheets under public/assets and
docs/02_design/references, keys their backgrounds to transparency with a
soft-alpha ramp + fringe decontamination + despeckle, and writes staged
outputs plus verification montages. Nothing is written into the live asset
folders by this module's helpers directly — extraction jobs write to
asset_staging/ and a human (or the driving session) promotes crops that
pass visual review.

Run:  python scripts/extract_assets.py <job>   (see JOBS at the bottom)
"""

from __future__ import annotations

import os
import sys
from collections import deque

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGING = os.path.join(ROOT, "asset_staging")

SHEETS = {
    "icons": "public/assets/icons/ChatGPT Image Jul 11, 2026, 10_26_04 PM.png",
    "base": "public/assets/characters/base/ChatGPT Image Jul 11, 2026, 10_07_29 PM.png",
    "hair": "public/assets/characters/hair/ChatGPT Image Jul 11, 2026, 10_12_59 PM.png",
    "eyes": "public/assets/characters/eyes/ChatGPT Image Jul 11, 2026, 10_11_27 PM.png",
    "mouth": "public/assets/characters/mouth/ChatGPT Image Jul 11, 2026, 10_17_26 PM.png",
    "accessories": "public/assets/characters/accessories/ChatGPT Image Jul 11, 2026, 10_22_19 PM.png",
    "poses": "docs/02_design/references/characters/ChatGPT Image Jul 11, 2026, 10_06_27 PM.png",
    "vignettes": "docs/02_design/references/backgrounds/ChatGPT Image Jul 11, 2026, 04_05_55 PM.png",
}

_sheet_cache: dict[str, Image.Image] = {}


def sheet(name: str) -> Image.Image:
    if name not in _sheet_cache:
        _sheet_cache[name] = Image.open(os.path.join(ROOT, SHEETS[name])).convert("RGB")
    return _sheet_cache[name]


def sample_bg(arr: np.ndarray) -> np.ndarray:
    """Median color of the 2px border ring — robust to small intrusions."""
    top = arr[:2].reshape(-1, 3)
    bottom = arr[-2:].reshape(-1, 3)
    left = arr[:, :2].reshape(-1, 3)
    right = arr[:, -2:].reshape(-1, 3)
    ring = np.concatenate([top, bottom, left, right])
    return np.median(ring, axis=0)


def soft_key(
    img: Image.Image,
    bg: np.ndarray | None = None,
    t0: float = 18.0,
    t1: float = 55.0,
) -> Image.Image:
    """
    Key `bg` to transparency with a soft ramp.

    alpha = 0 where color distance <= t0, 255 where >= t1, linear between.
    Edge pixels are decontaminated: the bg contribution implied by their
    partial alpha is subtracted so no light halo remains.
    """
    arr = np.asarray(img.convert("RGB"), dtype=np.float64)
    if bg is None:
        bg = sample_bg(arr)
    dist = np.sqrt(((arr - bg) ** 2).sum(axis=2))
    alpha = np.clip((dist - t0) / (t1 - t0), 0.0, 1.0)

    # Decontaminate: px = a*fg + (1-a)*bg  =>  fg = (px - (1-a)*bg) / a
    a3 = alpha[..., None]
    safe = np.maximum(a3, 1e-6)
    fg = (arr - (1.0 - a3) * bg) / safe
    fg = np.clip(fg, 0, 255)

    out = np.dstack([fg, alpha * 255.0]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def fill_holes(keyed: Image.Image, original: Image.Image) -> Image.Image:
    """
    Restore interior transparent regions (e.g. a blank face whose skin tone
    matched the keyed background). Any transparent pixel not connected to
    the image border is a hole — refill it from the original RGB.
    """
    arr = np.array(keyed)
    src = np.asarray(original.convert("RGB"))
    transparent = arr[..., 3] < 128
    h, w = transparent.shape
    outside = np.zeros_like(transparent, dtype=bool)
    dq = deque()
    for x in range(w):
        for y in (0, h - 1):
            if transparent[y, x] and not outside[y, x]:
                outside[y, x] = True
                dq.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if transparent[y, x] and not outside[y, x]:
                outside[y, x] = True
                dq.append((y, x))
    while dq:
        cy, cx = dq.popleft()
        for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
            if 0 <= ny < h and 0 <= nx < w and transparent[ny, nx] and not outside[ny, nx]:
                outside[ny, nx] = True
                dq.append((ny, nx))
    holes = transparent & ~outside
    arr[holes, :3] = src[holes]
    arr[holes, 3] = 255
    return Image.fromarray(arr, "RGBA")


def despeckle(img: Image.Image, min_area: int = 24, alpha_thresh: int = 40) -> Image.Image:
    """Drop connected alpha components smaller than min_area pixels (BFS)."""
    arr = np.array(img)
    solid = arr[..., 3] >= alpha_thresh
    h, w = solid.shape
    seen = np.zeros_like(solid, dtype=bool)
    for y in range(h):
        for x in range(w):
            if solid[y, x] and not seen[y, x]:
                comp = []
                dq = deque([(y, x)])
                seen[y, x] = True
                while dq:
                    cy, cx = dq.popleft()
                    comp.append((cy, cx))
                    for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                        if 0 <= ny < h and 0 <= nx < w and solid[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            dq.append((ny, nx))
                if len(comp) < min_area:
                    for cy, cx in comp:
                        arr[cy, cx, 3] = 0
    return Image.fromarray(arr, "RGBA")


def trim(img: Image.Image, pad: int = 2) -> Image.Image:
    bbox = img.getbbox()
    if bbox is None:
        return img
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(img.width, x1 + pad)
    y1 = min(img.height, y1 + pad)
    return img.crop((x0, y0, x1, y1))


def pad_square(img: Image.Image, canvas: int) -> Image.Image:
    """Fit content into a square canvas, centered, scaling down only."""
    w, h = img.size
    scale = min(canvas / w, canvas / h, 1.0)
    if scale < 1.0:
        img = img.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
        w, h = img.size
    out = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    out.paste(img, ((canvas - w) // 2, (canvas - h) // 2), img)
    return out


def extract(
    sheet_name: str,
    box: tuple[int, int, int, int],
    out_rel: str,
    *,
    key: bool = True,
    t0: float = 18.0,
    t1: float = 55.0,
    min_area: int = 24,
    canvas: int | None = None,
) -> Image.Image:
    """Crop -> (key -> despeckle -> trim) -> optional square pad -> save to staging."""
    img = sheet(sheet_name).crop(box)
    if key:
        result = soft_key(img, t0=t0, t1=t1)
        result = despeckle(result, min_area=min_area)
        result = trim(result)
    else:
        result = img.convert("RGBA")
    if canvas:
        result = pad_square(result, canvas)
    out_path = os.path.join(STAGING, out_rel)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    result.save(out_path)
    print(f"staged {out_rel}  {result.size}")
    return result


def montage(rel_paths: list[str], out_rel: str, cell: int = 120, bg=(120, 150, 170, 255)) -> None:
    """Verification sheet: every staged crop on a colored background."""
    tiles = []
    for rel in rel_paths:
        p = os.path.join(STAGING, rel)
        tile = Image.new("RGBA", (cell, cell), bg)
        if os.path.exists(p):
            img = Image.open(p).convert("RGBA")
            img.thumbnail((cell - 8, cell - 8), Image.LANCZOS)
            tile.paste(img, ((cell - img.width) // 2, (cell - img.height) // 2), img)
        tiles.append(tile)
    cols = min(len(tiles), 8)
    rows = (len(tiles) + cols - 1) // cols
    out = Image.new("RGBA", (cols * cell, rows * cell), bg)
    for i, tile in enumerate(tiles):
        out.paste(tile, ((i % cols) * cell, (i // cols) * cell))
    out_path = os.path.join(STAGING, out_rel)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    out.save(out_path)
    print(f"montage {out_rel}  ({len(tiles)} tiles)")


# --- Jobs are registered by the driving session as coordinates are calibrated ---
JOBS: dict[str, callable] = {}


def job(fn):
    JOBS[fn.__name__] = fn
    return fn


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in JOBS:
        print("usage: python scripts/extract_assets.py <job>")
        print("jobs:", ", ".join(JOBS) or "(none registered)")
        sys.exit(1)
    JOBS[sys.argv[1]]()
