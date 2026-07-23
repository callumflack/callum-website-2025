import type { Metadata } from "next";
import { Suspense } from "react";
import { Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { PageInner, PageWrapper } from "@/components/page";
import { WritingIndexPosts } from "@/components/page/writing-index-posts";
import { getWritingIndexPosts } from "@/lib/posts/actions";

export default function WritingPage() {
  const posts = getWritingIndexPosts();

  return (
    <PageWrapper activeNav="writing" theme="feed">
      <PageInner variant="indexSticky">
        <TitleHeader>
          {/* <Text
              as="h1"
              intent="pill"
              color="solid"
              className="absolute top-[-2em] pl-0.5"
            >
              Writing
            </Text> */}
          <Text as="h1" intent="title">
            Writing
          </Text>
          {/* <Text as="h2" intent="title">
              If you have the words, you&apos;ll find the way.
            </Text> */}
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
          <WritingIndexPosts posts={posts} />
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
