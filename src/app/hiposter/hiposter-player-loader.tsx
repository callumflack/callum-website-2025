"use client";

import dynamic from "next/dynamic";

const HiPosterPlayer = dynamic(
  () => import("./hiposter-player").then((mod) => mod.HiPosterPlayer),
  {
    ssr: false,
    loading: () => null,
  },
);

export function HiPosterPlayerLoader() {
  return <HiPosterPlayer />;
}
