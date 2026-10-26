const DB_NAME="bsocio-photo-studio";
const STORE="drafts";
async function database() {
  if(typeof indexedDB==="undefined") throw new Error("This browser cannot save local drafts.");
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,1);
    request.onupgradeneeded=()=>request.result.createObjectStore(STORE,{keyPath:"id"});
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(new Error("Local storage is unavailable. Use a normal browser window."));
  });
}
async function transaction(mode,action) {
  const db=await database();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,mode);let value;
    const request=action(tx.objectStore(STORE));
    if(request)request.onsuccess=()=>{value=request.result;};
    tx.oncomplete=()=>{db.close();resolve(value);};
    tx.onerror=tx.onabort=()=>{db.close();reject(new Error("The draft could not be saved. Free some device storage and try again."));};
  });
}
export async function saveDraft(draft) {
  if(!draft?.id || !(draft.photo instanceof Blob) || (!draft.model && !draft.views?.length)) throw new Error("Generate previews or import a model before saving.");
  await transaction("readwrite",store=>store.put({...draft,savedAt:Date.now()}));
  const restored=await getDraft(draft.id);
  if(!restored || restored.photo.size!==draft.photo.size || (draft.model && restored.model?.size!==draft.model.size)) throw new Error("Draft verification failed. Try saving again.");
  return restored;
}
export function getDraft(id){return transaction("readonly",store=>store.get(id));}
export async function listDrafts(){const rows=await transaction("readonly",store=>store.getAll());return rows.sort((a,b)=>b.savedAt-a.savedAt);}
export function deleteDraft(id){return transaction("readwrite",store=>store.delete(id));}
export async function cacheStudioShell() {
  if(!("serviceWorker" in navigator) || !("caches" in window)) throw new Error("Offline saving needs a browser with service worker support.");
  await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  const urls=new Set(["/ar/create"]);
  for(const item of [...performance.getEntriesByType("resource").map(r=>r.name),...Array.from(document.scripts,s=>s.src)]) {
    if(!item)continue;const url=new URL(item,location.href);
    if(url.origin===location.origin && url.pathname.startsWith("/_next/static/")) urls.add(url.href);
  }
  if(urls.size<2) throw new Error("The viewer is still loading. Wait a moment, then save again.");
  const cache=await caches.open("bsocio-photo-studio-v1");
  await cache.addAll([...urls]);
  for(const url of urls)if(!(await cache.match(url)))throw new Error("Some viewer files were not saved. Try again while connected.");
  await navigator.storage?.persist?.().catch(()=>false);
}
