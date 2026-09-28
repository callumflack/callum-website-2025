"use client";

import { Mdx } from "@/components/mdx";

export function HomeIndex({ homeContent }: { homeContent: string }) {
  return (
    <section
      aria-label="Home index"
      data-component="HomeIndex"
      data-slot="home-index"
    >
      <div className="pt-small">
        <Mdx className="Prose--homeStart" code={homeContent} />
      </div>
    </section>
  );
}
