"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {Upload,Box,Download,ArrowRight,Rotate3D,WifiOff,QrCode,Check,LoaderCircle,ImageIcon,Layers,ShieldCheck} from "lucide-react";
import {PhotoModelPreview} from "./model-preview";
import {validateImage,imageMagicMatches,validateGlb,friendlyGenerationError,validatePublishedProductUrl} from "@/lib/photo3d/validation.mjs";
import {saveDraft,listDrafts,deleteDraft,cacheStudioShell} from "@/lib/photo3d/storage.mjs";
import {Button} from "@/components/redesign/ui/button";
import styles from "./studio.module.css";

async function preparePhoto(file) {
  validateImage(file);
  if(!imageMagicMatches(await file.slice(0,16).arrayBuffer(),file.type))throw new Error("The photograph does not match its file type.");
  const image=await createImageBitmap(file);
  try{
    if(image.width<96 || image.height<96 || image.width*image.height>24000000)throw new Error("Use a clear photograph at least 96 pixels wide and under 24 megapixels.");
    const factor=Math.min(1,768/Math.max(image.width,image.height));
    const canvas=document.createElement("canvas");canvas.width=Math.round(image.width*factor);canvas.height=Math.round(image.height*factor);
    canvas.getContext("2d").drawImage(image,0,0,canvas.width,canvas.height);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/png"));
    if(!blob || blob.size>3*1024*1024)throw new Error("This photo is too large after preparation. Choose a smaller one.");
    return new File([blob],"product.png",{type:"image/png"});
  }finally{image.close();}
}
function download(blob,name) {
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function useBlobUrl(blob){const[url,setUrl]=useState("");useEffect(()=>{if(!blob){setUrl("");return;}const next=URL.createObjectURL(blob);setUrl(next);return()=>URL.revokeObjectURL(next);},[blob]);return url;}
function ProductQR(){
  const urlRef=useRef(null);
  const[value,setValue]=useState("");const[qr,setQr]=useState("");const[error,setError]=useState("");const[busy,setBusy]=useState(false);
  async function create(event){event.preventDefault();setBusy(true);setError("");setQr("");try{
    const target=validatePublishedProductUrl(value,location.origin);
    const parts=new URL(target).pathname.split("/").filter(Boolean);
    const res=await fetch("/api/public/product/"+parts[1]+"/"+parts[3],{cache:"no-store"});
    const data=await res.json().catch(()=>({}));
    if(!res.ok || !data.product?.modelGlbUrl)throw new Error("This product is not publicly available with a GLB yet. Publish it and complete approval first.");
    const QRCode=(await import("qrcode")).default;
    setQr(await QRCode.toDataURL(target,{width:360,margin:4,errorCorrectionLevel:"M"}));
  }catch(err){setError(err.message);urlRef.current?.focus();}finally{setBusy(false);}}
  return <section className={styles.card}>
    <div className={styles.sectionTitle}><QrCode aria-hidden="true"/><h2>Share a published product</h2></div>
    <p id="qr-help" className={styles.muted}>Publish your model through the product dashboard, then paste its public product link. A local draft is visible only on this browser.</p>
    <form onSubmit={create} className={styles.qrForm}>
      <label htmlFor="published-product">Published product URL</label>
      <input ref={urlRef} id="published-product" name="publishedProduct" autoComplete="off" spellCheck={false} aria-invalid={Boolean(error)} aria-describedby="qr-help qr-error" type="url" value={value} onChange={e=>{setValue(e.target.value);setQr("");}} placeholder="https://ar.bsocio.in/b/your-shop/product/your-product…" required/>
      <Button variant="ghost" className={styles.secondary} disabled={busy}>{busy?"Checking product…":"Verify and create QR"}</Button>
    </form>
    <p id="qr-error" role={error?"alert":undefined} className={error?styles.error:undefined}>{error}</p>
    {qr?<div className={styles.qrResult}><img src={qr} alt="QR code for the verified published product" width="220" height="220"/><a href={qr} download="b-socio-product-qr.png" className={styles.secondary}>Download QR</a></div>:null}
  </section>;
}
export function PhotoStudio(){
  const[name,setName]=useState("");const[photo,setPhoto]=useState(null);const[model,setModel]=useState(null);const[views,setViews]=useState([]);
  const[source,setSource]=useState("ai");const[consent,setConsent]=useState(false);const[busy,setBusy]=useState(false);const[saving,setSaving]=useState(false);
  const[stage,setStage]=useState("");const[error,setError]=useState("");const[notice,setNotice]=useState("");const[warning,setWarning]=useState("");
  const[saved,setSaved]=useState([]);const[online,setOnline]=useState(true);const[id,setId]=useState("");const[viewerReady,setViewerReady]=useState(false);
  const run=useRef(0);const controller=useRef(null);
  const[photoError,setPhotoError]=useState("");const[pendingRemoval,setPendingRemoval]=useState("");
  const photoUrl=useBlobUrl(photo);const modelUrl=useBlobUrl(model);
  async function refreshSaved(){try{setSaved(await listDrafts());}catch{/* In-memory generation still works if browser storage is unavailable. */}}
  useEffect(()=>{setOnline(navigator.onLine);refreshSaved();const update=()=>setOnline(navigator.onLine);window.addEventListener("online",update);window.addEventListener("offline",update);return()=>{window.removeEventListener("online",update);window.removeEventListener("offline",update);controller.current?.abort();};},[]);
  async function choosePhoto(file){
    if(!file)return;
    setPhotoError("");setError("");setNotice("");
    try{const prepared=await preparePhoto(file);run.current++;controller.current?.abort();setBusy(false);setPhoto(prepared);setModel(null);setViewerReady(false);setViews([]);setWarning("");setStage("");setSource("ai");setId(crypto.randomUUID());setName(file.name.replace(/\.[^.]+$/,"").slice(0,100));}
    catch(err){setPhotoError(err.message);}
  }
  async function generate(){
    if(!photo || !consent || busy)return;
    if(!navigator.onLine){setError("Generating a new model needs internet. Your saved previews can still be opened below.");return;}
    const token=++run.current;const abort=new AbortController();controller.current=abort;setBusy(true);setError("");setWarning("");setNotice("");setModel(null);setViews([]);setViewerReady(false);
    try{
      const {generateFromPhoto}=await import("@/lib/photo3d/remote.mjs");
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
  async function removeDraft(item){try{await deleteDraft(item.id);setPendingRemoval("");await refreshSaved();setNotice("Saved draft removed from this browser.");}catch(err){setError(err.message);}}
  async function openDashboard(){setSaving(true);setError("");try{const d=draft();await saveDraft(d);location.assign("/business/products/new?photoDraft="+encodeURIComponent(d.id));}catch(err){setError(err.message);}finally{setSaving(false);}}
  const ready=Boolean(model||views.length);
  const currentStep=ready?2:photo?1:0;
  return <section aria-label="Photo Studio" className={styles.studio}>
    <header className={styles.intro}>
      <div>
        <div className={styles.titleLine}><h1>Photo Studio</h1><span className={styles.tag}>Experimental</span></div>
        <p>Turn one product photo into angle previews and an interactive 3D model.</p>
      </div>
      <div className={styles.availability}><ShieldCheck aria-hidden="true"/><div><strong>No paid API fallback</strong><span>{online?"Online generation. Free GPU limits apply.":"Offline. Open a saved preview below."}</span></div></div>
    </header>
    <ol className={styles.steps} aria-label="Photo studio workflow">
      {["Upload a photo","Generate views + 3D","Save or publish","Share a product QR"].map((text,i)=><li key={text} aria-current={i===currentStep?"step":undefined} data-state={i<currentStep?"done":i===currentStep?"current":"upcoming"}><span>{i<currentStep?<Check aria-hidden="true"/>:i+1}</span>{text}</li>)}
    </ol>
    <div className={styles.workspace}>
      <section className={styles.card}>
        <div className={styles.sectionTitle}><ImageIcon aria-hidden="true"/><h2>Add a product photo</h2></div>
        <p id="photo-help" className={styles.muted}>One clear object, fully in frame. PNG, JPG or WebP, up to 10 MB.</p>
        <label htmlFor="studio-photo" className={styles.upload}>
          {photoUrl?<img src={photoUrl} alt="Your selected product photograph" width="480" height="320"/>:<><Upload aria-hidden="true"/><strong>Choose a product photograph</strong><span>Click to browse your device</span></>}
          <input id="studio-photo" name="productPhoto" aria-label={photo?"Change product photograph":"Choose a product photograph"} aria-invalid={Boolean(photoError)} aria-describedby="photo-help photo-error" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e=>choosePhoto(e.target.files?.[0])}/>
        </label>
        {photo?<p className={styles.fileReady}><Check aria-hidden="true"/>Photo ready <span>Click the photo to replace it</span></p>:null}
        {photoError?<p id="photo-error" role="alert" className={styles.error}>{photoError}</p>:<span id="photo-error"/>}
        <div className={styles.photoGuide}><Layers aria-hidden="true"/><p>Use a plain, light background or a transparent PNG. Background clutter can become part of the model.</p></div>
        <label className={styles.label} htmlFor="studio-name">Product name</label>
        <input id="studio-name" name="productName" autoComplete="off" value={name} maxLength={100} onChange={e=>setName(e.target.value)} placeholder="e.g. Signature cake…" disabled={busy}/>
        <label className={styles.consent}><input type="checkbox" name="processingConsent" checked={consent} disabled={busy} onChange={e=>setConsent(e.target.checked)}/><span>Send this product photo to Microsoft’s public TRELLIS.2 demo on Hugging Face for processing. Use photos you have permission to share.</span></label>
        <Button type="button" variant="gold" className={styles.primary} disabled={!photo||!consent||busy||!online} onClick={generate}>{busy?<LoaderCircle aria-hidden="true" size={18} className={styles.spin}/>:<Box aria-hidden="true" size={18}/>} {busy?"Generating…":"Generate views + 3D"}</Button>
        {busy?<Button type="button" onClick={cancel} variant="ghost" className={styles.secondary}>Cancel generation</Button>:null}
        <p className={styles.small}>Your photo stays local until you press Generate. Free service queues and daily GPU limits apply. There is no automatic retry, subscription, or paid fallback.</p>
        <details className={styles.details}><summary>Already have a GLB model?</summary><p>Import a self-contained GLB up to 25 MB. It stays local until you publish.</p><label htmlFor="studio-model">Import GLB model</label><input id="studio-model" type="file" accept=".glb,model/gltf-binary" disabled={busy||!photo} onChange={e=>importModel(e.target.files?.[0])}/></details>
      </section>
      <section className={styles.card} aria-label="Generation result" aria-busy={busy}>
        <div className={styles.resultHeading}><div><div className={styles.sectionTitle}><Rotate3D aria-hidden="true"/><h2>{model?"Explore your model":views.length?"Your angle previews":"Your 3D preview"}</h2></div></div><span className={styles.tag}>{model?(source==="ai"?"AI-generated 3D":"Imported 3D"):views.length?"Angles only":busy?"Generating…":photo?"Photo ready":"Awaiting photo"}</span></div>
        {modelUrl?<PhotoModelPreview src={modelUrl} name={name||"Product"} onReady={()=>setViewerReady(true)}/>:<div className={styles.empty}>{views.length?<img src={views[0].src} alt="First AI-generated product view" width="480" height="360"/>:photoUrl?<><img src={photoUrl} alt="Source photograph, awaiting 3D generation" width="480" height="360"/><span className={styles.sourceLabel}>Source photo. 3D has not been generated.</span></>:<><Box aria-hidden="true" size={56} strokeWidth={1}/><strong>A new perspective starts here</strong><p>Choose your photo, then generate. Your interactive model and angle previews will appear here.</p></>}</div>}
        <div className={styles.status} role="status" aria-live="polite">{busy?<LoaderCircle aria-hidden="true" className={styles.spin} size={17}/>:ready?<Check aria-hidden="true" size={17}/>:<Box aria-hidden="true" size={17}/>}<span>{stage||(photo?(consent?"Ready to generate. Your photo has not been sent yet.":"Photo ready. Allow processing to enable generation."):"Choose a photograph to get started.")}</span></div>
        {warning?<p className={styles.warning} role="status">{warning}</p>:null}
        <p className={styles.small}>AI estimates hidden surfaces. Colours, labels, shape, and physical size may differ from the real product. Camera AR requires a supported phone.</p>
        {views.length?<div className={styles.gallery} aria-label="AI-generated angle previews">{views.map((view,i)=><figure key={i}><img src={view.src} alt={view.label+" — AI estimate"} width="240" height="240" loading="lazy"/><figcaption>{view.label}<a href={view.src} download={"product-view-"+(i+1)+".png"} aria-label={"Download "+view.label}><Download aria-hidden="true" size={14}/></a></figcaption></figure>)}</div>:null}
        {ready?<div className={styles.actions}>
          {model?<Button type="button" variant="gold" className={styles.primary} onClick={()=>download(model,"b-socio-product.glb")}><Download aria-hidden="true" size={16}/>Download GLB</Button>:null}
          <Button type="button" variant="ghost" className={styles.secondary} disabled={saving||busy} onClick={()=>save(false)}>{saving?"Saving…":"Save draft"}</Button>
          <Button type="button" variant="ghost" className={styles.secondary} disabled={saving||busy||!online||(Boolean(model)&&!viewerReady)} onClick={()=>save(true)}><WifiOff aria-hidden="true" size={16}/>Save for offline</Button>
          {model?<Button type="button" variant="ghost" className={styles.secondary} disabled={saving||busy} onClick={openDashboard}>Continue to publishing <ArrowRight aria-hidden="true" size={16}/></Button>:null}
        </div>:null}
        {notice?<p role="status" className={styles.notice}>{notice}</p>:null}
        {error?<p role="alert" className={styles.error}>{error}</p>:null}
        <p className={styles.small}>Saved drafts belong to this browser. Browser cleanup can remove them; download important models. Generating new models needs internet.</p>
      </section>
    </div>
    {saved.length?<section className={styles.card}><div className={styles.sectionTitle}><WifiOff aria-hidden="true"/><h2>Saved on this browser</h2></div><div className={styles.saved}>{saved.map(item=><div key={item.id}><div><strong>{item.name}</strong><small>{item.model?"3D model + photo":"Angle previews + photo"} / {new Intl.DateTimeFormat(undefined,{dateStyle:"medium"}).format(new Date(item.savedAt))}</small></div><Button type="button" variant="ghost" className={styles.secondary} disabled={busy} onClick={()=>openDraft(item)}>Open</Button><button type="button" className={styles.textButton} disabled={busy} aria-label={"Remove "+item.name} onClick={()=>setPendingRemoval(item.id)}>Remove</button>{pendingRemoval===item.id?<div className={styles.removePrompt} role="group" aria-label={"Confirm removal of "+item.name}><p>Remove this saved draft from this browser?</p><Button variant="ghost" className={styles.secondary} onClick={()=>setPendingRemoval("")}>Keep draft</Button><Button variant="ghost" className={styles.danger} onClick={()=>removeDraft(item)}>Remove draft</Button></div>:null}</div>)}</div></section>:null}
    <ProductQR/>
    <section className={styles.explainer}><h2>Creation happens once. Exploring happens anywhere.</h2><p>The QR opens a published product page. Your existing business account handles hosting, approval, and the public product link. Generation here uses a free external demo; existing account storage and product limits still apply.</p><Link href="/ar/demo">Explore the restaurant demo <ArrowRight aria-hidden="true" size={16}/></Link></section>
  </section>;
}
