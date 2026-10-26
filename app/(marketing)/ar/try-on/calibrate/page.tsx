import { permanentRedirect } from "next/navigation";

export default function TryOnCalibrateRedirect() {
  permanentRedirect("/ar/food");
}
