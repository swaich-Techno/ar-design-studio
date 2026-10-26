#!/usr/bin/env node
/**
 * Procedural gold ring GLB for live camera try-on.
 * Try-on asset only — not a catalogue card. 1 unit = 1 millimetre.
 * Inner diameter ~17 mm (typical ring size). Hole along +Z.
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

function torus({ R, r, radial = 36, tubular = 16 }) {
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
        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u);
        const z = r * Math.sin(v);
        return [x, y, z];
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

function sphere({ r, w = 12, h = 10, tx = 0, ty = 0, tz = 0 }) {
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
        r * Math.sin(phi) * Math.cos(theta) + tx,
        r * Math.cos(phi) + ty,
        r * Math.sin(phi) * Math.sin(theta) + tz,
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

function writeGlb(name, geo, mat) {
  const json = {
    asset: { version: "2.0", generator: "B Socio try-on ring (procedural torus, not CAD)" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ name, mesh: 0 }],
    meshes: [],
    materials: [
      {
        name: mat.name,
        pbrMetallicRoughness: {
          baseColorFactor: mat.color,
          metallicFactor: mat.metal,
          roughnessFactor: mat.rough,
        },
      },
    ],
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

  const pos = f32(geo.positions);
  const nrm = f32(geo.normals);
  const idxBuf = u16(geo.indices);
  const posView = pushView(pos, 34962);
  const nrmView = pushView(nrm, 34962);
  const idxView = pushView(idxBuf, 34963);
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  for (let i = 0; i < geo.positions.length; i += 3) {
    minX = Math.min(minX, geo.positions[i]);
    minY = Math.min(minY, geo.positions[i + 1]);
    minZ = Math.min(minZ, geo.positions[i + 2]);
    maxX = Math.max(maxX, geo.positions[i]);
    maxY = Math.max(maxY, geo.positions[i + 1]);
    maxZ = Math.max(maxZ, geo.positions[i + 2]);
  }
  json.accessors.push({
    bufferView: posView,
    componentType: 5126,
    count: geo.positions.length / 3,
    type: "VEC3",
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
  });
  json.accessors.push({
    bufferView: nrmView,
    componentType: 5126,
    count: geo.normals.length / 3,
    type: "VEC3",
  });
  json.accessors.push({
    bufferView: idxView,
    componentType: 5123,
    count: geo.indices.length,
    type: "SCALAR",
  });
  json.meshes.push({
    primitives: [
      {
        attributes: { POSITION: 0, NORMAL: 1 },
        indices: 2,
        material: 0,
      },
    ],
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

// Inner diameter 17 mm, band ~2.3 mm. Hole along +Z so it wraps a finger. Origin = ring center.
writeGlb("gold-ring", torus({ R: 9.65, r: 1.15, radial: 40, tubular: 18 }), {
  name: "Gold",
  color: [0.83, 0.65, 0.22, 1],
  metal: 1,
  rough: 0.18,
});
