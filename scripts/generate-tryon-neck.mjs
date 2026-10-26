#!/usr/bin/env node
/**
 * Procedural millimetre-scale GLBs for pendant and necklace try-on.
 * Origin: pendant bail / necklace floral centre. Not catalogue ProductCards.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/models/try-on");

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

function torus({ R, r, radial = 28, tubular = 14, tx = 0, ty = 0, tz = 0, rx = 0, ry = 0 }) {
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
        const x3 = x * Math.cos(ry) + z2 * Math.sin(ry);
        const z3 = -x * Math.sin(ry) + z2 * Math.cos(ry);
        return [x3 + tx, y2 + ty, z3 + tz];
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

function sphere({ r, w = 14, h = 10, tx = 0, ty = 0, tz = 0, sx = 1, sy = 1, sz = 1 }) {
  const positions = [];
  const normals = [];
  const indices = [];
  const rings = [];
  for (let i = 0; i <= h; i += 1) {
    const phi = (i / h) * Math.PI;
    const row = [];
    for (let j = 0; j <= w; j += 1) {
      const theta = (j / w) * Math.PI * 2;
      row.push([
        r * Math.sin(phi) * Math.cos(theta) * sx + tx,
        r * Math.cos(phi) * sy + ty,
        r * Math.sin(phi) * Math.sin(theta) * sz + tz,
      ]);
    }
    rings.push(row);
  }
  for (let i = 0; i < h; i += 1) {
    for (let j = 0; j < w; j += 1) {
      addTri(positions, normals, indices, ...rings[i][j], ...rings[i][j + 1], ...rings[i + 1][j + 1]);
      addTri(positions, normals, indices, ...rings[i][j], ...rings[i + 1][j + 1], ...rings[i + 1][j]);
    }
  }
  return { positions, normals, indices };
}

function cylinder({ rTop, rBot, h, seg = 10, tx = 0, ty = 0, tz = 0 }) {
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
  return { name: "Gold", color: [0.83, 0.65, 0.22, 1], metal: 1, rough: 0.18 };
}
function diamond() {
  return { name: "Diamond", color: [0.86, 0.93, 0.98, 1], metal: 0.18, rough: 0.05 };
}

function writeGlb(name, primitives) {
  const json = {
    asset: { version: "2.0", generator: "B Socio try-on neck (procedural mm mesh, not a catalogue card)" },
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
    offset += padded.length;
    return json.bufferViews.length - 1;
  }
  primitives.forEach((prim) => {
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
      primitives: [{ attributes: { POSITION: posAcc, NORMAL: nrmAcc }, indices: idxAcc, material: json.materials.length - 1 }],
    });
    json.nodes.push({ mesh: json.meshes.length - 1 });
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
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `${name}.glb`), concat([header, jsonHead, jsonBuf, binHead, binBuf]));
  console.log(`wrote ${name}.glb`);
}

function pendant() {
  const g = gold();
  const d = diamond();
  const goldParts = [
    torus({ R: 2.1, r: 0.42, radial: 20, tubular: 10, ty: 0.2, rx: Math.PI / 2 }),
    cylinder({ rTop: 0.55, rBot: 0.7, h: 11, tx: -0.55, ty: -0.4 }),
    cylinder({ rTop: 0.45, rBot: 0.6, h: 11, tx: 0.55, ty: -0.4 }),
    torus({ R: 7.4, r: 0.55, radial: 28, tubular: 10, ty: -28, rx: 0.12 }),
  ];
  const diamondParts = [
    sphere({ r: 1.15, w: 10, h: 8, ty: -12.2 }),
    sphere({ r: 6.4, w: 16, h: 12, ty: -28, sx: 0.72, sy: 1.18, sz: 0.36 }),
  ];
  for (let i = 0; i < 16; i += 1) {
    const a = (i / 16) * Math.PI * 2;
    diamondParts.push(
      sphere({
        r: 0.85,
        w: 8,
        h: 6,
        tx: Math.cos(a) * 7.2 * 0.72,
        ty: -28 + Math.sin(a) * 7.2 * 1.05,
        tz: 1.4,
      }),
    );
  }
  writeGlb("pendant-tryon", [
    { geo: merge(goldParts), mat: g },
    { geo: merge(diamondParts), mat: d },
  ]);
}

function necklace() {
  const g = gold();
  const d = diamond();
  const goldParts = [sphere({ r: 3.2, w: 12, h: 8, ty: 0, sx: 1.1, sy: 0.45, sz: 0.55 })];
  const diamondParts = [sphere({ r: 2.1, w: 10, h: 8, ty: 0.4 })];
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    diamondParts.push(
      sphere({
        r: 2.6,
        w: 10,
        h: 7,
        tx: Math.cos(a) * 6.2,
        ty: Math.sin(a) * 4.4,
        tz: 0.6,
        sx: 0.45,
        sy: 1.15,
        sz: 0.35,
      }),
    );
    goldParts.push(
      sphere({
        r: 2.9,
        w: 8,
        h: 6,
        tx: Math.cos(a) * 6.2,
        ty: Math.sin(a) * 4.4,
        tz: 0,
        sx: 0.55,
        sy: 1.25,
        sz: 0.28,
      }),
    );
  }
  for (const side of [-1, 1]) {
    goldParts.push(sphere({ r: 4.2, w: 10, h: 7, tx: side * 14, ty: 2.5, tz: 0, sx: 1.35, sy: 0.55, sz: 0.32 }));
    diamondParts.push(sphere({ r: 1.6, w: 8, h: 6, tx: side * 11, ty: 3.2, tz: 1.1 }));
    diamondParts.push(sphere({ r: 1.4, w: 8, h: 6, tx: side * 16.5, ty: 1.6, tz: 1 }));
  }
  goldParts.push(sphere({ r: 2.4, w: 10, h: 8, ty: -12, sx: 0.55, sy: 1.2, sz: 0.28 }));
  diamondParts.push(sphere({ r: 2.2, w: 10, h: 8, ty: -16.5, sx: 0.55, sy: 1.15, sz: 0.3 }));
  writeGlb("necklace-tryon", [
    { geo: merge(goldParts), mat: g },
    { geo: merge(diamondParts), mat: d },
  ]);
}

pendant();
necklace();
