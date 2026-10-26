import {validateGlb,MAX_MODEL_BYTES} from "./validation.mjs";
export async function readGenerationResponse(response,{onStage=()=>{},onPreview=()=>{}}={}){
  if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.error||"The generation service could not be reached.");}
  const reader=response.body.getReader();const decoder=new TextDecoder();let pending="",views=[],model=null,warning="",completed=false;
  function processLine(line){
    if(!line.trim())return;
    const event=JSON.parse(line);
    if(event.type==="stage")onStage(String(event.message||"Processing…"));
    if(event.type==="views"){
      views=(event.views||[]).slice(0,8).filter(v=>typeof v.src==="string"&&/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v.src)).map((v,i)=>({label:"Generated view "+(i+1),src:v.src}));
      if(views.length)onPreview(views);
    }
    if(event.type==="model"){
      if(typeof event.base64!=="string" || event.base64.length>Math.ceil(MAX_MODEL_BYTES/3)*4)throw new Error("The generated model exceeds the download limit.");
      const bytes=Uint8Array.from(atob(event.base64),char=>char.charCodeAt(0));validateGlb(bytes.buffer);model=new Blob([bytes],{type:"model/gltf-binary"});
    }
    if(event.type==="error")throw new Error(String(event.message||"Generation could not finish."));
    if(event.type==="done"){completed=true;warning=String(event.warning||"");}
  }
  try{
    while(true){const next=await reader.read();if(next.done)break;pending+=decoder.decode(next.value,{stream:true});if(pending.length>40*1024*1024)throw new Error("The generation response is too large.");let end;while((end=pending.indexOf("\n"))>=0){processLine(pending.slice(0,end));pending=pending.slice(end+1);}}
    pending+=decoder.decode();if(pending.trim())processLine(pending);
    if(!completed)throw new Error("The connection ended before generation finished. Any completed views remain on this page.");
    return{views,model,warning,source:"ai"};
  }finally{await reader.cancel().catch(()=>{});}
}
export async function generateFromPhoto(file,{onStage,onPreview,signal}={}){
  const form=new FormData();form.append("photo",file,"product.png");form.append("consent","true");
  const response=await fetch("/api/photo-studio/generate",{method:"POST",body:form,signal});
  return readGenerationResponse(response,{onStage,onPreview});
}
