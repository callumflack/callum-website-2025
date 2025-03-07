import { Text } from "@/components/atoms";
import { LinkWithArrow } from "@/components/elements";
import { TitleHeader } from "@/components/elements/title-header";
import { PageWrapper } from "@/components/page";
import { PostsPage } from "@/components/page";
import config from "@/config";
import { getAllPosts } from "@/lib/posts/actions";
import type { PostCategory } from "@/types/content";
import type { SearchParams } from "@/types/search-params";
import type { Metadata } from "next";

export default async function WorkIndexPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const kind = "projects" as PostCategory;
  const { sort } = await searchParams;
  const currentSort = (sort as string) || kind;
  const postsData = await getAllPosts();

  // Log server-side for debugging
  console.log("Server fetched posts:", {
    projects: postsData.projects.length,
    writing: postsData.writing.length,
  });

  return (
    <PageWrapper activeNav="work">
      <TitleHeader>
        <Text as="h1" intent="title">
          {/* Design & programming services since 1998. */}
          Designing since 1998. Coding since 2010.
        </Text>
        <Text dim intent="meta">
          The value of good design is only realised if you have an engineer
          capable of discerning the details in code (or if you&apos;re lucky,
          they&apos;re one and the same).{" "}
          <LinkWithArrow href={config.SUBSTACK_URL} className="link">
            Signup for new posts
          </LinkWithArrow>
          .
        </Text>
      </TitleHeader>
      <PostsPage initialSort={currentSort} kind={kind} posts={postsData} />
    </PageWrapper>
  );
}

const title = `Work — Callum Flack Design & Development`;
const description = "An archive of design and programming projects.";

export function generateMetadata(): Metadata {
  return {
    title,
    description,
    twitter: {
      title,
      description,
    },
  };
}
