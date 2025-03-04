import { Link } from "@/components/atoms";
import { cx } from "cva";
import type { PostsKind } from "@/components/post";
import type { GroupedPosts } from "@/lib/filter-posts";
import { type Post } from "content-collections";
import { PostCard } from "@/components/card";
import { PostBlock } from "./post-block";
import { PostLine } from "./post-line";
import { PostsListGrouped, PostsListCardGrouped } from "./posts-list-grouped";

interface PostsListProps {
  kind: PostsKind;
  sortBy?: string | null;
  sortedPostsMap: Record<string, Post[] | GroupedPosts>;
  wrapperClassName?: string;
}

export const PostsList = ({
  kind,
  sortBy,
  sortedPostsMap,
  wrapperClassName,
}: PostsListProps) => {
  const sorted = sortedPostsMap[sortBy ?? kind];

  return (
    <div className={wrapperClassName}>
      {["year", "topic"].includes(sortBy ?? "") ? (
        <PostsListGrouped groupedPosts={sorted as GroupedPosts} />
      ) : (
        (sorted as Post[]).map((post: Post) => (
          <Link
            href={post.thumbnailLink ? post.thumbnailLink : post.slug}
            key={post._id}
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

export const PostsListBlock = ({
  kind,
  sortBy,
  sortedPostsMap,
  wrapperClassName,
}: PostsListProps) => {
  const sorted = sortedPostsMap[sortBy ?? kind];

  return (
    <div className={wrapperClassName}>
      {["year", "topic"].includes(sortBy ?? "") ? (
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

/* CURRENTLY UNUSED */
export const PostsListCard = ({
  kind,
  sortBy,
  sortedPostsMap,
  wrapperClassName,
}: PostsListProps) => {
  const sorted = sortedPostsMap[sortBy ?? kind];

  return (
    <div className={cx("pt-w8", wrapperClassName)}>
      {["year", "topic"].includes(sortBy ?? "") ? (
        <PostsListCardGrouped groupedPosts={sorted as GroupedPosts} />
      ) : (
        (sorted as Post[]).map((post: Post) => (
          <PostCard
            captionClassName="absolute bottom-[-2em] translate-y-[0.6em] pt-1.5"
            className="rounded-card bg-background lg:p-[7em]"
            key={post.title}
            post={post}
          />
        ))
      )}
    </div>
  );
};
