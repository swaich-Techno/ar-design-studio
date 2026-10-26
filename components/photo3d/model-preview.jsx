"use client";
import {useEffect,useRef,useState} from "react";
export function PhotoModelPreview({src,name,onReady}) {
  const ref=useRef(null);
  const [message,setMessage]=useState("Loading your 3D model…");
  const [available,setAvailable]=useState(false);
  const callback=useRef(onReady);callback.current=onReady;
  useEffect(()=>{
    let mounted=true;const viewer=ref.current;
    setAvailable(false);setMessage("Loading your 3D model…");
    const loaded=()=>{if(!mounted)return;setMessage("");setAvailable(true);callback.current?.();};
    const failed=()=>{if(mounted){setAvailable(false);setMessage("This model could not be displayed. Download it or try a different GLB.");}};
    const ar=event=>{if(event.detail?.status==="failed"&&mounted)setMessage("Camera AR is unavailable here. You can still rotate the 3D model.");};
    viewer.addEventListener("load",loaded);viewer.addEventListener("error",failed);viewer.addEventListener("ar-status",ar);
    import("@google/model-viewer").catch(failed);
    return()=>{mounted=false;viewer.removeEventListener("load",loaded);viewer.removeEventListener("error",failed);viewer.removeEventListener("ar-status",ar);};
  },[src]);
  return <div>
    <model-viewer ref={ref} src={src} alt={name+" — AI or imported 3D preview"} camera-controls ar ar-modes="webxr quick-look" ar-scale="auto" shadow-intensity="1" exposure="1" environment-image="neutral" camera-orbit="0deg 70deg 105%" style={{width:"100%",height:"min(58vh,460px)",background:"#e9e7df"}} touch-action="pan-y">
      <button type="button" slot="ar-button" style={{position:"absolute",bottom:16,left:16,padding:"12px 18px",background:"#102f27",color:"white",borderRadius:24,border:0,fontWeight:700}}>See in my space</button>
    </model-viewer>
    <p role="status" style={{padding:"12px 16px",fontSize:13,color:"#b7bcb6"}}>{message || "Drag to rotate. Scroll or pinch to zoom. AR appears on supported phones."}</p>
    {available?<p style={{padding:"0 16px 12px",fontSize:12,color:"#b7bcb6"}}>Visual preview. Physical size and hidden surfaces are unverified.</p>:null}
  </div>;
}
