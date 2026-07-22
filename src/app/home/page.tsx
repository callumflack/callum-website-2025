import { permanentRedirect } from "next/navigation";

export default function LegacyHomeRedirect() {
  permanentRedirect("/");
}
