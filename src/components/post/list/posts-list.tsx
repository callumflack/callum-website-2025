"use client";

import { Link } from "@/components/atoms";
import type { PostCategory } from "@/types/content";
import type { SortedPostsMap } from "@/types/content";
import type { Post } from "content-collections";
import { PostLine } from "./post-line";

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
  const posts = sortedPostsMap[key] as Post[];

  // console.log("Rendering PostsList with:", key, posts);

  return (
    <div className={wrapperClassName}>
      {posts.map((post: Post) => (
        <Link
          key={post._id}
          href={post.thumbnailLink ? post.thumbnailLink : post.slug}
          className="block"
        >
          <PostLine isFeatured={post.tags?.includes("featured")} post={post} />
        </Link>
      ))}
    </div>
  );
};
