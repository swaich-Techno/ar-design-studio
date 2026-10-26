#!/usr/bin/env node
/**
 * Generates original demo earring GLBs (1 unit = 1 millimetre).
 * Not jeweller CAD — procedural PBR stand-ins for live camera try-on.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/models/try-on");
const thumbDir = join(outDir, "thumbs");

function pad4(buf, pad = 0x20) {
  const n = (4 - (buf.length % 4)) % 4;
  if (!n) return buf;
  return Buffer.concat([buf, Buffer.alloc(n, pad)]);
}

function concat(chunks) {
  return Buffer.concat(chunks);
}

function f32(arr) {
  return Buffer.from(new Float32Array(arr).buffer);
}

function u16(arr) {
  return Buffer.from(new Uint16Array(arr).buffer);
}

function addTri(positions, normals, indices, ax, ay, az, bx, by, bz, cx, cy, cz) {
  const i = positions.length / 3;
  positions.push(ax, ay, az, bx, by, bz, cx, cy, cz);
  const e1x = bx - ax;
  const e1y = by - ay;
  const e1z = bz - az;
  const e2x = cx - ax;
  const e2y = cy - ay;
  const e2z = cz - az;
  let nx = e1y * e2z - e1z * e2y;
  let ny = e1z * e2x - e1x * e2z;
  let nz = e1x * e2y - e1y * e2x;
  const len = Math.hypot(nx, ny, nz) || 1;
  nx /= len;
  ny /= len;
  nz /= len;
  normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
  indices.push(i, i + 1, i + 2);
}

function torus({ R, r, radial = 28, tubular = 14, tx = 0, ty = 0, tz = 0, rx = 0 }) {
  const positions = [];
  const normals = [];
  const indices = [];
  for (let i = 0; i < radial; i += 1) {
    const u0 = (i / radial) * Math.PI * 2;
    const u1 = ((i + 1) / radial) * Math.PI * 2;
    for (let j = 0; j < tubular; j += 1) {
      const v0 = (j / tubular) * Math.PI * 2;
      const v1 = ((j + 1) / tubular) * Math.PI * 2;
      const pt = (u, v) => {
        let x = (R + r * Math.cos(v)) * Math.cos(u);
        let y = (R + r * Math.cos(v)) * Math.sin(u);
        let z = r * Math.sin(v);
        const y2 = y * Math.cos(rx) - z * Math.sin(rx);
        const z2 = y * Math.sin(rx) + z * Math.cos(rx);
        return [x + tx, y2 + ty, z2 + tz];
      };
      const a = pt(u0, v0);
      const b = pt(u1, v0);
      const c = pt(u1, v1);
      const d = pt(u0, v1);
      addTri(positions, normals, indices, ...a, ...b, ...c);
      addTri(positions, normals, indices, ...a, ...c, ...d);
    }
  }
  return { positions, normals, indices };
}

function sphere({ r, w = 16, h = 12, tx = 0, ty = 0, tz = 0, sy = 1 }) {
  const positions = [];
  const normals = [];
  const indices = [];
  const rings = [];
  for (let i = 0; i <= h; i += 1) {
    const v = i / h;
    const phi = v * Math.PI;
    const row = [];
    for (let j = 0; j <= w; j += 1) {
      const u = j / w;
      const theta = u * Math.PI * 2;
      const x = r * Math.sin(phi) * Math.cos(theta) + tx;
      const y = r * Math.cos(phi) * sy + ty;
      const z = r * Math.sin(phi) * Math.sin(theta) + tz;
      row.push([x, y, z]);
    }
    rings.push(row);
  }
  for (let i = 0; i < h; i += 1) {
    for (let j = 0; j < w; j += 1) {
      const a = rings[i][j];
      const b = rings[i][j + 1];
      const c = rings[i + 1][j + 1];
      const d = rings[i + 1][j];
      addTri(positions, normals, indices, ...a, ...b, ...c);
      addTri(positions, normals, indices, ...a, ...c, ...d);
    }
  }
  return { positions, normals, indices };
}

function cylinder({ rTop, rBot, h, seg = 16, tx = 0, ty = 0, tz = 0 }) {
  const positions = [];
  const normals = [];
  const indices = [];
  for (let i = 0; i < seg; i += 1) {
    const a0 = (i / seg) * Math.PI * 2;
    const a1 = ((i + 1) / seg) * Math.PI * 2;
    const x0 = Math.cos(a0);
    const z0 = Math.sin(a0);
    const x1 = Math.cos(a1);
    const z1 = Math.sin(a1);
    const y0 = ty;
    const y1 = ty - h;
    addTri(positions, normals, indices, tx + rTop * x0, y0, tz + rTop * z0, tx + rTop * x1, y0, tz + rTop * z1, tx + rBot * x1, y1, tz + rBot * z1);
    addTri(positions, normals, indices, tx + rTop * x0, y0, tz + rTop * z0, tx + rBot * x1, y1, tz + rBot * z1, tx + rBot * x0, y1, tz + rBot * z0);
    addTri(positions, normals, indices, tx, y0, tz, tx + rTop * x1, y0, tz + rTop * z1, tx + rTop * x0, y0, tz + rTop * z0);
    addTri(positions, normals, indices, tx, y1, tz, tx + rBot * x0, y1, tz + rBot * z0, tx + rBot * x1, y1, tz + rBot * z1);
  }
  return { positions, normals, indices };
}

function merge(parts) {
  const positions = [];
  const normals = [];
  const indices = [];
  for (const part of parts) {
    const base = positions.length / 3;
    positions.push(...part.positions);
    normals.push(...part.normals);
    for (const i of part.indices) indices.push(i + base);
  }
  return { positions, normals, indices };
}

function gold() {
  return { name: "Gold", color: [0.83, 0.65, 0.22, 1], metal: 1, rough: 0.2 };
}
function silver() {
  return { name: "Silver", color: [0.75, 0.78, 0.82, 1], metal: 1, rough: 0.16 };
}
function pearl() {
  return { name: "Pearl", color: [0.93, 0.89, 0.82, 1], metal: 0.12, rough: 0.32 };
}
function diamond() {
  return { name: "Diamond", color: [0.86, 0.93, 0.98, 1], metal: 0.2, rough: 0.06 };
}

function writeGlb(name, primitives) {
  const json = {
    asset: { version: "2.0", generator: "B Socio try-on demo (procedural, not CAD)" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ name, children: primitives.map((_, i) => i + 1) }],
    meshes: [],
    materials: [],
    accessors: [],
    bufferViews: [],
    buffers: [{ byteLength: 0 }],
  };

  const chunks = [];
  let offset = 0;
  function pushView(buf, target) {
    const padded = pad4(buf, 0);
    json.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: buf.length, target });
    chunks.push(padded);
    const view = json.bufferViews.length - 1;
    offset += padded.length;
    return view;
  }

  primitives.forEach((prim, idx) => {
    const pos = f32(prim.geo.positions);
    const nrm = f32(prim.geo.normals);
    const idxBuf = u16(prim.geo.indices);
    const posView = pushView(pos, 34962);
    const nrmView = pushView(nrm, 34962);
    const idxView = pushView(idxBuf, 34963);
    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;
    for (let i = 0; i < prim.geo.positions.length; i += 3) {
      minX = Math.min(minX, prim.geo.positions[i]);
      minY = Math.min(minY, prim.geo.positions[i + 1]);
      minZ = Math.min(minZ, prim.geo.positions[i + 2]);
      maxX = Math.max(maxX, prim.geo.positions[i]);
      maxY = Math.max(maxY, prim.geo.positions[i + 1]);
      maxZ = Math.max(maxZ, prim.geo.positions[i + 2]);
    }
    const posAcc = json.accessors.length;
    json.accessors.push({
      bufferView: posView,
      componentType: 5126,
      count: prim.geo.positions.length / 3,
      type: "VEC3",
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ],
    });
    const nrmAcc = json.accessors.length;
    json.accessors.push({
      bufferView: nrmView,
      componentType: 5126,
      count: prim.geo.normals.length / 3,
      type: "VEC3",
    });
    const idxAcc = json.accessors.length;
    json.accessors.push({
      bufferView: idxView,
      componentType: 5123,
      count: prim.geo.indices.length,
      type: "SCALAR",
    });
    json.materials.push({
      name: prim.mat.name,
      pbrMetallicRoughness: {
        baseColorFactor: prim.mat.color,
        metallicFactor: prim.mat.metal,
        roughnessFactor: prim.mat.rough,
      },
    });
    json.meshes.push({
      primitives: [
        {
          attributes: { POSITION: posAcc, NORMAL: nrmAcc },
          indices: idxAcc,
          material: idx,
        },
      ],
    });
    json.nodes.push({ name: prim.mat.name, mesh: idx });
  });

  json.buffers[0].byteLength = offset;
  const jsonBuf = pad4(Buffer.from(JSON.stringify(json)), 0x20);
  const binBuf = concat(chunks);
  const total = 12 + 8 + jsonBuf.length + 8 + binBuf.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(total, 8);
  const jsonHead = Buffer.alloc(8);
  jsonHead.writeUInt32LE(jsonBuf.length, 0);
  jsonHead.writeUInt32LE(0x4e4f534a, 4);
  const binHead = Buffer.alloc(8);
  binHead.writeUInt32LE(binBuf.length, 0);
  binHead.writeUInt32LE(0x004e4942, 4);
  const glb = concat([header, jsonHead, jsonBuf, binHead, binBuf]);
  writeFileSync(join(outDir, `${name}.glb`), glb);
  console.log(`wrote ${name}.glb (${glb.length} bytes)`);
}

function hoop() {
  writeGlb("gold-hoop", [{ geo: torus({ R: 12, r: 1.15, tx: 0, ty: -13.15, tz: 0 }), mat: gold() }]);
}

function pearlDrop() {
  const hook = torus({ R: 2.2, r: 0.45, radial: 20, tubular: 10, ty: -2.2 });
  const stem = cylinder({ rTop: 0.45, rBot: 0.45, h: 14, ty: -4.2 });
  const cap = sphere({ r: 1.4, w: 12, h: 10, ty: -19 });
  const bead = sphere({ r: 4, w: 16, h: 12, ty: -24.2 });
  writeGlb("pearl-drop", [
    { geo: merge([hook, stem, cap]), mat: gold() },
    { geo: bead, mat: pearl() },
  ]);
}

function stud() {
  const gem = sphere({ r: 3.2, w: 12, h: 10, ty: -3.4, sy: 0.85 });
  const prongs = [];
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2;
    prongs.push(cylinder({ rTop: 0.28, rBot: 0.22, h: 3.4, tx: Math.cos(a) * 2.5, ty: -1.2, tz: Math.sin(a) * 2.5 }));
  }
  const plate = cylinder({ rTop: 2.6, rBot: 2.2, h: 0.7, ty: -0.2 });
  writeGlb("diamond-stud", [
    { geo: merge([plate, ...prongs]), mat: gold() },
    { geo: gem, mat: diamond() },
  ]);
}

function jhumka() {
  const hook = torus({ R: 2.0, r: 0.4, radial: 18, tubular: 10, ty: -2 });
  const dome = sphere({ r: 8.5, w: 18, h: 10, ty: -12, sy: 0.72 });
  const rim = torus({ R: 8.2, r: 0.7, radial: 24, tubular: 10, ty: -12.2, rx: Math.PI / 2 });
  const beads = [];
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    beads.push(sphere({ r: 0.85, w: 8, h: 6, tx: Math.cos(a) * 8.4, ty: -12.4, tz: Math.sin(a) * 8.4 }));
  }
  const drop = sphere({ r: 2.4, w: 12, h: 10, ty: -22.4 });
  writeGlb("jhumka-drop", [
    { geo: merge([hook, dome, rim, ...beads]), mat: gold() },
    { geo: drop, mat: pearl() },
  ]);
}

function svgThumb(file, body) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" role="img">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f3d48a"/>
      <stop offset="1" stop-color="#b8862a"/>
    </linearGradient>
  </defs>
  <rect width="160" height="160" rx="18" fill="#14110c"/>
  ${body}
</svg>`;
  writeFileSync(join(thumbDir, file), svg);
}

mkdirSync(thumbDir, { recursive: true });
hoop();
pearlDrop();
stud();
jhumka();
svgThumb(
  "gold-hoop.svg",
  `<ellipse cx="80" cy="88" rx="28" ry="34" fill="none" stroke="url(#g)" stroke-width="8"/>`,
);
svgThumb(
  "pearl-drop.svg",
  `<path d="M80 28 C92 28 96 42 80 54 C64 42 68 28 80 28Z" fill="url(#g)"/>
   <rect x="78" y="52" width="4" height="36" rx="2" fill="url(#g)"/>
   <circle cx="80" cy="108" r="16" fill="#f0e6d4"/>`,
);
svgThumb(
  "diamond-stud.svg",
  `<polygon points="80,46 108,80 80,114 52,80" fill="#e8f2ff"/>
   <polygon points="80,46 96,80 80,92 64,80" fill="url(#g)" opacity=".45"/>`,
);
svgThumb(
  "jhumka-drop.svg",
  `<path d="M80 36 C108 36 118 78 80 92 C42 78 52 36 80 36Z" fill="url(#g)"/>
   <circle cx="80" cy="112" r="10" fill="#f0e6d4"/>`,
);

writeFileSync(
  join(outDir, "README.md"),
  `# Demo earring assets

These GLBs are **original procedural demo models** for B Socio live camera try-on.

- Not jeweller CAD
- Not generated with TripoSR
- Units: **1 GLB unit = 1 millimetre**
- Origin: attachment point at the earlobe (jewellery hangs in −Y)

| File | Style | Approx. size |
| --- | --- | --- |
| gold-hoop.glb | Polished gold hoop | 26 mm diameter |
| pearl-drop.glb | Gold hook + 8 mm pearl | 32 mm drop |
| diamond-stud.glb | Six-prong solitaire | 6.5 mm stone |
| jhumka-drop.glb | Temple jhumka + pearl | 18 × 28 mm |

Regenerate with \`node scripts/generate-tryon-earrings.mjs\`.
`,
);
