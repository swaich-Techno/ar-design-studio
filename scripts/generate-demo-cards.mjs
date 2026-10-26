/**
 * Build a standing photo-card GLB + USDZ for each demo product.
 * Interactive Demo only — places a textured plane of the product photo in space.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const demoDir = join(root, "public/redesign/demo");

const cards = [
  { file: "radiant-pear-halo-pendant.png", height: 0.16 },
  { file: "infinity-twist-pave-ring.png", height: 0.12 },
  { file: "eternal-bloom-floral-necklace.png", height: 0.2 },
  { file: "signature-molten-lava-cake.png", height: 0.18, shadow: true },
  { file: "cherry-mint-sparkler.png", height: 0.16, shadow: true },
  { file: "signature-bacon-cheeseburger.png", height: 0.26, shadow: true },
];

function pngSize(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function pad4(n) {
  return (4 - (n % 4)) % 4;
}

function align(n, a) {
  return (a - (n % a)) % a;
}

function circleShadow(radius, y = 0.0012, segments = 24) {
  const positions = [0, y, 0];
  const normals = [0, 1, 0];
  const uvs = [0.5, 0.5];
  const indices = [];
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    positions.push(Math.cos(t) * radius, y, Math.sin(t) * radius);
    normals.push(0, 1, 0);
    uvs.push(0.5 + Math.cos(t) * 0.5, 0.5 + Math.sin(t) * 0.5);
    indices.push(0, i + 1, i + 1 === segments ? 1 : i + 2);
  }
  const xs = [];
  const zs = [];
  for (let i = 0; i < positions.length; i += 3) {
    xs.push(positions[i]);
    zs.push(positions[i + 2]);
  }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices),
    min: [Math.min(...xs), y, Math.min(...zs)],
    max: [Math.max(...xs), y, Math.max(...zs)],
    vertexCount: segments + 1,
    indexCount: indices.length,
  };
}

function writeGlb(png, widthM, heightM, shadow = false) {
  const positions = new Float32Array([
    -widthM / 2, 0, 0,
    widthM / 2, 0, 0,
    widthM / 2, heightM, 0,
    -widthM / 2, heightM, 0,
  ]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]);
  const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
  const disc = shadow ? circleShadow(Math.max(widthM, heightM) * 0.55) : null;

  let offset = 0;
  const views = [];
  function push(data, target) {
    const pad = pad4(data.length);
    views.push({
      buffer: 0,
      byteOffset: offset,
      byteLength: data.length,
      target,
    });
    offset += data.length + pad;
    return Buffer.concat([data, Buffer.alloc(pad)]);
  }

  const chunks = [
    push(Buffer.from(positions.buffer), 34962),
    push(Buffer.from(uvs.buffer), 34962),
    push(Buffer.from(normals.buffer), 34962),
    push(Buffer.from(indices.buffer), 34963),
  ];
  if (disc) {
    chunks.push(
      push(Buffer.from(disc.positions.buffer), 34962),
      push(Buffer.from(disc.uvs.buffer), 34962),
      push(Buffer.from(disc.normals.buffer), 34962),
      push(Buffer.from(disc.indices.buffer), 34963),
    );
  }
  const pngView = views.length;
  chunks.push(push(png, undefined));
  const bin = Buffer.concat(chunks);

  const primitives = [
    {
      attributes: { POSITION: 0, TEXCOORD_0: 1, NORMAL: 2 },
      indices: 3,
      material: 0,
    },
  ];
  const accessors = [
    {
      bufferView: 0,
      componentType: 5126,
      count: 4,
      type: "VEC3",
      min: [-widthM / 2, 0, 0],
      max: [widthM / 2, heightM, 0],
    },
    { bufferView: 1, componentType: 5126, count: 4, type: "VEC2" },
    { bufferView: 2, componentType: 5126, count: 4, type: "VEC3" },
    { bufferView: 3, componentType: 5123, count: 6, type: "SCALAR" },
  ];
  const materials = [
    {
      name: "PhotoCard",
      pbrMetallicRoughness: {
        baseColorTexture: { index: 0 },
        metallicFactor: 0,
        roughnessFactor: 0.85,
      },
      doubleSided: true,
    },
  ];

  if (disc) {
    primitives.push({
      attributes: { POSITION: 4, TEXCOORD_0: 5, NORMAL: 6 },
      indices: 7,
      material: 1,
    });
    accessors.push(
      {
        bufferView: 4,
        componentType: 5126,
        count: disc.vertexCount,
        type: "VEC3",
        min: disc.min,
        max: disc.max,
      },
      { bufferView: 5, componentType: 5126, count: disc.vertexCount, type: "VEC2" },
      { bufferView: 6, componentType: 5126, count: disc.vertexCount, type: "VEC3" },
      { bufferView: 7, componentType: 5123, count: disc.indexCount, type: "SCALAR" },
    );
    materials.push({
      name: "ContactShadow",
      pbrMetallicRoughness: {
        baseColorFactor: [0.04, 0.03, 0.02, 0.42],
        metallicFactor: 0,
        roughnessFactor: 1,
      },
      alphaMode: "BLEND",
      doubleSided: true,
    });
  }

  const json = {
    asset: { version: "2.0", generator: "B Socio AR interactive demo card" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: "ProductCard" }],
    meshes: [{ primitives }],
    materials,
    textures: [{ source: 0 }],
    images: [{ bufferView: pngView, mimeType: "image/png" }],
    accessors,
    bufferViews: views,
    buffers: [{ byteLength: bin.length }],
  };

  const jsonBuf = Buffer.from(JSON.stringify(json));
  const jsonPad = Buffer.alloc(pad4(jsonBuf.length), 0x20);
  const jsonChunk = Buffer.concat([jsonBuf, jsonPad]);
  const binPad = Buffer.alloc(pad4(bin.length));
  const binChunk = Buffer.concat([bin, binPad]);

  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8);

  const jsonHead = Buffer.alloc(8);
  jsonHead.writeUInt32LE(jsonChunk.length, 0);
  jsonHead.writeUInt32LE(0x4e4f534a, 4);

  const binHead = Buffer.alloc(8);
  binHead.writeUInt32LE(binChunk.length, 0);
  binHead.writeUInt32LE(0x004e4942, 4);

  return Buffer.concat([header, jsonHead, jsonChunk, binHead, binChunk]);
}

function writeUsdz(png, name, widthM, heightM, shadow = false) {
  const r = Math.max(widthM, heightM) * 0.55;
  const shadowMesh = shadow
    ? `
    def Mesh "ContactShadow"
    {
        float3[] extent = [(${(-r).toFixed(5)}, 0, ${(-r).toFixed(5)}), (${r.toFixed(5)}, 0.002, ${r.toFixed(5)})]
        int[] faceVertexCounts = [4]
        int[] faceVertexIndices = [0, 1, 2, 3]
        point3f[] points = [(${(-r).toFixed(5)}, 0.001, ${(-r).toFixed(5)}), (${r.toFixed(5)}, 0.001, ${(-r).toFixed(5)}), (${r.toFixed(5)}, 0.001, ${r.toFixed(5)}), (${(-r).toFixed(5)}, 0.001, ${r.toFixed(5)})]
        normal3f[] normals = [(0, 1, 0), (0, 1, 0), (0, 1, 0), (0, 1, 0)] (
            interpolation = "vertex"
        )
        color3f[] primvars:displayColor = [(0.04, 0.03, 0.02)]
        float[] primvars:displayOpacity = [0.35]
        uniform token subdivisionScheme = "none"
    }
`
    : "";
  const usda = `#usda 1.0
(
    defaultPrim = "Root"
    metersPerUnit = 1
    upAxis = "Y"
)

def Xform "Root" (
    kind = "component"
)
{
    def Mesh "Card"
    {
        float3[] extent = [(${(-widthM / 2).toFixed(5)}, 0, -0.001), (${(widthM / 2).toFixed(5)}, ${heightM.toFixed(5)}, 0.001)]
        int[] faceVertexCounts = [4]
        int[] faceVertexIndices = [0, 1, 2, 3]
        point3f[] points = [(${(-widthM / 2).toFixed(5)}, 0, 0), (${(widthM / 2).toFixed(5)}, 0, 0), (${(widthM / 2).toFixed(5)}, ${heightM.toFixed(5)}, 0), (${(-widthM / 2).toFixed(5)}, ${heightM.toFixed(5)}, 0)]
        normal3f[] normals = [(0, 0, 1), (0, 0, 1), (0, 0, 1), (0, 0, 1)] (
            interpolation = "vertex"
        )
        texCoord2f[] primvars:st = [(0, 0), (1, 0), (1, 1), (0, 1)] (
            interpolation = "vertex"
        )
        uniform token subdivisionScheme = "none"
        rel material:binding = </Root/Material>
    }
${shadowMesh}
    def Material "Material"
    {
        token outputs:surface.connect = </Root/Material/PreviewSurface.outputs:surface

        def Shader "PreviewSurface"
        {
            uniform token info:id = "UsdPreviewSurface"
            color3f inputs:diffuseColor.connect = </Root/Material/Texture.outputs:rgb
            float inputs:roughness = 0.85
            float inputs:metallic = 0
            token outputs:surface
        }

        def Shader "Texture"
        {
            uniform token info:id = "UsdUVTexture"
            asset inputs:file = @${name}.png@
            float2 inputs:st.connect = </Root/Material/Primvar.outputs:result
            float3 outputs:rgb
        }

        def Shader "Primvar"
        {
            uniform token info:id = "UsdPrimvarReader_float2"
            token inputs:varname = "st"
            float2 outputs:result
        }
    }
}
`;

  const files = [
    { name: `${name}.usda`, data: Buffer.from(usda) },
    { name: `${name}.png`, data: png },
  ];

  const parts = [];
  const central = [];
  let offset = 0;

  for (const file of files) {
    const nameBuf = Buffer.from(file.name);
    const extraLenNeeded = align(offset + 30 + nameBuf.length, 64);
    const extra = Buffer.alloc(extraLenNeeded);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(0, 14);
    local.writeUInt32LE(file.data.length, 18);
    local.writeUInt32LE(file.data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(extra.length, 28);

    parts.push(local, nameBuf, extra, file.data);

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(0, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0, 14);
    cd.writeUInt32LE(0, 16);
    cd.writeUInt32LE(file.data.length, 20);
    cd.writeUInt32LE(file.data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(offset, 42);
    central.push(cd, nameBuf);

    offset += local.length + nameBuf.length + extra.length + file.data.length;
  }

  const cdBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(cdBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);

  return Buffer.concat([...parts, cdBuf, eocd]);
}

mkdirSync(demoDir, { recursive: true });

for (const card of cards) {
  const png = readFileSync(join(demoDir, card.file));
  const { width, height } = pngSize(png);
  const heightM = card.height;
  const widthM = heightM * (width / height);
  const stem = card.file.replace(/\.png$/, "");
  writeFileSync(join(demoDir, `${stem}.glb`), writeGlb(png, widthM, heightM, Boolean(card.shadow)));
  writeFileSync(join(demoDir, `${stem}.usdz`), writeUsdz(png, stem, widthM, heightM, Boolean(card.shadow)));
  console.log(`${stem}: ${width}x${height} → ${widthM.toFixed(3)}m x ${heightM}m`);
}
