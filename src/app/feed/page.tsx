import { FeedPageInner, PageWrapper } from "@/components/page";
import { getAllPostsChronological } from "@/lib/posts/actions";
import { FeedPage } from "./(components)/feed-page";

export default async function FeedIndexPage() {
  const posts = await getAllPostsChronological();

  return (
    <PageWrapper activeNav="feed">
      <FeedPageInner>
        <FeedPage posts={posts} />
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
