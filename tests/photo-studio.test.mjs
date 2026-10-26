import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import {validateImage,imageMagicMatches,validateGlb,extractPreviewViews,modelFileUrl,friendlyGenerationError,validatePublishedProductUrl,MAX_IMAGE_BYTES,MAX_MODEL_BYTES} from "../lib/photo3d/validation.mjs";
function glb(extra={}){
  const json={asset:{version:"2.0"},meshes:[{primitives:[]}],...extra};
  const text=new TextEncoder().encode(JSON.stringify(json));const padded=Math.ceil(text.length/4)*4;
  const bytes=new Uint8Array(20+padded);bytes.fill(32,20);bytes.set(text,20);const v=new DataView(bytes.buffer);
  v.setUint32(0,0x46546c67,true);v.setUint32(4,2,true);v.setUint32(8,bytes.length,true);v.setUint32(12,padded,true);v.setUint32(16,0x4e4f534a,true);return bytes.buffer;
}
test("accepts supported photographs within size limit",()=>assert.doesNotThrow(()=>validateImage({type:"image/png",size:3000})));
test("rejects SVG, empty and oversized photos",()=>{
  for(const file of [{type:"image/svg+xml",size:100},{type:"image/png",size:0},{type:"image/jpeg",size:MAX_IMAGE_BYTES+1}])assert.throws(()=>validateImage(file));
});
test("detects a spoofed image MIME type",()=>{
  assert.equal(imageMagicMatches(new Uint8Array([137,80,78,71]).buffer,"image/png"),true);
  assert.equal(imageMagicMatches(new TextEncoder().encode("<svg>").buffer,"image/png"),false);
});
test("accepts self-contained GLB 2.0 and embedded image URIs",()=>assert.equal(validateGlb(glb({images:[{uri:"data:image/png;base64,AA=="}]})).asset.version,"2.0"));
test("rejects truncated, oversized and wrongly declared model bytes",()=>{
  assert.throws(()=>validateGlb(new ArrayBuffer(12)));
  assert.throws(()=>validateGlb(new ArrayBuffer(MAX_MODEL_BYTES+1)));
  const bytes=glb();new DataView(bytes).setUint32(8,10,true);assert.throws(()=>validateGlb(bytes));
});
test("rejects GLB models with external file dependencies",()=>{
  for(const uri of ["https://example.com/texture.png","../../private.bin","file:///C:/data.bin"])assert.throws(()=>validateGlb(glb({images:[{uri}]})),/self-contained/);
});
test("rejects codecs requiring an uncached decoder",()=>assert.throws(()=>validateGlb(glb({extensionsUsed:["KHR_draco_mesh_compression"]})),/uncompressed/));
test("rejects scenes without a mesh",()=>assert.throws(()=>validateGlb(glb({meshes:[]})),/mesh/));
test("existing embedded demo GLB remains compatible",async()=>{
  const bytes=await fs.readFile(new URL("../public/redesign/demo/signature-molten-lava-cake.glb",import.meta.url));
  assert.doesNotThrow(()=>validateGlb(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)));
});
test("extracts shaded colour views and ignores normal maps and provider HTML",()=>{
  const html='<script>alert(1)</script><img id="view-m3-s1" src="data:image/png;base64,AQ=="><img src="data:image/png;base64,AA==" id="view-m3-s0"><img id="view-m0-s0" src="data:image/png;base64,Ag=="><img id="view-m3-s2" src="https://evil.example/a.png">';
  const views=extractPreviewViews([html]);assert.equal(views.length,2);assert.equal(views[0].src,"data:image/png;base64,AA==");assert.ok(views.every(v=>!v.src.includes("<")));
});
test("bounds and deduplicates the generated view gallery",()=>{
  const html=Array.from({length:12},(_,i)=>'<img id="view-m3-s'+i+'" src="data:image/png;base64,AA==">').join("");
  assert.equal(extractPreviewViews([html+html]).length,8);
  assert.deepEqual(extractPreviewViews(["<h1>No views</h1>"]),[]);
});
test("allows only the official provider model download origin",()=>{
  assert.ok(modelFileUrl({data:[{url:"https://microsoft-trellis-2.hf.space/gradio_api/file=/tmp/model.glb"}]}).endsWith("model.glb"));
  assert.throws(()=>modelFileUrl({data:[{url:"https://evil.example/model.glb"}]}));
  assert.throws(()=>modelFileUrl({data:[{url:"https://microsoft-trellis-2.hf.space/other"}]}));
});
test("quota errors clearly retain completed previews and avoid paid fallback",()=>assert.match(friendlyGenerationError(new Error("ZeroGPU quota exceeded")),/previews are kept.*No paid fallback/s));
test("QR targets are restricted to published product routes",()=>{
  const origin="https://ar.bsocio.in";
  assert.equal(validatePublishedProductUrl("/b/cafe/product/cake",origin),origin+"/b/cafe/product/cake");
  for(const value of ["https://evil.example/b/cafe/product/cake","/ar/create","/business/products/new","/b/cafe/product/cake?token=secret","/b/cafe/product/cake#draft","https://user@ar.bsocio.in/b/cafe/product/cake"])assert.throws(()=>validatePublishedProductUrl(value,origin));
});
const swSource=await fs.readFile(new URL("../public/sw.js",import.meta.url),"utf8");
function worker(){
  const handlers={};const stores=new Map();let fetchResult;
  const key=value=>new URL(typeof value==="string"?value:value.url,"https://ar.bsocio.in").href;
  const caches={
    async open(name){if(!stores.has(name))stores.set(name,new Map());const values=stores.get(name);return{
      async match(request,options={}){const wanted=key(request);if(values.has(wanted))return values.get(wanted).clone();if(options.ignoreSearch){for(const [k,value]of values)if(k.split("?")[0]===wanted.split("?")[0])return value.clone();}},
      async put(request,response){values.set(key(request),response.clone());},
      async addAll(urls){for(const url of urls)values.set(key(url),new Response("core"));}
    };},
    async keys(){return[...stores.keys()];},async delete(name){return stores.delete(name);}
  };
  vm.runInNewContext(swSource,{self:{location:{origin:"https://ar.bsocio.in"},clients:{claim:async()=>{}},skipWaiting(){},addEventListener:(name,fn)=>{handlers[name]=fn;}},caches,URL,Response,fetch:async()=>{if(!fetchResult)throw new Error("offline");return fetchResult.clone();}});
  return{handlers,stores,caches,setFetch:response=>{fetchResult=response;},async request(url,{mode="navigate",method="GET",rsc=false}={}){
    let response;handlers.fetch({request:{url:new URL(url,"https://ar.bsocio.in").href,mode,method,headers:new Headers(rsc?{rsc:"1"}:{})},respondWith:value=>{response=value;}});return response?await response:undefined;
  }};
}
test("offline navigation restores the explicitly saved studio shell",async()=>{
  const w=worker();await(await w.caches.open("bsocio-photo-studio-v1")).put("/ar/create",new Response("saved-studio"));
  assert.equal(await(await w.request("/ar/create")).text(),"saved-studio");
});
test("service worker does not intercept accounts, APIs, RSC or external requests",async()=>{
  const w=worker();for(const url of ["/api/products","/business/products","/super-admin/dashboard","/staff/products","/team/chat","https://evil.example/x"])assert.equal(await w.request(url),undefined);
  assert.equal(await w.request("/ar/create",{rsc:true}),undefined);assert.equal(await w.request("/ar/create",{method:"POST"}),undefined);
});
test("server errors and private responses are never cached",async()=>{
  const w=worker();w.setFetch(new Response("error",{status:500}));assert.equal((await w.request("/ar/create")).status,500);
  w.setFetch(new Response("private",{headers:{"cache-control":"private, no-store"}}));await w.request("/ar/create");
  assert.equal([...w.stores.values()].reduce((n,m)=>n+m.size,0),0);
});
test("offline unknown public page falls back to the offline page",async()=>{
  const w=worker();await(await w.caches.open("bsocio-public-v3")).put("/offline",new Response("offline-help"));assert.equal(await(await w.request("/ar/food")).text(),"offline-help");
});
test("activation removes old owned caches and preserves offline drafts cache",async()=>{
  const w=worker();for(const name of ["ar-design-studio-v2","bsocio-public-v2","bsocio-photo-studio-v1","unrelated-cache"])await w.caches.open(name);
  let pending;w.handlers.activate({waitUntil:p=>{pending=p;}});await pending;
  assert.deepEqual(await w.caches.keys(),["bsocio-photo-studio-v1","unrelated-cache"]);
});


