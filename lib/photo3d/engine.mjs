import {SPACE_ORIGIN,MAX_MODEL_BYTES,extractPreviewViews,modelFileUrl,validateGlb,friendlyGenerationError} from "./validation.mjs";
export async function generateFromPhoto(file,{onStage=()=>{},onPreview=()=>{},signal,clientFactory}={}) {
  let client, job;
  function cancelled() { if (signal?.aborted) throw new DOMException("Cancelled","AbortError"); }
  const abort=()=>{ job?.cancel(); client?.close(); };
  signal?.addEventListener("abort",abort,{once:true});
  try {
    cancelled();
    onStage("Connecting to the free generation service…");
    let handleFile=file=>file;
    if(clientFactory) client=await clientFactory();
    else {
      const {Client,handle_file}=await import("@gradio/client");
      handleFile=handle_file;
      client=await Client.connect(SPACE_ORIGIN,{events:["status","data"]});
    }
    cancelled();
    await client.predict("/start_session",{});
    cancelled();
    onStage("Generating the object and its different views. Keep this tab open…");
    job=client.submit("/image_to_3d",{
      image:handleFile(file),seed:Math.floor(Math.random()*2147483647),resolution:"512",
      ss_guidance_strength:7.5,ss_guidance_rescale:0.7,ss_sampling_steps:12,ss_rescale_t:5,
      shape_slat_guidance_strength:7.5,shape_slat_guidance_rescale:0.5,shape_slat_sampling_steps:12,shape_slat_rescale_t:3,
      tex_slat_guidance_strength:1,tex_slat_guidance_rescale:0,tex_slat_sampling_steps:12,tex_slat_rescale_t:3
    });
    let views=[];
    for await(const event of job) {
      cancelled();
      if(event.type==="status") {
        if(event.stage==="error") throw new Error(event.message || "Generation failed");
        if(event.stage==="pending") onStage("Waiting for a free GPU. Keep this tab open…");
        if(event.stage==="generating") onStage("The GPU is generating your object…");
      }
      if(event.type==="data") {views=extractPreviewViews(event.data);if(views.length)onPreview(views);}
    }
    if(!views.length) throw new Error("The service returned no angle previews.");
    cancelled();
    onStage("Views are ready. Exporting the interactive 3D model…");
    try {
      const output=await client.predict("/extract_glb",{decimation_target:100000,texture_size:1024});
      cancelled();
      const response=await fetch(modelFileUrl(output),{signal,credentials:"omit"});
      if(!response.ok || Number(response.headers.get("content-length")||0)>MAX_MODEL_BYTES) throw new Error("Model download failed");
      const reader=response.body.getReader();const chunks=[];let size=0;
      while(true){const next=await reader.read();if(next.done)break;size+=next.value.length;if(size>MAX_MODEL_BYTES){await reader.cancel();throw new Error("Model is too large");}chunks.push(next.value);}
      const blob=new Blob(chunks,{type:"model/gltf-binary"});validateGlb(await blob.arrayBuffer());
      return {views,model:blob,warning:"",source:"ai"};
    } catch(error) {
      cancelled();
      return {views,model:null,warning:friendlyGenerationError(error),source:"ai"};
    }
  } catch(error) {
    console.warn("[photo-studio] Generation failed:", String(error?.message || "Unknown provider failure"));
    if(signal?.aborted) throw new Error("Generation cancelled. Your photograph is still here.");
    throw new Error(friendlyGenerationError(error));
  } finally { signal?.removeEventListener("abort",abort);client?.close(); }
}
