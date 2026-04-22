import { Suspense } from "react";
import { Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import {
  FeaturedOrIndexPosts,
  PageInner,
  PageWrapper,
} from "@/components/page";
import { getAllPosts } from "@/lib/posts/actions";
import type { ListCategory } from "@/types/content";
import type { Metadata } from "next";

export default function WritingPage() {
  const kind = "writing" as ListCategory;
  const postsData = getAllPosts();

  return (
    <PageWrapper activeNav="writing" theme="feed">
      <PageInner variant="index">
        <TitleHeader>
          <Text as="h1" intent="title">
            If you have the words, you&apos;ll find the way.
          </Text>
          {/* <Text dim balance intent="meta">
            Writing about creativity, design and complexity through the lens of
            attention, interfaces and systems composition.{" "}
            <LinkWithArrow href={config.SUBSTACK_URL} className="link">
              Signup for new posts
            </LinkWithArrow>
            .
          </Text> */}
        </TitleHeader>
        <Suspense fallback={null}>
          <FeaturedOrIndexPosts kind={kind} posts={postsData} />
        </Suspense>
      </PageInner>
    </PageWrapper>
  );
}

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Writing about creativity, design and complexity through the lens of attention, interfaces and systems composition.",
};
