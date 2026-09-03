import { allPosts, type Post } from "content-collections";
import {
  Category,
  type ListCategory,
  type ListPostsData,
  type PostListItem,
  type WritingIndexPostsData,
} from "@/types/content";

const categoryMap: Record<ListCategory, Category> = {
  projects: Category.PROJECTS,
  writing: Category.WRITING,
};

/*
 * Content Collections watch can emit the same file twice after a rename
 * (same `_id` / slug, stale title). Indexes map the full array, so a ghost
 * row shows up. Keep the first occurrence.
 */
function uniqueById(posts: readonly Post[]): Post[] {
  const seen = new Set<string>();
  const unique: Post[] = [];
  for (const post of posts) {
    if (seen.has(post._id)) continue;
    seen.add(post._id);
    unique.push(post);
  }
  return unique;
}

const uniquePosts = uniqueById(allPosts);

/*
 * The single draft gate for route surfaces (pages, sitemap, feed, posts.json).
 * `draft: true` posts stay fully out of production; in development they still
 * render at their URL for preview.
 */
export function getPublishedPosts(): Post[] {
  return uniquePosts.filter((post) => !post.draft);
}

export function isPubliclyVisible(post: Post): boolean {
  return !post.draft || process.env.NODE_ENV !== "production";
}

/*
 * Explicit pick (not a rest-spread omit) so nothing heavy — `content` above
 * all — can leak into a client component's serialized props by accident.
 */
export function toPostListItem(post: Post): PostListItem {
  return {
    _id: post._id,
    slug: post.slug,
    title: post.title,
    linkTitle: post.linkTitle,
    date: post.date,
    dateLabel: post.dateLabel,
    endDate: post.endDate,
    summary: post.summary,
    category: post.category,
    tags: post.tags,
    thumbnailLink: post.thumbnailLink,
    thumbnailText: post.thumbnailText,
    showAsNew: post.showAsNew,
    assets: post.assets,
  };
}

export function getShelfPosts(): PostListItem[] {
  return uniquePosts
    .filter((p) => !p.draft && p.category === Category.SHELF)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(toPostListItem);
}

export function getPosts(category: ListCategory): Post[] {
  return uniquePosts.filter(
    (p) => !p.draft && p.category === categoryMap[category]
  );
}

export function getAllPosts(): ListPostsData {
  return {
    projects: uniquePosts.filter(
      (p) => !p.draft && p.category === categoryMap.projects
    ),
    writing: uniquePosts.filter(
      (p) => !p.draft && p.category === categoryMap.writing
    ),
  };
}

export function getWritingIndexPosts(): WritingIndexPostsData {
  const publishedPosts = uniquePosts.filter((post) => !post.draft);
  const newestFirst = (posts: Post[]) =>
    [...posts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  return {
    writing: publishedPosts
      .filter((post) => post.category === Category.WRITING)
      .map(toPostListItem),
    notes: newestFirst(
      publishedPosts.filter((post) => post.category === Category.NOTES)
    ).map(toPostListItem),
    shelf: newestFirst(
      publishedPosts.filter((post) => post.category === Category.SHELF)
    ).map(toPostListItem),
  };
}

export function getAllPostsChronological(): Post[] {
  return uniquePosts
    .filter(
      (p) =>
        !p.draft && p.type !== "page" && p.slug !== "the-work-and-team-im-after"
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByTopic(topic: string): Post[] {
  return uniquePosts
    .filter(
      (p) =>
        !p.draft &&
        p.type !== "page" &&
        p.slug !== "the-work-and-team-im-after" &&
        p.tags?.includes(topic)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
