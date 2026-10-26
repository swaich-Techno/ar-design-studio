const PUBLIC_CACHE = "bsocio-public-v3";
const STUDIO_CACHE = "bsocio-photo-studio-v1";
const OFFLINE_URL = "/offline";
const CORE = [OFFLINE_URL,"/manifest.json","/icons/icon-192.png","/icons/icon-512.png"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(PUBLIC_CACHE).then(cache=>cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(name=>name.startsWith("ar-design-studio-") || (name.startsWith("bsocio-public-") && name!==PUBLIC_CACHE)).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch",event=>{
  const request=event.request;const url=new URL(request.url);
  if(request.method!=="GET" || url.origin!==self.location.origin) return;
  if(/^\/(?:api|business|super-admin|staff|team)(?:\/|$)/.test(url.pathname) || request.headers.get("rsc")==="1") return;
  const navigation=request.mode==="navigate";
  const publicPage=url.pathname==="/" || url.pathname===OFFLINE_URL || /^\/ar(?:\/|$)/.test(url.pathname);
  const asset=/^\/(?:_next\/static|icons|brand|redesign|photo-studio\/demo)\//.test(url.pathname) || url.pathname==="/manifest.json";
  if(!(navigation&&publicPage) && !asset) return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(request);
      const control=response.headers.get("cache-control")||"";
      if(response.ok && response.type!=="opaque" && !/private|no-store/i.test(control)){
        const cache=await caches.open(PUBLIC_CACHE);
        await cache.put(request,response.clone()).catch(()=>{});
      }
      return response;
    }catch{
      const studio=await caches.open(STUDIO_CACHE);
      const saved=await studio.match(request,{ignoreSearch:navigation&&url.pathname==="/ar/create"});
      if(saved)return saved;
      const cache=await caches.open(PUBLIC_CACHE);
      const cached=await cache.match(request);
      if(cached)return cached;
      if(navigation)return (await cache.match(OFFLINE_URL)) || Response.error();
      return Response.error();
    }
  })());
});
