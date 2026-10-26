#!/usr/bin/env python3
"""
One-off / build-time jewellery matting for live camera try-on.

Catalogue photos remain displayImageUrl. This writes tightly cropped
transparent PNGs (jewellery only) into public/models/try-on/.

Uses rembg (ISNet) when installed; otherwise a high-pass + center-blob crop.
Never runs inside a customer try-on session.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public/redesign/demo"
OUT = ROOT / "public/models/try-on"

JOBS = [
    ("radiant-pear-halo-pendant.png", "pendant-alpha.png"),
    ("eternal-bloom-floral-necklace.png", "necklace-alpha.png"),
    ("infinity-twist-pave-ring.png", "ring-alpha.png"),
]


def tight_crop(im: Image.Image, pad: int = 10) -> Image.Image:
    arr = np.asarray(im.convert("RGBA"))
    ys, xs = np.where(arr[:, :, 3] > 16)
    if len(xs) == 0:
        return im
    x0 = max(0, int(xs.min()) - pad)
    y0 = max(0, int(ys.min()) - pad)
    x1 = min(arr.shape[1] - 1, int(xs.max()) + pad)
    y1 = min(arr.shape[0] - 1, int(ys.max()) + pad)
    crop = im.crop((x0, y0, x1 + 1, y1 + 1))
    out = np.asarray(crop).copy()
    out[out[:, :, 3] < 10] = 0
    return Image.fromarray(out, "RGBA")


def rembg_matte(src: Image.Image) -> Image.Image:
    from rembg import new_session, remove

    try:
        session = new_session("isnet-general-use")
    except Exception:
        session = new_session("u2net")
    return remove(src.convert("RGB"), session=session)


def save(im: Image.Image, name: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / name
    im.save(path, "PNG", optimize=True)
    webp = path.with_suffix(".webp")
    im.save(webp, "WEBP", quality=90, method=6)
    a = np.asarray(im.convert("RGBA"))
    opaque = float((a[:, :, 3] > 12).mean() * 100)
    print(f"wrote {path.relative_to(ROOT)} {im.size[0]}x{im.size[1]} opaque={opaque:.1f}%")


def main() -> None:
    for src_name, out_name in JOBS:
        src = Image.open(SRC / src_name)
        print("matting", src_name)
        alpha = tight_crop(rembg_matte(src), pad=10)
        save(alpha, out_name)

    neck = Image.open(OUT / "necklace-alpha.png").convert("RGBA")
    w, h = neck.size
    box = (int(w * 0.22), int(h * 0.34), int(w * 0.78), int(h * 0.98))
    save(tight_crop(neck.crop(box), pad=6), "necklace-center-alpha.png")


if __name__ == "__main__":
    main()
