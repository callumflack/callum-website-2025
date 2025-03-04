"use client";

import { Link } from "@/components/atoms";
import type {
  GroupedPosts,
  PostCategory,
  SortedPostsMap,
} from "@/types/content";
import type { Post } from "content-collections";
import { PostBlock } from "./post-block";
import { PostsListGrouped } from "./posts-list-grouped";

interface PostsListBlockProps {
  kind: PostCategory;
  sortBy: string;
  sortedPostsMap: SortedPostsMap;
  wrapperClassName?: string;
}

export const PostsListBlock = ({
  kind,
  sortBy,
  sortedPostsMap,
  wrapperClassName,
}: PostsListBlockProps) => {
  const key = sortBy ?? kind;
  const sorted = sortedPostsMap[key];

  // console.log("Rendering PostsListBlock with:", key, sorted);

  return (
    <div className={wrapperClassName}>
      {["year", "topic"].includes(key) ? (
        <PostsListGrouped groupedPosts={sorted as GroupedPosts} />
      ) : (
        (sorted as Post[]).map((post: Post) => (
          <Link
            href={post.thumbnailLink ? post.thumbnailLink : post.slug}
            key={post._id}
          >
            <PostBlock post={post} />
          </Link>
        ))
      )}
    </div>
  );
};
