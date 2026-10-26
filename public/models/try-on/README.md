# Try-on assets

Production live-camera overlays. Catalogue photos stay in `/redesign/demo/` as `displayImageUrl`.

- Not jeweller CAD
- Not generated with TripoSR
- Not drawn as rectangular product photos in the live camera
- GLB units: **1 unit = 1 millimetre**

| File | Role |
| --- | --- |
| gold-ring.glb | Gold PBR torus, origin at ring centre, hole along +Z |
| pendant-tryon.glb | 3D pear-halo pendant, origin at bail |
| necklace-tryon.glb | 3D floral centre, origin at chest |
| radiant-pear-transparent.webp | True-alpha fallback for the pendant (not a catalogue card) |
| eternal-bloom-transparent.webp | True-alpha crop of the full necklace (reference; live necklace uses the GLB) |
| pendant-alpha.png / necklace-alpha.png / ring-alpha.png | rembg intermediates |
| gold-hoop.glb, pearl-drop.glb, diamond-stud.glb, jhumka-drop.glb | Earring engine only — not Try On Me carousel cards |

Regenerate GLBs with `node scripts/generate-tryon-earrings.mjs` and `node scripts/generate-tryon-ring.mjs`.
Regenerate transparent PNGs with `python3 scripts/process-tryon-assets.py` (rembg ISNet, one-off).
