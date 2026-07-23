import type { Metadata } from "next";
import { Suspense } from "react";
import { Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements/title-header";
import { PageInner, PageWrapper } from "@/components/page/page-wrapper";
import { GalleryView } from "./_components/gallery-view";

export default function GalleryPage() {
  return (
    <PageWrapper activeNav="gallery" theme="feed">
      <PageInner variant="index">
        <TitleHeader>
          <Text as="h1" intent="title">
            Graphics and interactions since 1998
          </Text>
        </TitleHeader>
        <main>
          <Suspense fallback={null}>
            <GalleryView />
          </Suspense>
        </main>
      </PageInner>
    </PageWrapper>
  );
}

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Visual gallery of highlights from design and code projects produced since 1998.",
};
