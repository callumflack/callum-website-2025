"use client";

import { Link } from "@/components/atoms";
import type { ListCategory, SortedPostsMap } from "@/types/content";
import type { Post } from "content-collections";
import { PostBlock } from "./post-block";

interface PostsListBlockProps {
  kind: ListCategory;
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
    <div data-component="PostsListBlock" className={wrapperClassName}>
      {(sorted as Post[]).map((post: Post, index: number) => (
        <Link
          href={post.thumbnailLink ? post.thumbnailLink : post.slug}
          key={post._id}
        >
          <PostBlock post={post} priority={index < 4} />
        </Link>
      ))}
    </div>
  );
};
