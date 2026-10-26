"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {getDraft,listDrafts} from "@/lib/photo3d/storage.mjs";
import {uploadDraftAsset} from "@/lib/photo3d/publish.mjs";
import {validateGlb} from "@/lib/photo3d/validation.mjs";
export function PhotoDraftImport({onImport,productId}) {
  const[draft,setDraft]=useState(null);const[busy,setBusy]=useState(false);const[error,setError]=useState("");const[message,setMessage]=useState("");
  useEffect(()=>{let active=true;const id=new URLSearchParams(location.search).get("photoDraft");(async()=>{try{const item=id?await getDraft(id):(await listDrafts()).find(d=>d.model);if(active&&item?.model)setDraft(item);}catch{/* The existing product form remains usable. */}})();return()=>{active=false;};},[]);
  async function importDraft(){
    setBusy(true);setError("");setMessage("Uploading the saved photo and model to your account…");
    try{
      validateGlb(await draft.model.arrayBuffer());
      const photo=await uploadDraftAsset(draft.photo,"photo-studio.png","image",productId);
      const model=await uploadDraftAsset(draft.model,"photo-studio.glb","model",productId);
      const gallery=[];
      for(const [index,view]of (draft.views||[]).slice(0,8).entries()){
        const blob=await(await fetch(view.src)).blob();
        const uploaded=await uploadDraftAsset(blob,"photo-view-"+(index+1)+".png","image",productId);gallery.push(uploaded.url);
      }
      onImport({name:draft.name,imageUrl:photo.url,fileSizeMB:photo.fileSizeMB,modelGlbUrl:model.url,modelFileSizeMB:model.fileSizeMB,galleryImages:gallery.join(", "),hasARModel:true,supportsRotation:true,shortDescription:"AI-generated visual preview. Hidden surfaces and physical size are unverified."});
      setMessage("Draft imported. Review the product details and save. Normal approval is required before its QR page is public.");
      setDraft(null);
    }catch(err){setError(err.message);setMessage("");}
    finally{setBusy(false);}
  }
  return <section className="rounded-2xl border border-teal-200 bg-teal-50 p-5 text-slate-800">
    <p className="font-black">Photo to 3D studio</p>
    <p className="mt-2 text-sm leading-6">Generate an experimental 3D preview from a photograph, then import it into this product. Your existing upload, storage, and approval limits apply.</p>
    <Link className="mt-3 inline-flex min-h-11 items-center font-bold text-teal-800 underline" href="/ar/create">Open Photo Studio →</Link>
    {draft?<div className="mt-3"><p className="text-sm font-bold">Saved draft: {draft.name}</p><button type="button" disabled={busy} onClick={importDraft} className="mt-3 rounded-xl bg-teal-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy?"Importing…":"Import saved photo, views, and GLB"}</button></div>:null}
    {message?<p role="status" className="mt-3 text-sm">{message}</p>:null}
    {error?<p role="alert" className="mt-3 text-sm font-bold text-red-700">{error} Your local draft is preserved.</p>:null}
  </section>;
}
