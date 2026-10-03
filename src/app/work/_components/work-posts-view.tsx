import type { Post } from "content-collections";
import { Link } from "@/components/atoms/next-link";
import { isVideoFile } from "@/components/media/media-utils";
import { PostBlock } from "@/components/post/list/post-block";
import { PostLines } from "@/components/post/list/posts-list";
import { getPosts, toPostListItem } from "@/lib/posts/actions";
import { sortSelectedPosts } from "@/lib/posts/sorting";
import type { WorkMode } from "./work-mode";

export function WorkPostsView({ mode }: { mode: WorkMode }) {
  switch (mode) {
    case "year":
      return (
        <div className="container">
          <PostLines
            posts={sortChronologically(getPosts("projects")).map(
              toPostListItem
            )}
            wrapperClassName="space-y-0 pt-3"
          />
        </div>
      );
    case "projects":
      return (
        <div
          className="gap-w8 pt-w8 sm:gap-w6 container flex flex-col"
          data-component="WorkSelectedPosts"
        >
          {sortSelectedPosts(getPosts("projects"), "projects")
            .map((post) => ({
              ...toPostListItem(post),
              assets: post.assets?.flatMap((asset) =>
                isVideoFile(asset.src)
                  ? asset.poster
                    ? [{ ...asset, src: asset.poster }]
                    : []
                  : [asset]
              ),
            }))
            .map((post, index) => (
              <Link href={post.thumbnailLink ?? `/${post.slug}`} key={post._id}>
                <PostBlock post={post} priority={index < 4} />
              </Link>
            ))}
        </div>
      );
    default: {
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }
}

function sortChronologically(posts: Post[]): Post[] {
  return posts.toSorted(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
