import type { Metadata } from "next";
import { Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { FullOrIndexPosts, PageInner, PageWrapper } from "@/components/page";
import {
  getAllPostsChronological,
  toPostListItem,
} from "@/lib/posts/actions";

export default function LogPage() {
  const posts = getAllPostsChronological().map(toPostListItem);

  return (
    <PageWrapper activeNav="log">
      <PageInner variant="indexSticky">
        <TitleHeader>
          <Text as="h1" intent="title">
            Log
          </Text>
        </TitleHeader>
        <FullOrIndexPosts posts={posts} />
      </PageInner>
    </PageWrapper>
  );
}

export const metadata: Metadata = {
  title: "Log",
  description: "An archive of notes and thoughts.",
};
