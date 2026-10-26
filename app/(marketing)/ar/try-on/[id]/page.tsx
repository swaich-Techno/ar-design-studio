import { permanentRedirect } from "next/navigation";

export default function TryOnProductRedirect() {
  permanentRedirect("/ar/food");
}
