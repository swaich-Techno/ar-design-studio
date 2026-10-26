import { CapabilitiesSection } from "@/components/redesign/main/capabilities";
import { Process } from "@/components/redesign/main/process";

export const metadata = {
  title: "Capabilities | B Socio",
  description: "Creative, digital, 3D and AR commerce — the four things B Socio actually builds.",
  alternates: { canonical: "https://ar.bsocio.in/capabilities" },
};

export default function CapabilitiesPage() {
  return (
    <div className="pt-16">
      <CapabilitiesSection />
      <Process />
    </div>
  );
}
