import * as THREE from "three";
import type { OverlayAnchor, TryOnProduct } from "../types";
import { resolveTryOnAsset } from "../catalog";
import { MM } from "../utils/cameraSpace";
import { goldMaterial, ModelLoader } from "./ModelLoader";

const DUMMY = new THREE.Object3D();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _mid = new THREE.Vector3();

function metalOf(product: TryOnProduct) {
  return product.metal === "silver" ? "silver" : "gold";
}

function applyOpacity(root: THREE.Object3D, opacity: number) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      const m = mat as THREE.MeshStandardMaterial;
      m.opacity = opacity;
      if (m.alphaTest > 0) {
        m.transparent = opacity < 0.99;
        m.depthWrite = opacity > 0.2;
        m.depthTest = true;
        continue;
      }
      m.transparent = opacity < 0.99;
      m.depthWrite = opacity > 0.85;
      m.depthTest = true;
    }
  });
}

function loadTexture(url: string) {
  return new Promise<THREE.Texture>((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        tex.needsUpdate = true;
        resolve(tex);
      },
      undefined,
      reject,
    );
  });
}

function makeChain(metal: "gold" | "silver", links: number) {
  const geo = new THREE.CylinderGeometry(1, 1, 1, 6);
  const mesh = new THREE.InstancedMesh(geo, goldMaterial(metal), links);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  mesh.renderOrder = 2;
  mesh.userData.kind = "chain";
  return mesh;
}

function layoutChain(mesh: THREE.InstancedMesh, from: THREE.Vector3, via: THREE.Vector3, to: THREE.Vector3) {
  const curve = new THREE.CatmullRomCurve3([from, via, to]);
  const n = mesh.count;
  const radius = 0.00135;
  for (let i = 0; i < n; i += 1) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const t2 = Math.min(1, t + 1 / Math.max(n, 2));
    curve.getPoint(t, DUMMY.position);
    curve.getPoint(t2, _b);
    const dist = Math.max(DUMMY.position.distanceTo(_b), 0.004);
    if (dist < 1e-5) {
      DUMMY.quaternion.identity();
    } else {
      DUMMY.up.set(0, 0, 1);
      DUMMY.lookAt(_b);
      DUMMY.rotateX(Math.PI / 2);
    }
    DUMMY.scale.set(radius, dist, radius);
    DUMMY.updateMatrix();
    mesh.setMatrixAt(i, DUMMY.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
}

export class JewelleryFactory {
  constructor(private loader: ModelLoader) {}

  async create(product: TryOnProduct): Promise<THREE.Object3D> {
    const asset = resolveTryOnAsset(product);
    if (product.category === "necklace" || product.category === "pendant") {
      return this.createNeck(product, asset.kind, asset.url);
    }
    if (asset.kind === "glb") {
      try {
        return await this.loader.loadNormalized(asset.url, product);
      } catch {
        /* missing below */
      }
    }
    const empty = new THREE.Group();
    empty.userData.missingAsset = true;
    empty.userData.assetKind = "missing";
    empty.userData.assetUrl = "";
    return empty;
  }

  private async createTransparentPrototype(product: TryOnProduct, url: string) {
    const texture = await loadTexture(url);
    const img = texture.image as { width?: number; height?: number };
    const aspect = img?.width && img?.height ? img.width / img.height : product.widthMm / Math.max(product.heightMm, 1);
    const h = product.heightMm;
    const w = product.widthMm || h * aspect;
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.22,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
      metalness: 0.62,
      roughness: 0.28,
      envMapIntensity: 1.15,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    if (product.category === "pendant") mesh.position.y = -h * 0.5;
    mesh.renderOrder = 2;
    const group = new THREE.Group();
    group.add(mesh);
    group.userData.kind = "transparentPrototype";
    group.userData.assetKind = "image";
    group.userData.assetUrl = url;
    return group;
  }

  private async createNeck(product: TryOnProduct, kind: "glb" | "image" | "missing", url: string) {
    const root = new THREE.Group();
    root.userData.kind = "neckPiece";
    root.userData.assetKind = kind;
    root.userData.assetUrl = url;
    if (kind === "missing" || !url) {
      root.userData.missingAsset = true;
      return root;
    }
    const metal = metalOf(product);
    let pendant: THREE.Object3D;
    try {
      pendant = kind === "glb" ? await this.loader.loadNormalized(url, product) : await this.createTransparentPrototype(product, url);
    } catch {
      root.userData.missingAsset = true;
      root.userData.assetKind = "missing";
      return root;
    }
    pendant.name = "pendant";
    const left = makeChain(metal, product.category === "pendant" ? 14 : 18);
    left.name = "leftChain";
    const right = makeChain(metal, product.category === "pendant" ? 14 : 18);
    right.name = "rightChain";
    root.add(left, pendant, right);
    root.userData.layout = (anchor: OverlayAnchor) => this.layoutNeck(root, product, anchor);
    return root;
  }

  layoutNeck(root: THREE.Object3D, product: TryOnProduct, anchor: OverlayAnchor) {
    const chain = anchor.chain;
    if (!chain) return;
    const left = root.getObjectByName("leftChain") as THREE.InstancedMesh | undefined;
    const right = root.getObjectByName("rightChain") as THREE.InstancedMesh | undefined;
    const pendant = root.getObjectByName("pendant") as THREE.Object3D | undefined;
    _a.set(chain.left.x, chain.left.y, chain.left.z);
    _c.set(chain.right.x, chain.right.y, chain.right.z);
    _mid.set(chain.pendant.x, chain.pendant.y, chain.pendant.z);
    if (pendant) {
      pendant.position.copy(_mid);
      if (anchor.quaternion) {
        pendant.quaternion.set(anchor.quaternion.x, anchor.quaternion.y, anchor.quaternion.z, anchor.quaternion.w);
      }
      const ppm = Math.max(anchor.pixelsPerMm, MM * 0.7);
      pendant.scale.setScalar(ppm);
    }
    _b.copy(_a).lerp(_mid, 0.45);
    _b.y += product.category === "pendant" ? 0.008 : 0.012;
    if (left) layoutChain(left, _a, _b, _mid);
    _b.copy(_c).lerp(_mid, 0.45);
    _b.y += product.category === "pendant" ? 0.008 : 0.012;
    if (right) layoutChain(right, _c, _b, _mid);
  }

  static setOpacity(root: THREE.Object3D, opacity: number) {
    applyOpacity(root, opacity);
  }
}
