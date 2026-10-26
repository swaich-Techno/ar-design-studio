import {PhotoStudio} from "@/components/photo3d/studio";
export const metadata={
  title:"Photo to 3D Studio | B Socio AR",
  description:"Turn a product photograph into AI-generated angle previews and a 3D model using a free, quota-limited generation service. Save completed previews on your device.",
  alternates:{canonical:"https://ar.bsocio.in/ar/create"},
  robots:{index:false,follow:true}
};
export default function CreatePage(){return <PhotoStudio/>;}
