import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export class LightingManager {
  private pmrem: THREE.PMREMGenerator | null = null;
  private env: THREE.Texture | null = null;

  apply(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    if (!this.pmrem) this.pmrem = new THREE.PMREMGenerator(renderer);
    if (!this.env) {
      const room = new RoomEnvironment();
      this.env = this.pmrem.fromScene(room, 0.04).texture;
      room.traverse((child) => {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose?.();
      });
    }
    scene.environment = this.env;
    scene.environmentIntensity = 1.15;

    const hemi = new THREE.HemisphereLight(0xfff4e6, 0x1a120c, 0.55);
    const key = new THREE.DirectionalLight(0xfff1d6, 1.35);
    key.position.set(-0.35, 0.4, 0.25);
    const fill = new THREE.DirectionalLight(0xb7c4ff, 0.45);
    fill.position.set(0.45, 0.12, 0.18);
    const rim = new THREE.DirectionalLight(0xffe7b0, 0.7);
    rim.position.set(0, 0.25, -1.1);
    scene.add(hemi, key, fill, rim);
  }

  setExposure(renderer: THREE.WebGLRenderer, luma: number) {
    const target = 0.88 + (0.5 - Math.min(Math.max(luma, 0.08), 0.92)) * 0.55;
    renderer.toneMappingExposure += (target - renderer.toneMappingExposure) * 0.08;
  }

  dispose() {
    this.env?.dispose();
    this.pmrem?.dispose();
    this.env = null;
    this.pmrem = null;
  }
}
