import type { Post } from "content-collections";
import { Link } from "@/components/atoms/next-link";
import { PostBlock } from "@/components/post/list/post-block";
import { PostLines } from "@/components/post/list/posts-list";
import { getPosts, toPostListItem } from "@/lib/posts/actions";
import { sortSelectedPosts } from "@/lib/posts/sorting";
import type { WorkMode } from "./work-mode";

export function WorkPostsView({ mode }: { mode: WorkMode }) {
  const projects = getPosts("projects");
  const posts =
    mode === "projects"
      ? sortSelectedPosts(projects, "projects").map(toPostListItem)
      : sortChronologically(projects).map(toPostListItem);

  if (mode === "year") {
    return (
      <div className="container">
        <PostLines posts={posts} wrapperClassName="space-y-0 pt-3" />
      </div>
    );
  }

  return (
    <div
      className="gap-w8 pt-w8 sm:gap-w6 container flex flex-col"
      data-component="WorkSelectedPosts"
    >
      {posts.map((post, index) => (
        <Link
          href={post.thumbnailLink ?? `/${post.slug}`}
          key={post._id}
        >
          <PostBlock post={post} priority={index < 4} />
        </Link>
      ))}
    </div>
  );
}

function sortChronologically(posts: Post[]): Post[] {
  return posts.toSorted(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
