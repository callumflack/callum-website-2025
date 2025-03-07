"use client";

import { Link } from "@/components/atoms";
import type {
  GroupedPosts,
  PostCategory,
  SortedPostsMap,
} from "@/types/content";
import type { Post } from "content-collections";
import { PostLine } from "./post-line";
import { PostsListGrouped } from "./posts-list-grouped";

interface PostsListProps {
  kind: PostCategory;
  sortBy: string;
  sortedPostsMap: SortedPostsMap;
  wrapperClassName?: string;
}

export const PostsList = ({
  kind,
  sortBy,
  sortedPostsMap,
  wrapperClassName,
}: PostsListProps) => {
  const key = sortBy ?? kind;
  const sorted = sortedPostsMap[key];

  // console.log("Rendering PostsList with:", key, sorted);

  return (
    <div className={wrapperClassName}>
      {["year", "topic"].includes(key) ? (
        <PostsListGrouped groupedPosts={sorted as GroupedPosts} />
      ) : (
        (sorted as Post[]).map((post: Post) => (
          <Link
            key={post._id}
            href={post.thumbnailLink ? post.thumbnailLink : post.slug}
            className="block"
          >
            <PostLine
              isFeatured={post.tags?.includes("featured")}
              post={post}
            />
          </Link>
        ))
      )}
    </div>
  );
};
