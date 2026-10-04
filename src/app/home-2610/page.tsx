import type { Metadata } from "next";
import { HomePage } from "./_components/home-page";

export default function HomePreview() {
  return <HomePage />;
}

export const metadata: Metadata = {
  title: "Home preview",
  robots: { index: false, follow: false },
};
