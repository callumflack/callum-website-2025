import { PostLines } from "@/components/post";
import type { PostListItem } from "@/types/content";
import { ListHeader } from "./list-header";

/* Used on log and topic pages */

interface IndexPostsProps {
  posts: PostListItem[];
  topic?: string;
  listHeaderNode?: React.ReactNode;
}

export function FullOrIndexPosts({
  posts,
  topic,
  listHeaderNode,
}: IndexPostsProps) {
  return (
    <>
      <ListHeader
        ariaLabel={topic ? "Topic posts" : "Log posts"}
        showContained
        rhsNode={listHeaderNode}
      />

      <main className="container pt-3">
        <PostLines
          isFeed
          postLinkPrefix="/"
          posts={posts}
          showFeatured={false}
        />
      </main>
    </>
  );
}
