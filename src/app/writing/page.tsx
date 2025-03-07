import { Text } from "@/components/atoms";
import { LinkWithArrow, TitleHeader } from "@/components/elements";
import { PageWrapper } from "@/components/page";
import { PostsPage } from "@/components/page";
import config from "@/config";
import { getAllPosts } from "@/lib/posts/actions";
import type { PostCategory } from "@/types/content";
import type { SearchParams } from "@/types/search-params";

export default async function WorkIndexPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const kind = "writing" as PostCategory;
  const { sort } = await searchParams;
  const currentSort = (sort as string) || kind;
  const postsData = await getAllPosts();

  // Log server-side for debugging
  // console.log("Server fetched posts:", {
  //   projects: postsData.projects.length,
  //   writing: postsData.writing.length,
  // });

  return (
    <PageWrapper activeNav="writing">
      <TitleHeader>
        <Text as="h1" intent="title">
          If you have the words, you&apos;ll find the way.
        </Text>
        <Text dim intent="meta">
          Writing about creativity, design and complexity through the lens of
          attention, interfaces and systems composition.{" "}
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

const title = `Writing — Callum Flack Design & Development`;
const description = "An archive of design and programming projects.";

export const generateMetadata = () => {
  return {
    title,
    description,
    twitter: {
      title,
      description,
    },
  };
};
