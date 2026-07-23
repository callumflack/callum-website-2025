"use client";

import { Link } from "@/components/atoms";
import type {
  ListCategory,
  PostListItem,
  SortedPostsMap,
} from "@/types/content";
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

  return (
    <div data-component="PostsListBlock" className={wrapperClassName}>
      {(sorted as PostListItem[]).map((post, index) => (
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
