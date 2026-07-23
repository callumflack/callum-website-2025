import type { Metadata } from "next";
import { Suspense } from "react";
import { Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { FullOrIndexPosts, PageInner, PageWrapper } from "@/components/page";
import { getAllPostsChronological } from "@/lib/posts/actions";

export default function LogPage() {
  const posts = getAllPostsChronological();

  return (
    <PageWrapper activeNav="log">
      <PageInner variant="indexSticky">
        <TitleHeader>
          <Text as="h1" intent="title">
            Log
          </Text>
        </TitleHeader>
        <Suspense fallback={null}>
          <FullOrIndexPosts posts={posts} initialShow="index" />
        </Suspense>
      </PageInner>
    </PageWrapper>
  );
}

export const metadata: Metadata = {
  title: "Log",
  description: "An archive of notes and thoughts.",
};
