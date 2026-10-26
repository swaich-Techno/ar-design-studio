import {generateFromPhoto} from "./engine.mjs";
import {validateImage,imageMagicMatches} from "./validation.mjs";
import {clientIp,rateLimit} from "../rateLimit.js";
const MAX_BODY=4*1024*1024;
const MAX_PHOTO=3*1024*1024;
function reject(message,status){return Response.json({error:message},{status,headers:{"Cache-Control":"no-store"}});}
async function boundedBody(request){
  if(Number(request.headers.get("content-length")||0)>MAX_BODY)throw new Error("BODY_TOO_LARGE");
  const reader=request.body?.getReader();if(!reader)return new Uint8Array();
  const chunks=[];let size=0;
  while(true){const{done,value}=await reader.read();if(done)break;size+=value.length;if(size>MAX_BODY){await reader.cancel();throw new Error("BODY_TOO_LARGE");}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return bytes;
}
export async function handleGeneration(request,{generator=generateFromPhoto,limit=rateLimit}={}){
  const requestUrl=new URL(request.url);
  const host=(request.headers.get("x-forwarded-host")||request.headers.get("host")||requestUrl.host).split(",")[0].trim();
  const scheme=(request.headers.get("x-forwarded-proto")||requestUrl.protocol.slice(0,-1)).split(",")[0].trim();
  if(!/^[a-z0-9.:-]+$/i.test(host) || !["http","https"].includes(scheme) || request.headers.get("origin")!==scheme+"://"+host)return reject("Open Photo Studio on this site before generating.",403);
  const allowance=limit("photo-studio:"+clientIp(request),{limit:3,windowMs:60*60*1000});
  if(!allowance.ok)return Response.json({error:"This connection has reached the studio's free attempt limit. Try again later."},{status:429,headers:{"Retry-After":String(allowance.retryAfterSec||3600),"Cache-Control":"no-store"}});
  let file;
  try{
    const bytes=await boundedBody(request);
    const parsed=new Request(request.url,{method:"POST",headers:{"content-type":request.headers.get("content-type")||""},body:bytes});
    const form=await parsed.formData();
    if(form.get("consent")!=="true")return reject("Confirm external photo processing before generating.",400);
    file=form.get("photo");validateImage(file);
    if(file.size>MAX_PHOTO)return reject("Prepare a photo smaller than 3 MB for free generation.",413);
    if(!imageMagicMatches(await file.slice(0,16).arrayBuffer(),file.type))return reject("The uploaded photo does not match its file type.",400);
  }catch(error){return reject(error.message==="BODY_TOO_LARGE"?"The upload is too large. Choose a smaller photo.":"Choose a valid PNG, JPG, or WebP photo.",error.message==="BODY_TOO_LARGE"?413:400);}
  const abort=new AbortController();const onAbort=()=>abort.abort();request.signal.addEventListener("abort",onAbort,{once:true});
  const encoder=new TextEncoder();let closed=false;
  const stream=new ReadableStream({
    start(controller){
      const emit=value=>{if(!closed&&!abort.signal.aborted)controller.enqueue(encoder.encode(JSON.stringify(value)+"\n"));};
      (async()=>{
        try{
          emit({type:"stage",message:"Connecting to the free generation service…"});
          const result=await generator(file,{signal:abort.signal,onStage:message=>emit({type:"stage",message}),onPreview:views=>emit({type:"views",views})});
          if(result.model)emit({type:"model",base64:Buffer.from(await result.model.arrayBuffer()).toString("base64")});
          emit({type:"done",warning:result.warning||"",source:"ai"});
        }catch(error){
          if(!abort.signal.aborted){console.error("[photo-studio] Generation request failed:",String(error?.message||"unknown"));emit({type:"error",message:error.message||"Generation could not finish."});}
        }finally{
          request.signal.removeEventListener("abort",onAbort);
          if(!closed){closed=true;try{controller.close();}catch{/* Client disconnected. */}}
        }
      })();
    },
    cancel(){closed=true;abort.abort();}
  });
  return new Response(stream,{headers:{"Content-Type":"application/x-ndjson; charset=utf-8","Cache-Control":"no-store, no-transform","X-Accel-Buffering":"no"}});
}
