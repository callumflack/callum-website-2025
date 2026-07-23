import { Link } from "@/components/atoms";
import type { ListCategory } from "@/types/content";
import type { PostListItem, SortedPostsMap } from "@/types/content";
import { PostLine } from "./post-line";

interface PostsListProps {
  kind: ListCategory;
  sortBy: string;
  sortedPostsMap: SortedPostsMap;
  wrapperClassName?: string;
}

interface PostLinesProps {
  dateFormat?: "date" | "year";
  isFeed?: boolean;
  postLinkPrefix?: string;
  posts: PostListItem[];
  showFeatured?: boolean;
  wrapperClassName?: string;
}

export const PostLines = ({
  dateFormat,
  isFeed,
  postLinkPrefix = "",
  posts,
  showFeatured = true,
  wrapperClassName,
}: PostLinesProps) => (
  <div className={wrapperClassName}>
    {posts.map((post) => (
      <Link
        key={post._id}
        href={
          post.thumbnailLink
            ? post.thumbnailLink
            : `${postLinkPrefix}${post.slug}`
        }
        className="block"
      >
        <PostLine
          dateFormat={dateFormat}
          isFeatured={showFeatured && post.tags?.includes("featured")}
          isFeed={isFeed}
          post={post}
        />
      </Link>
    ))}
  </div>
);

export const PostsList = ({
  kind,
  sortBy,
  sortedPostsMap,
  wrapperClassName,
}: PostsListProps) => {
  const key = sortBy ?? kind;
  const posts = sortedPostsMap[key] as PostListItem[];

  // console.log("Rendering PostsList with:", key, posts);

  return <PostLines posts={posts} wrapperClassName={wrapperClassName} />;
};
