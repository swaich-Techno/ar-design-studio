export async function uploadDraftAsset(blob,name,uploadType,productId) {
  const signatureResponse=await fetch("/api/upload/signature",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fileName:name,fileSize:blob.size,uploadType,folder:"photo-studio",productId})});
  const signature=await signatureResponse.json();
  if(!signatureResponse.ok)throw new Error(signature.error || "Your account cannot upload this asset.");
  const url=new URL(signature.uploadUrl);
  if(url.protocol!=="https:" || url.hostname!=="api.cloudinary.com")throw new Error("Unexpected upload destination.");
  const body=new FormData();
  for(const [key,value]of Object.entries(signature.params||{}))body.append(key,String(value));
  body.append("file",blob,name);
  const response=await fetch(url.href,{method:"POST",body});
  const asset=await response.json();
  if(!response.ok || !asset.secure_url)throw new Error("Asset upload failed. Your local draft is still saved.");
  const completed=await fetch("/api/upload/complete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:asset.secure_url,publicId:asset.public_id,bytes:asset.bytes||blob.size,fileSize:blob.size,fileSizeMB:signature.fileSizeMB,uploadType})});
  if(!completed.ok)throw new Error("The asset uploaded, but storage recording failed. Your local draft is still saved.");
  return {url:asset.secure_url,fileSizeMB:signature.fileSizeMB||blob.size/(1024*1024)};
}
