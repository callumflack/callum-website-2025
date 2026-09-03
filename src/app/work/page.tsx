import type { Metadata } from "next";
import { Suspense } from "react";
import { Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements/title-header";
import { PageInner, PageWrapper } from "@/components/page/page-wrapper";
import { WorkIndex, WorkIndexFallback } from "./_components/work-index";
import type { WorkSearchParams } from "./_components/work-mode";

export default function WorkPage({
  searchParams,
}: {
  searchParams: Promise<WorkSearchParams>;
}) {
  return (
    <PageWrapper activeNav="work" theme="feed">
      <PageInner variant="indexSticky">
        <TitleHeader>
          <Text as="h1" intent="title">
            Work
          </Text>
          {/* <Text as="h1" intent="title">
            Designing since 1998. Coding since 2010.
          </Text> */}
          {/* <Text dim balance intent="meta">
            The value of good design is only realised if you have an engineer
            capable of discerning the details in code (or if you&apos;re lucky,
            they&apos;re one and the same).{" "}
            <LinkWithArrow href={config.SUBSTACK_URL} className="link">
              Signup for new posts
            </LinkWithArrow>
            .
          </Text> */}
        </TitleHeader>
        <Suspense fallback={<WorkIndexFallback />}>
          <WorkIndex searchParams={searchParams} />
        </Suspense>
      </PageInner>
    </PageWrapper>
  );
}

export const instant = {
  unstable_samples: [
    { searchParams: {} },
    { searchParams: { sort: "projects" } },
    { searchParams: { sort: "year" } },
  ],
};

export const prefetch = "partial";

export const metadata: Metadata = {
  title: "Work",
  description: "An archive of design and code projects produced since 1998.",
};
