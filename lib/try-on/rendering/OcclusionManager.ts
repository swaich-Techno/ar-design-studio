import * as THREE from "three";
import type { FaceFrame, OverlayAnchor, PoseFrame, ViewportMap } from "../types";
import { FACE_WIDTH_MM, LM, getLm } from "../utils/transforms";
import { depthFromRealWidth, landmarkToWorld, MM, spanCanvasFrac } from "../utils/cameraSpace";
import { buildFaceOccluderIndices } from "./faceOccluderFaces";

const VERTEX_COUNT = 478;
const _up = new THREE.Vector3(0, 1, 0);

export class OcclusionManager {
  mesh: THREE.Mesh;
  head: THREE.Mesh;
  neck: THREE.Mesh;
  group = new THREE.Group();
  private positions = new Float32Array(VERTEX_COUNT * 3);
  private geometry: THREE.BufferGeometry;

  constructor() {
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setIndex(buildFaceOccluderIndices());
    const material = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(this.geometry, material);
    this.mesh.renderOrder = 0;
    this.mesh.frustumCulled = false;

    this.head = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), material.clone());
    this.head.renderOrder = 0;
    this.head.visible = false;
    this.head.frustumCulled = false;

    this.neck = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.15, 1, 12), material.clone());
    this.neck.renderOrder = 0;
    this.neck.visible = false;
    this.neck.frustumCulled = false;

    this.group.add(this.mesh, this.head, this.neck);
    this.group.renderOrder = 0;
  }

  update(
    face: FaceFrame | null,
    pose: PoseFrame | null,
    viewport: ViewportMap,
    neckPoint: OverlayAnchor["point"] | null,
  ) {
    const vfov = viewport.vfovDeg;
    if (!face || face.landmarks.length < 200) {
      this.mesh.visible = false;
      this.head.visible = false;
      if (!pose) this.neck.visible = false;
      return;
    }
    const faceFrac = spanCanvasFrac(getLm(face.landmarks, LM.imageLeftEar), getLm(face.landmarks, LM.imageRightEar), viewport);
    const depth = depthFromRealWidth(faceFrac, FACE_WIDTH_MM * MM, viewport, vfov);
    this.mesh.visible = true;
    const count = Math.min(face.landmarks.length, VERTEX_COUNT);
    for (let i = 0; i < count; i += 1) {
      const p = landmarkToWorld(face.landmarks[i], viewport, depth, vfov, 1.05);
      this.positions[i * 3] = p.x;
      this.positions[i * 3 + 1] = p.y;
      this.positions[i * 3 + 2] = p.z;
    }
    const attr = this.geometry.getAttribute("position") as THREE.BufferAttribute;
    attr.needsUpdate = true;
    this.geometry.computeBoundingSphere();

    const nose = landmarkToWorld(getLm(face.landmarks, LM.noseTip), viewport, depth, vfov);
    const chin = landmarkToWorld(getLm(face.landmarks, LM.chin), viewport, depth, vfov);
    const forehead = landmarkToWorld(getLm(face.landmarks, LM.forehead), viewport, depth, vfov);
    const left = landmarkToWorld(getLm(face.landmarks, LM.imageLeftEar), viewport, depth, vfov);
    const right = landmarkToWorld(getLm(face.landmarks, LM.imageRightEar), viewport, depth, vfov);
    const faceW = Math.hypot(right.x - left.x, right.y - left.y, right.z - left.z) || 0.14;
    const faceH = Math.hypot(chin.x - forehead.x, chin.y - forehead.y, chin.z - forehead.z) || 0.18;
    this.head.visible = true;
    this.head.position.set(
      (left.x + right.x) * 0.5,
      (forehead.y + chin.y) * 0.5,
      (nose.z + chin.z) * 0.5 - faceW * 0.12,
    );
    this.head.scale.set(faceW * 0.42, faceH * 0.48, faceW * 0.4);

    const chest = neckPoint;
    this.neck.visible = Boolean(chest);
    if (chest) {
      this.neck.position.set((chin.x + chest.x) * 0.5, (chin.y + chest.y) * 0.5, (chin.z + chest.z) * 0.5);
      const dy = chest.y - chin.y;
      const dx = chest.x - chin.x;
      const dz = chest.z - chin.z;
      const len = Math.hypot(dx, dy, dz) || 0.08;
      this.neck.scale.set(faceW * 0.22, len, faceW * 0.22);
      this.neck.quaternion.setFromUnitVectors(_up, new THREE.Vector3(dx, dy, dz).normalize());
    }
  }

  dispose() {
    this.geometry.dispose();
    this.head.geometry.dispose();
    this.neck.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    (this.head.material as THREE.Material).dispose();
    (this.neck.material as THREE.Material).dispose();
  }
}
