import { Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements/title-header";
import {
  FeaturedOrIndexPosts,
  PageInner,
  PageWrapper,
} from "@/components/page";
import { getAllPosts } from "@/lib/posts/actions";
import type { ListCategory } from "@/types/content";
import type { SearchParams } from "@/types/search-params";
import type { Metadata } from "next";

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const kind = "projects" as ListCategory;
  const { sort } = await searchParams;
  const currentSort = (sort as string) || kind;
  const postsData = await getAllPosts();

  return (
    <PageWrapper activeNav="work" theme="feed">
      <PageInner variant="index">
        <TitleHeader>
          <Text as="h1" intent="title">
            {/* Design & programming services since 1998. */}
            Designing since 1998. Coding since 2010.
          </Text>
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
        <FeaturedOrIndexPosts
          initialSort={currentSort}
          kind={kind}
          posts={postsData}
        />
      </PageInner>
    </PageWrapper>
  );
}

export const metadata: Metadata = {
  title: "Work",
  description: "An archive of design and code projects produced since 1998.",
};
