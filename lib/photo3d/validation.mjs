export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_MODEL_BYTES = 25 * 1024 * 1024;
export const SPACE_ID = "microsoft/TRELLIS.2";
export const SPACE_ORIGIN = "https://microsoft-trellis-2.hf.space";
export function validateImage(file) {
  if (!file || !["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error("Choose a PNG, JPG, or WebP photograph.");
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error("Choose a photograph smaller than 10 MB.");
}
export function imageMagicMatches(bytes, type) {
  const a = new Uint8Array(bytes);
  if (type === "image/png") return a[0]===137 && a[1]===80 && a[2]===78 && a[3]===71;
  if (type === "image/jpeg") return a[0]===255 && a[1]===216 && a[2]===255;
  if (type === "image/webp") return new TextDecoder().decode(a.slice(0,4))==="RIFF" && new TextDecoder().decode(a.slice(8,12))==="WEBP";
  return false;
}
export function validateGlb(buffer) {
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 28 || buffer.byteLength > MAX_MODEL_BYTES) throw new Error("Choose a complete GLB model smaller than 25 MB.");
  const view = new DataView(buffer);
  if (view.getUint32(0,true)!==0x46546c67 || view.getUint32(4,true)!==2 || view.getUint32(8,true)!==buffer.byteLength || view.getUint32(16,true)!==0x4e4f534a) throw new Error("This file is not a valid GLB 2.0 model.");
  const jsonLength=view.getUint32(12,true);
  if (jsonLength < 2 || 20+jsonLength > buffer.byteLength) throw new Error("The GLB model is incomplete.");
  let json;
  try { json=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,20,jsonLength))); }
  catch { throw new Error("The GLB model contains invalid scene data."); }
  if (!json.asset || json.asset.version!=="2.0" || !json.meshes?.length) throw new Error("The GLB has no usable 3D mesh.");
  const resources=[...(json.buffers||[]),...(json.images||[])];
  if (resources.some(r=>r.uri && !/^data:/i.test(r.uri))) throw new Error("Use a self-contained GLB with embedded textures and buffers.");
  const codecs=["KHR_draco_mesh_compression","EXT_meshopt_compression","KHR_texture_basisu"];
  if ([...(json.extensionsUsed||[]),...(json.extensionsRequired||[])].some(e=>codecs.includes(e))) throw new Error("Export an uncompressed GLB with embedded PNG, JPG, or WebP textures for offline viewing.");
  return json;
}
export function extractPreviewViews(data) {
  const html=Array.isArray(data) ? data.find(v=>typeof v==="string" && v.includes("view-m0-s")) : "";
  if (!html || html.length > 24*1024*1024) return [];
  const views=[];
  for (const tag of html.matchAll(/<img\b[^>]*>/gi)) {
    const id=tag[0].match(/\bid\s*=\s*["']view-m0-s(\d+)["']/i);
    const src=tag[0].match(/\bsrc\s*=\s*["'](data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+)["']/i);
    if (id && src && src[1].length<3*1024*1024) views.push({index:Number(id[1]),src:src[1]});
    if (views.length >= 64) break;
  }
  const unique=[...new Map(views.map(v=>[v.index,v])).values()].sort((a,b)=>a.index-b.index);
  return unique.slice(0,8).map((v,i)=>({label:"Generated view "+(i+1),src:v.src}));
}
export function modelFileUrl(result) {
  const values=Array.isArray(result?.data)?result.data:[];
  const url=values.map(v=>typeof v==="string"?v:v?.url).find(Boolean);
  if (!url) throw new Error("The generation service did not return a downloadable model.");
  const parsed=new URL(url);
  if (parsed.origin!==SPACE_ORIGIN || !/^\/(?:gradio_api\/)?file=/.test(parsed.pathname) || parsed.username || parsed.password) throw new Error("The generation service returned an unexpected download address.");
  return parsed.href;
}
export function friendlyGenerationError(error) {
  const message=String(error?.message || error || "");
  if (/quota|rate.?limit|too many|429/i.test(message)) return "The free GPU allowance is unavailable or exhausted. Your completed previews are kept. Try later, or import a GLB you already have. No paid fallback was used.";
  if (/abort|cancel/i.test(message)) return "Generation cancelled. Your selected photograph is still here.";
  if (/fetch|network|offline|connection/i.test(message)) return "The generation service could not be reached. Check your connection and try again.";
  return "The free generation service could not finish this step. Keep your previews, try a clearer photo later, or import a GLB.";
}
export function validatePublishedProductUrl(value, origin) {
  const url=new URL(value,origin);
  if (url.username || url.password || url.origin!==origin || url.search || url.hash || !/^\/b\/[a-z0-9-]+\/product\/[a-z0-9-]+\/?$/.test(url.pathname)) throw new Error("Use a published B Socio product URL from this site.");
  return url.href;
}
