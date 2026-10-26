import {validateImage,imageMagicMatches,validateGlb} from "./validation.mjs";

export const STUDIO_DEMO = Object.freeze({
  key:"avocado",
  name:"Avocado demo",
  photo:"/photo-studio/demo/avocado.jpg",
  model:"/photo-studio/demo/avocado.glb",
  credit:"Microsoft / Khronos glTF Sample Assets",
  source:"https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Avocado",
});

export async function loadStudioDemo({signal,fetcher=fetch}={}) {
  const responses=await Promise.all([STUDIO_DEMO.photo,STUDIO_DEMO.model].map(url=>fetcher(url,{signal})));
  if(responses.some(response=>!response.ok))throw new Error("The demo could not be loaded. Reconnect and try again, or open a saved draft.");
  const [photoBytes,modelBytes]=await Promise.all(responses.map(response=>response.arrayBuffer()));
  signal?.throwIfAborted();
  const photo=new File([photoBytes],"avocado-demo.jpg",{type:"image/jpeg"});
  validateImage(photo);
  if(!imageMagicMatches(photoBytes,"image/jpeg"))throw new Error("The demo image could not be read. Try loading it again.");
  validateGlb(modelBytes);
  return {name:STUDIO_DEMO.name,photo,model:new Blob([modelBytes],{type:"model/gltf-binary"}),views:[],source:"demo"};
}
