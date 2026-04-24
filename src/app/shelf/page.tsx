import { Suspense } from "react";
import { Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { PageInner, PageWrapper } from "@/components/page";
import { getShelfPosts } from "@/lib/posts/actions";
import type { Metadata } from "next";
import { ShelfPosts } from "./shelf-posts";

export default function ShelfPage() {
  const posts = getShelfPosts();

  return (
    <PageWrapper activeNav="shelf" theme="feed">
      <PageInner variant="index">
        <TitleHeader>
          <Text as="h1" intent="title">
            {/* Suppose I think of a story and you guess what it is. */}A few of
            my favourite things.
          </Text>
        </TitleHeader>
        <Suspense fallback={null}>
          <ShelfPosts posts={posts} />
        </Suspense>
      </PageInner>
    </PageWrapper>
  );
}

export const metadata: Metadata = {
  title: "Shelf",
  description: "Curated lists — favourite articles, heroes, books, music.",
};
