import { allPosts } from "content-collections";
import type { Metadata } from "next";
import { Suspense } from "react";
import { focusVisibleOutlineStyle, Link, Text } from "@/components/atoms";
import { Intro, PageWrapper } from "@/components/page";
import { cn } from "@/lib/utils";
import {
  WritingIndex,
  WritingIndexFallback,
} from "./_components/writing-index";
import type { WritingSearchParams } from "./_components/writing-mode";
import { WritingLoadingPreview } from "./_components/writing-loading-preview";

export default function WritingPage({
  searchParams,
}: {
  searchParams: Promise<WritingSearchParams>;
}) {
  const writingStory = allPosts.find(
    (post) => !post.draft && post.slug === "writing"
  );

  if (!writingStory) {
    throw new Error("Missing published writing story: posts/pages/writing.mdx");
  }

  const index = (
    <Suspense fallback={<WritingIndexFallback />}>
      <WritingIndex code={writingStory.content} searchParams={searchParams} />
    </Suspense>
  );

  return (
    <PageWrapper hideFooter navigation={null}>
      <div className="pt-w20 pb-w72" data-slot="writing-inner">
        <header className="container">
          <Intro
            showLabel={false}
            showContacts={false}
            metaNode={
              <Text as="nav" aria-label="About, work and RSS" dim intent="meta">
                <Link
                  className={cn("hover:text-fill", focusVisibleOutlineStyle)}
                  href="/about?from=writing"
                  prefetch={true}
                >
                  About
                </Link>
                <span className="mx-1.5 font-light">|</span>
                <Link
                  className={cn("hover:text-fill", focusVisibleOutlineStyle)}
                  href="/"
                >
                  Work
                </Link>
                <span className="mx-1.5 font-light">|</span>
                <a
                  className={cn("hover:text-fill", focusVisibleOutlineStyle)}
                  href="/feed.xml"
                >
                  RSS
                </a>
              </Text>
            }
            showCurrentPrev={false}
            showWhatIWant={false}
            textIntent="body"
          >
            Hi, I&apos;m Callum Flack, an Australian{" "}
            <Link className={cn("link", focusVisibleOutlineStyle)} href="/">
              designer-engineer
            </Link>
            . I write about how attention becomes judgment, and how judgment
            shapes tools, groups and systems.{" "}
          </Intro>
        </header>

        <div className="pt-w8" data-slot="writing-content">
          {process.env.NODE_ENV === "development" ? (
            <WritingLoadingPreview fallback={<WritingIndexFallback />}>
              {index}
            </WritingLoadingPreview>
          ) : (
            index
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export const instant = {
  unstable_samples: [{ searchParams: {} }, { searchParams: { sort: "year" } }],
};

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Writing about creativity, design and complexity through the lens of attention, interfaces and systems composition.",
};
