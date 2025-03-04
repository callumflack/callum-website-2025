import { Link, Text } from "@/components/atoms";
import { PageWrapper } from "@/components/page";
import { PostsPage } from "@/components/page/posts-page";
import config from "@/config";
import { getAllPosts } from "@/lib/posts/actions";
import type { PostCategory } from "@/lib/posts/types";
import type { SearchParams } from "@/types/search-params";
import { TitleHeader } from "@/components/elements";

export default async function WorkIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const kind = "writing" as PostCategory;
  const { sort } = await searchParams;
  const currentSort = (sort as string) || kind;
  const postsData = await getAllPosts();

  // Log server-side for debugging
  console.log("Server fetched posts:", {
    projects: postsData.projects.length,
    writing: postsData.writing.length,
  });

  return (
    <PageWrapper>
      <TitleHeader>
        <Text as="h1" intent="title">
          If you have the words, you'll find the way.
        </Text>
        <Text intent="body" dim>
          Writing about creativity, design and complexity through the lens of
          attention, interfaces and systems composition.{" "}
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
