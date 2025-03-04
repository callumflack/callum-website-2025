import { Text } from "@/components/atoms";
// import { TitleHeader } from "@/components/elements";
// import type { Metadata } from "next";
import type { SearchParams } from "@/types/search-params";
import { PageWrapper, PagePostsIndexClient } from "@/components/page";
import type { PostsKind } from "@/components/post";

// Do I need a layout to do this? No.
// export const metadata: Metadata = {
//   title: "Work",
//   description: "An archive of design and code projects produced since 1998.",
// };

export default function WorkIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const kind: PostsKind = "projects";
  const currentSort = (searchParams.sort as string) || kind;

  return (
    <PageWrapper>
      <div className="container space-y-2">
        <Text as="h1" intent="title">
          {/* Design & programming services since 1998. */}
          Designing since 1998. Coding since 2010.
        </Text>
        <Text dim>
          The value of good design is only realised if you have an engineer
          capable of discerning the details in code (or if you&apos;re lucky,
          they&apos;re one and the same).
        </Text>
      </div>
      <PagePostsIndexClient initialSort={currentSort} kind={kind} />
    </PageWrapper>
  );
}
