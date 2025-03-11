import {
  FeedPageInner,
  FullOrIndexPosts,
  PageWrapper,
} from "@/components/page";
import { getAllPostsChronological } from "@/lib/posts/actions";
import { ViewMode } from "@/types/viewMode";

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  const posts = await getAllPostsChronological();
  const resolvedSearchParams = await searchParams;

  // Validate the show parameter is a valid ViewMode
  const show = resolvedSearchParams.show as string;

  // Default to "full" for log page if no parameter is provided
  const validatedShow = !show
    ? ("full" as ViewMode)
    : show === "full" || show === "index"
      ? (show as ViewMode)
      : ("full" as ViewMode);

  return (
    <PageWrapper activeNav="feed">
      <FeedPageInner>
        <FullOrIndexPosts
          posts={posts}
          initialShow={validatedShow}
          routePrefix="/log"
        />
      </FeedPageInner>
    </PageWrapper>
  );
}

const title = `Feed — Callum Flack Design & Development`;
const description = "An archive of notes and thoughts.";

export const generateMetadata = () => {
  return {
    title,
    description,
  };
};
