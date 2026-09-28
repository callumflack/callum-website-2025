import type { Metadata } from "next";
import { Suspense } from "react";
import { Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { PageInner, PageWrapper } from "@/components/page";
import { WritingIndexPosts } from "@/components/page/writing-index-posts";
import { getWritingIndexPosts } from "@/lib/posts/actions";

export default function WritingArchivePage() {
  const posts = getWritingIndexPosts();

  return (
    <PageWrapper activeNav="writing" theme="feed">
      <PageInner variant="indexSticky">
        <TitleHeader>
          <Text as="h1" intent="title">
            Writing
          </Text>
        </TitleHeader>
        <Suspense fallback={null}>
          <WritingIndexPosts posts={posts} />
        </Suspense>
      </PageInner>
    </PageWrapper>
  );
}

export const metadata: Metadata = {
  title: "Writing 01",
  description: "Archived version of Callum Flack's writing index.",
  alternates: { canonical: "/writing" },
  robots: { index: false, follow: true },
};