const {generateFromPhoto}=await import("../lib/photo3d/engine.mjs");
test("completed previews survive a free export quota rejection",async()=>{
  let preview,closed=0;const calls=[];
  const client={async predict(endpoint){calls.push(endpoint);if(endpoint==="/extract_glb")throw new Error("ZeroGPU quota exceeded");return{};},async *submit(){yield{type:"data",data:['<img id="view-m3-s0" src="data:image/png;base64,AA==">']};},close(){closed++;}};
  const result=await generateFromPhoto(new Blob(["test"]),{clientFactory:async()=>client,onPreview:views=>{preview=views;}});
  assert.equal(result.model,null);assert.equal(result.views.length,1);assert.equal(preview.length,1);assert.match(result.warning,/No paid fallback/);assert.deepEqual(calls,["/start_session","/extract_glb"]);assert.equal(closed,1);
});
test("cancelled generation never opens a provider session",async()=>{
  const controller=new AbortController();controller.abort();let connections=0;
  await assert.rejects(generateFromPhoto(new Blob(["test"]),{signal:controller.signal,clientFactory:async()=>{connections++;}}),/cancelled/i);assert.equal(connections,0);
});

const {handleGeneration}=await import("../lib/photo3d/generation-handler.mjs");
const {readGenerationResponse}=await import("../lib/photo3d/remote.mjs");
function generationRequest({consent="true",origin="https://ar.bsocio.in",photo=true}={}){
  const form=new FormData();form.append("consent",consent);
  if(photo)form.append("photo",new Blob([new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0,0,0,0,0])],{type:"image/png"}),"product.png");
  return new Request("https://ar.bsocio.in/api/photo-studio/generate",{method:"POST",headers:{Origin:origin},body:form});
}
const allowAttempt=()=>({ok:true});
test("generation bridge rejects cross-origin requests before calling a provider",async()=>{
  let calls=0;const response=await handleGeneration(generationRequest({origin:"https://evil.example"}),{limit:allowAttempt,generator:async()=>{calls++;}});
  assert.equal(response.status,403);assert.equal(calls,0);
});
test("generation bridge requires explicit processing consent and a photo",async()=>{
  assert.equal((await handleGeneration(generationRequest({consent:"false"}),{limit:allowAttempt})).status,400);
  assert.equal((await handleGeneration(generationRequest({photo:false}),{limit:allowAttempt})).status,400);
});
test("generation bridge rejects overlarge bodies before reading them",async()=>{
  const request=new Request("https://ar.bsocio.in/api/photo-studio/generate",{method:"POST",headers:{Origin:"https://ar.bsocio.in","Content-Length":String(5*1024*1024)},body:"x"});
  assert.equal((await handleGeneration(request,{limit:allowAttempt})).status,413);
});
test("generation bridge stops attempts when its free limit is reached",async()=>{
  const response=await handleGeneration(generationRequest(),{limit:()=>({ok:false,retryAfterSec:3600})});
  assert.equal(response.status,429);assert.equal(response.headers.get("retry-after"),"3600");
});
test("browser client receives streamed previews even when no GLB can be exported",async()=>{
  const preview=[{label:"view",src:"data:image/png;base64,AA=="}];
  const response=await handleGeneration(generationRequest(),{limit:allowAttempt,generator:async(file,callbacks)=>{callbacks.onStage("Generating");callbacks.onPreview(preview);return{views:preview,model:null,warning:"Free GPU quota unavailable"};}});
  const stages=[];let seen;
  const result=await readGenerationResponse(response,{onStage:value=>stages.push(value),onPreview:views=>{seen=views;}});
  assert.equal(result.model,null);assert.equal(result.views.length,1);assert.equal(seen.length,1);assert.match(result.warning,/quota/);assert.ok(stages.includes("Generating"));
});
test("streamed GLB is validated and restored as a local model Blob",async()=>{
  const bytes=glb();
  const response=await handleGeneration(generationRequest(),{limit:allowAttempt,generator:async()=>({model:new Blob([bytes]),views:[],warning:""})});
  const result=await readGenerationResponse(response);
  assert.equal(result.model.size,bytes.byteLength);assert.doesNotThrow(()=>validateGlb(bytes));
});
test("truncated generation streams cannot report success",async()=>{
  const response=new Response('{"type":"stage","message":"Generating"}\n');
  await assert.rejects(readGenerationResponse(response),/before generation finished/);
});

test("generation consent guard respects the trusted reverse proxy host",async()=>{
 const form=new FormData();form.append("consent","false");
 const request=new Request("http://localhost:3000/api/photo-studio/generate",{method:"POST",headers:{Origin:"https://ar.bsocio.in","x-forwarded-host":"ar.bsocio.in","x-forwarded-proto":"https"},body:form});
 assert.equal((await handleGeneration(request,{limit:allowAttempt})).status,400);
});

test("public demo assets are cached and reopened offline",async()=>{
  const w=worker();w.setFetch(new Response("demo-model",{headers:{"cache-control":"public, max-age=3600"}}));
  assert.equal(await(await w.request("/photo-studio/demo/avocado.glb",{mode:"cors"})).text(),"demo-model");
  w.setFetch(null);
  assert.equal(await(await w.request("/photo-studio/demo/avocado.glb",{mode:"cors"})).text(),"demo-model");
  assert.equal(await w.request("/photo-studio/private.glb",{mode:"cors"}),undefined);
});
