import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { TryOnProduct } from "../types";

export function goldMaterial(metal: "gold" | "silver" = "gold") {
  const color = metal === "silver" ? 0xc5ccd3 : 0xd4af37;
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 1,
    roughness: 0.18,
    envMapIntensity: 1.45,
  });
}

export class ModelLoader {
  private loader = new GLTFLoader();
  private cache = new Map<string, THREE.Group>();
  private inflight = new Map<string, Promise<THREE.Group>>();

  async load(url: string): Promise<THREE.Group> {
    const hit = this.cache.get(url);
    if (hit) return hit.clone(true) as THREE.Group;
    const pending = this.inflight.get(url);
    if (pending) return (await pending).clone(true) as THREE.Group;

    const job = this.loader.loadAsync(url).then((gltf) => {
      const root = gltf.scene;
      root.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const mat of materials) {
          const std = mat as THREE.MeshStandardMaterial;
          if (std.isMeshStandardMaterial) {
            std.envMapIntensity = Math.max(std.envMapIntensity ?? 1, 1.35);
            std.needsUpdate = true;
          }
        }
      });
      this.cache.set(url, root);
      this.inflight.delete(url);
      return root;
    });
    this.inflight.set(url, job);
    try {
      return (await job).clone(true) as THREE.Group;
    } catch (error) {
      this.inflight.delete(url);
      throw error;
    }
  }

  async loadNormalized(url: string, product: TryOnProduct): Promise<THREE.Group> {
    const root = await this.load(url);
    return this.normalizePivot(root, product);
  }

  normalizePivot(root: THREE.Group, product: TryOnProduct): THREE.Group {
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    if (product.category === "pendant") {
      root.position.x -= center.x;
      root.position.z -= center.z;
      root.position.y -= box.max.y;
    } else {
      root.position.sub(center);
    }
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0 && maxDim < 2) {
      const target = Math.max(product.heightMm || product.widthMm || 20, 8);
      root.scale.multiplyScalar(target / maxDim);
    }
    root.userData.kind = "glb";
    root.userData.assetUrl = product.tryOnModelUrl;
    return root;
  }

  fallbackStud(metal: "gold" | "silver" = "gold") {
    const group = new THREE.Group();
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(12, 1.15, 12, 28), goldMaterial(metal));
    hoop.position.y = -12;
    group.add(hoop);
    return group;
  }

  fallbackRing(metal: "gold" | "silver" = "gold") {
    const group = new THREE.Group();
    const band = new THREE.Mesh(new THREE.TorusGeometry(9.65, 1.15, 16, 40), goldMaterial(metal));
    group.add(band);
    return group;
  }

  fallbackPendant(metal: "gold" | "silver" = "gold") {
    const group = new THREE.Group();
    const drop = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 12), goldMaterial(metal));
    drop.scale.set(0.7, 1.15, 0.38);
    drop.position.y = -16;
    const bail = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.45, 8, 16), goldMaterial(metal));
    bail.rotation.x = Math.PI / 2;
    group.add(bail, drop);
    return group;
  }
}
