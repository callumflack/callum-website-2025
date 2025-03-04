import { Link, Text } from "@/components/atoms";
import type { Metadata } from "next";
import type { SearchParams } from "@/types/search-params";
import { PageWrapper } from "@/components/page";
import { PostsPage } from "@/components/page/posts-page";
import { getAllPosts } from "@/lib/posts/actions";
import type { PostCategory } from "@/types/content";
import { TitleHeader } from "@/components/elements/title-header";
import config from "@/config";

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
        <Text intent="meta" dim>
          The value of good design is only realised if you have an engineer
          capable of discerning the details in code (or if you&apos;re lucky,
          they&apos;re one and the same).{" "}
          <Link className="link" href={config.SUBSTACK_URL}>
            Signup for new posts
          </Link>
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
