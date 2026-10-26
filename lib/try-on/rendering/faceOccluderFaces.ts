/**
 * Simplified face occluder: fan from the nose to the face oval.
 * Ear vertices are kept but pushed back in OcclusionManager so earrings stay in front.
 */
export const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148,
  176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
] as const;

export const EAR_INDICES = new Set([234, 454, 132, 361, 93, 323, 177, 401]);

const NOSE = 1;
const FOREHEAD = 10;
const CHIN = 152;
const LEFT_CHEEK = 50;
const RIGHT_CHEEK = 280;

export function buildFaceOccluderIndices() {
  const indices: number[] = [];
  for (let i = 0; i < FACE_OVAL.length; i += 1) {
    const a = FACE_OVAL[i];
    const b = FACE_OVAL[(i + 1) % FACE_OVAL.length];
    indices.push(NOSE, a, b);
  }
  indices.push(NOSE, LEFT_CHEEK, CHIN);
  indices.push(NOSE, RIGHT_CHEEK, CHIN);
  indices.push(NOSE, FOREHEAD, LEFT_CHEEK);
  indices.push(NOSE, FOREHEAD, RIGHT_CHEEK);
  return indices;
}
