"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {Upload,Box,Download,ArrowRight,Rotate3D,WifiOff,QrCode,Check,LoaderCircle} from "lucide-react";
import {PhotoModelPreview} from "./model-preview";
import {validateImage,imageMagicMatches,validateGlb,friendlyGenerationError,validatePublishedProductUrl} from "@/lib/photo3d/validation.mjs";
import {saveDraft,listDrafts,deleteDraft,cacheStudioShell} from "@/lib/photo3d/storage.mjs";
import styles from "./studio.module.css";

async function preparePhoto(file) {
  validateImage(file);
  if(!imageMagicMatches(await file.slice(0,16).arrayBuffer(),file.type))throw new Error("The photograph does not match its file type.");
  const image=await createImageBitmap(file);
  try{
    if(image.width<96 || image.height<96 || image.width*image.height>24000000)throw new Error("Use a clear photograph at least 96 pixels wide and under 24 megapixels.");
    const factor=Math.min(1,1024/Math.max(image.width,image.height));
    const canvas=document.createElement("canvas");canvas.width=Math.round(image.width*factor);canvas.height=Math.round(image.height*factor);
    canvas.getContext("2d").drawImage(image,0,0,canvas.width,canvas.height);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/png"));
    if(!blob || blob.size>10*1024*1024)throw new Error("This photo is too large after preparation. Choose a smaller one.");
    return new File([blob],"product.png",{type:"image/png"});
  }finally{image.close();}
}
function download(blob,name) {
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function useBlobUrl(blob){const[url,setUrl]=useState("");useEffect(()=>{if(!blob){setUrl("");return;}const next=URL.createObjectURL(blob);setUrl(next);return()=>URL.revokeObjectURL(next);},[blob]);return url;}
function ProductQR(){
  const[value,setValue]=useState("");const[qr,setQr]=useState("");const[error,setError]=useState("");const[busy,setBusy]=useState(false);
  async function create(event){event.preventDefault();setBusy(true);setError("");setQr("");try{
    const target=validatePublishedProductUrl(value,location.origin);
    const parts=new URL(target).pathname.split("/").filter(Boolean);
    const res=await fetch("/api/public/product/"+parts[1]+"/"+parts[3],{cache:"no-store"});
    const data=await res.json().catch(()=>({}));
    if(!res.ok || !data.product?.modelGlbUrl)throw new Error("This product is not publicly available with a GLB yet. Publish it and complete approval first.");
    const QRCode=(await import("qrcode")).default;
    setQr(await QRCode.toDataURL(target,{width:360,margin:4,errorCorrectionLevel:"M"}));
  }catch(err){setError(err.message);}finally{setBusy(false);}}
  return <section className={styles.card}>
    <p className={styles.eyebrow}><QrCode size={15}/>Share a published product</p>
    <h2>Your product, one QR.</h2>
    <p className={styles.muted}>Publish your model through the product dashboard, then paste its public product link. A local draft is visible only on this browser.</p>
    <form onSubmit={create} className={styles.qrForm}>
      <label htmlFor="published-product">Published product URL</label>
      <input id="published-product" type="url" value={value} onChange={e=>{setValue(e.target.value);setQr("");}} placeholder="https://ar.bsocio.in/b/your-shop/product/your-product" required/>
      <button className={styles.secondary} disabled={busy}>{busy?"Checking product…":"Verify and create QR"}</button>
    </form>
    {error?<p role="alert" className={styles.error}>{error}</p>:null}
    {qr?<div className={styles.qrResult}><img src={qr} alt="QR code for the verified published product" width="220" height="220"/><a href={qr} download="b-socio-product-qr.png" className={styles.secondary}>Download QR</a></div>:null}
  </section>;
}
export function PhotoStudio(){
  const[name,setName]=useState("");const[photo,setPhoto]=useState(null);const[model,setModel]=useState(null);const[views,setViews]=useState([]);
  const[source,setSource]=useState("ai");const[consent,setConsent]=useState(false);const[busy,setBusy]=useState(false);const[saving,setSaving]=useState(false);
  const[stage,setStage]=useState("");const[error,setError]=useState("");const[notice,setNotice]=useState("");const[warning,setWarning]=useState("");
  const[saved,setSaved]=useState([]);const[online,setOnline]=useState(true);const[id,setId]=useState("");const[viewerReady,setViewerReady]=useState(false);
  const run=useRef(0);const controller=useRef(null);
  const photoUrl=useBlobUrl(photo);const modelUrl=useBlobUrl(model);
  async function refreshSaved(){try{setSaved(await listDrafts());}catch{/* In-memory generation still works if browser storage is unavailable. */}}
  useEffect(()=>{setOnline(navigator.onLine);refreshSaved();const update=()=>setOnline(navigator.onLine);window.addEventListener("online",update);window.addEventListener("offline",update);return()=>{window.removeEventListener("online",update);window.removeEventListener("offline",update);controller.current?.abort();};},[]);
  async function choosePhoto(file){
    if(!file)return;
    setError("");setNotice("");
    try{const prepared=await preparePhoto(file);run.current++;controller.current?.abort();setBusy(false);setPhoto(prepared);setModel(null);setViewerReady(false);setViews([]);setWarning("");setStage("");setSource("ai");setId(crypto.randomUUID());setName(file.name.replace(/\.[^.]+$/,"").slice(0,100));}
    catch(err){setError(err.message);}
  }
  async function generate(){
    if(!photo || !consent || busy)return;
    if(!navigator.onLine){setError("Generating a new model needs internet. Your saved previews can still be opened below.");return;}
    const token=++run.current;const abort=new AbortController();controller.current=abort;setBusy(true);setError("");setWarning("");setNotice("");setModel(null);setViews([]);setViewerReady(false);
    try{
      const {generateFromPhoto}=await import("@/lib/photo3d/engine.mjs");
      const result=await generateFromPhoto(photo,{signal:abort.signal,onStage:text=>{if(run.current===token)setStage(text);},onPreview:items=>{if(run.current===token)setViews(items);}});
      if(run.current!==token)return;
      setViews(result.views);setModel(result.model);setWarning(result.warning);setSource("ai");
      setStage(result.model?"Your 3D model and angle previews are ready.":"Angle previews are ready. A 3D model has not been exported.");
    }catch(err){if(run.current===token){setError(err.message || friendlyGenerationError(err));setStage("Generation did not finish.");}}
    finally{if(run.current===token)setBusy(false);}
  }
  function cancel(){run.current++;controller.current?.abort();setBusy(false);setStage("Cancelled. Any completed previews remain available.");}
  async function importModel(file){
    if(!file)return;
    setError("");setNotice("");
    try{if(!photo)throw new Error("Choose a product photograph first.");validateGlb(await file.arrayBuffer());setModel(new Blob([file],{type:"model/gltf-binary"}));setSource("imported");setViewerReady(false);setWarning("");setStage("Imported 3D model. This file was not generated from your photo.");}
    catch(err){setError(err.message);}
  }
  function draft(){return{id:id||crypto.randomUUID(),name:name.trim()||"Untitled product",photo,model,views,source};}
  async function save(offline=false){
    setSaving(true);setError("");setNotice("");
    try{
      if(offline)await cacheStudioShell();
      await saveDraft(draft());await refreshSaved();
      setNotice(offline?"Saved on this browser with the viewer files. Reopen this page to use your saved preview offline.":"Draft saved on this browser.");
    }catch(err){setError(err.message);}
    finally{setSaving(false);}
  }
  async function openDraft(item){run.current++;controller.current?.abort();setBusy(false);setId(item.id);setName(item.name);setPhoto(item.photo);setModel(item.model||null);setViewerReady(false);setViews(item.views||[]);setSource(item.source||"imported");setWarning("");setError("");setNotice("Opened your saved draft.");setStage(item.model?"Saved 3D model loaded.":"Saved angle previews loaded. No 3D model is attached.");}
  async function removeDraft(item){try{await deleteDraft(item.id);await refreshSaved();setNotice("Saved draft removed from this browser.");}catch(err){setError(err.message);}}
  async function openDashboard(){setSaving(true);setError("");try{const d=draft();await saveDraft(d);location.assign("/business/products/new?photoDraft="+encodeURIComponent(d.id));}catch(err){setError(err.message);}finally{setSaving(false);}}
  const ready=Boolean(model||views.length);
  return <main id="main-content" className={styles.studio}>
    <header className={styles.intro}>
      <p className={styles.eyebrow}>B SOCIO PHOTO STUDIO <span>Experimental</span></p>
      <h1>One photo.<br/><em>More dimensions.</em></h1>
      <p>Upload a product photo. Generate different views, export a 3D preview, and explore it in your space.</p>
      <div className={styles.badges}><span>No paid API fallback</span><span>Free GPU, subject to availability</span><span>{online?"Online generation":"Offline · saved previews available"}</span></div>
    </header>
    <ol className={styles.steps} aria-label="Photo studio workflow">
      {["Upload a photo","Generate views + 3D","Save or publish","Share a product QR"].map((text,i)=><li key={text}><span>0{i+1}</span>{text}</li>)}
    </ol>
    <div className={styles.workspace}>
      <section className={styles.card}>
        <p className={styles.eyebrow}><Upload size={15}/>01 · Your photograph</p>
        <h2>Start with one clear object.</h2>
        <p className={styles.muted}>Use an uncluttered light background or a transparent PNG. Keep the whole product in frame. PNG, JPG, WebP · up to 10 MB.</p>
        <label htmlFor="studio-photo" className={styles.upload}>
          {photoUrl?<img src={photoUrl} alt="Your selected product photograph" width="480" height="320"/>:<><Upload size={32}/><strong>Choose a product photograph</strong><span>Your photo stays local until you press Generate.</span></>}
          <input id="studio-photo" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e=>choosePhoto(e.target.files?.[0])}/>
        </label>
        <label className={styles.label} htmlFor="studio-name">Product name</label>
        <input id="studio-name" value={name} maxLength={100} onChange={e=>setName(e.target.value)} placeholder="e.g. Signature cake" disabled={busy}/>
        <label className={styles.consent}><input type="checkbox" checked={consent} disabled={busy} onChange={e=>setConsent(e.target.checked)}/><span>Send this product photo to Microsoft’s public TRELLIS.2 demo on Hugging Face for processing. Use photos you have permission to share.</span></label>
        <button type="button" className={styles.primary} disabled={!photo||!consent||busy||!online} onClick={generate}>{busy?<LoaderCircle size={18} className={styles.spin}/>:<Box size={18}/>} {busy?"Generating…":"Generate views + 3D"}</button>
        {busy?<button type="button" onClick={cancel} className={styles.secondary}>Cancel generation</button>:null}
        <p className={styles.small}>Free service queues and daily GPU limits apply. There is no automatic retry, subscription, or paid fallback.</p>
        <details className={styles.details}><summary>Already have a GLB model?</summary><p>Import a self-contained GLB up to 25 MB. It stays local until you publish.</p><label htmlFor="studio-model">Import GLB model</label><input id="studio-model" type="file" accept=".glb,model/gltf-binary" disabled={busy||!photo} onChange={e=>importModel(e.target.files?.[0])}/></details>
      </section>
      <section className={styles.card} aria-label="Generation result">
        <div className={styles.resultHeading}><div><p className={styles.eyebrow}><Rotate3D size={15}/>02 · Your result</p><h2>{model?"Explore your model.":views.length?"Your different views.":"Room for a new perspective."}</h2></div><span className={styles.tag}>{model?(source==="ai"?"AI-generated 3D":"Imported 3D"):views.length?"Angles only":"Waiting for photo"}</span></div>
        {modelUrl?<PhotoModelPreview src={modelUrl} name={name||"Product"} onReady={()=>setViewerReady(true)}/>:<div className={styles.empty}>{views.length?<img src={views[0].src} alt="First AI-generated product view" width="480" height="360"/>:<><Box size={64} strokeWidth={1}/><p>Your generated views and interactive model appear here.</p></>}</div>}
        <div className={styles.status} role="status" aria-live="polite">{busy?<LoaderCircle className={styles.spin} size={17}/>:ready?<Check size={17}/>:<Box size={17}/>}<span>{stage||"Choose a photograph to get started."}</span></div>
        {warning?<p className={styles.warning} role="status">{warning}</p>:null}
        <p className={styles.small}>AI estimates hidden surfaces. Colours, labels, shape, and physical size may differ from the real product. Camera AR requires a supported phone.</p>
        {views.length?<div className={styles.gallery} aria-label="AI-generated angle previews">{views.map((view,i)=><figure key={i}><img src={view.src} alt={view.label+" — AI estimate"} width="240" height="240"/><figcaption>{view.label}<a href={view.src} download={"product-view-"+(i+1)+".png"} aria-label={"Download "+view.label}><Download size={14}/></a></figcaption></figure>)}</div>:null}
        {ready?<div className={styles.actions}>
          {model?<button type="button" className={styles.primary} onClick={()=>download(model,"b-socio-product.glb")}><Download size={16}/>Download GLB</button>:null}
          <button type="button" className={styles.secondary} disabled={saving||busy} onClick={()=>save(false)}>{saving?"Saving…":"Save draft"}</button>
          <button type="button" className={styles.secondary} disabled={saving||busy||!online||(Boolean(model)&&!viewerReady)} onClick={()=>save(true)}><WifiOff size={16}/>Save for offline</button>
          {model?<button type="button" className={styles.secondary} disabled={saving||busy} onClick={openDashboard}>Continue to publishing <ArrowRight size={16}/></button>:null}
        </div>:null}
        {notice?<p role="status" className={styles.notice}>{notice}</p>:null}
        {error?<p role="alert" className={styles.error}>{error}</p>:null}
        <p className={styles.small}>Saved drafts belong to this browser. Browser cleanup can remove them; download important models. Generating new models needs internet.</p>
      </section>
    </div>
    {saved.length?<section className={styles.card}><p className={styles.eyebrow}><WifiOff size={15}/>Saved on this browser</p><h2>Pick up where you left off.</h2><div className={styles.saved}>{saved.map(item=><div key={item.id}><div><strong>{item.name}</strong><small>{item.model?"3D model + photo":"Angle previews + photo"} · {new Date(item.savedAt).toLocaleDateString()}</small></div><button type="button" className={styles.secondary} disabled={busy} onClick={()=>openDraft(item)}>Open</button><button type="button" className={styles.textButton} disabled={busy} onClick={()=>removeDraft(item)}>Remove</button></div>)}</div></section>:null}
    <ProductQR/>
    <section className={styles.explainer}><h2>Creation happens once. Exploring happens anywhere.</h2><p>The QR opens a published product page. Your existing business account handles hosting, approval, and the public product link. Generation here uses a free external demo; existing account storage and product limits still apply.</p><Link href="/ar/demo">Explore the restaurant demo <ArrowRight size={16}/></Link></section>
  </main>;
}
