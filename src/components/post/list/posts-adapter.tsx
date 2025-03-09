import { GroupedPosts } from "@/types/content";
import type { Post } from "content-collections";

// A simple adapter component that normalizes post data
// This manages presentation of grouped or flat posts data from the useSortedPosts hook
export const PostsAdapter = ({
  data,
  renderPost,
}: {
  data: Post[] | GroupedPosts;
  renderPost: (post: Post) => React.ReactNode;
}) => {
  // If data is already flat (array), render it directly
  if (Array.isArray(data)) {
    return <>{data.map(renderPost)}</>;
  }

  // If data is grouped, flatten it first
  const flattenedPosts = Object.values(data).flat();
  return <>{flattenedPosts.map(renderPost)}</>;
};
