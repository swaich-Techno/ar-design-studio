import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {loadStudioDemo,STUDIO_DEMO} from "../lib/photo3d/demo.mjs";
import {validateGlb} from "../lib/photo3d/validation.mjs";
const assetUrl=path=>new URL("../public"+path,import.meta.url);
async function localFetch(url){
  assert.ok([STUDIO_DEMO.photo,STUDIO_DEMO.model].includes(url),"only fixed local demo assets are requested");
  return new Response(await fs.readFile(assetUrl(url)));
}
test("demo loads its matching image and model without an AI call",async()=>{
  const sample=await loadStudioDemo({fetcher:localFetch});
  assert.equal(sample.source,"demo");assert.equal(sample.name,"Avocado demo");
  assert.ok(sample.photo.size>0);assert.ok(sample.model.size>0);
  assert.equal(sample.photo.type,"image/jpeg");
  assert.deepEqual(sample.views,[]);
  assert.ok(sample.model.size<1024*1024,"demo stays under 1 MB");
  const scene=validateGlb(await sample.model.arrayBuffer());
  const position=scene.accessors[scene.meshes[0].primitives[0].attributes.POSITION];
  assert.ok(position.count>100,"demo has actual surface geometry");
  for(let axis=0;axis<3;axis++)assert.ok(position.max[axis]-position.min[axis]>.01,"mesh has volume on every axis");
});
test("demo failures never substitute a model or claim success",async()=>{
  await assert.rejects(()=>loadStudioDemo({fetcher:async()=>new Response("",{status:404})}),/Reconnect/);
  await assert.rejects(()=>loadStudioDemo({fetcher:async url=>url===STUDIO_DEMO.photo?localFetch(url):new Response("invalid GLB")}),/GLB/);
});
test("cancelled demo loading cannot return a completed sample",async()=>{
  const controller=new AbortController();controller.abort();
  await assert.rejects(()=>loadStudioDemo({signal:controller.signal,fetcher:localFetch}),{name:"AbortError"});
});
