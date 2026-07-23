import { allPosts, type Post } from "content-collections";
import {
  Category,
  type ListCategory,
  type ListPostsData,
  type WritingIndexPostsData,
} from "@/types/content";

const categoryMap: Record<ListCategory, Category> = {
  projects: Category.PROJECTS,
  writing: Category.WRITING,
};

export function getShelfPosts(): Post[] {
  return allPosts
    .filter((p) => !p.draft && p.category === Category.SHELF)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPosts(category: ListCategory): Post[] {
  return allPosts.filter(
    (p) => !p.draft && p.category === categoryMap[category]
  );
}

export function getAllPosts(): ListPostsData {
  return {
    projects: allPosts.filter(
      (p) => !p.draft && p.category === categoryMap.projects
    ),
    writing: allPosts.filter(
      (p) => !p.draft && p.category === categoryMap.writing
    ),
  };
}

export function getWritingIndexPosts(): WritingIndexPostsData {
  const publishedPosts = allPosts.filter((post) => !post.draft);
  const newestFirst = (posts: Post[]) =>
    [...posts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  return {
    writing: publishedPosts.filter(
      (post) => post.category === Category.WRITING
    ),
    notes: newestFirst(
      publishedPosts.filter((post) => post.category === Category.NOTES)
    ),
    shelf: newestFirst(
      publishedPosts.filter((post) => post.category === Category.SHELF)
    ),
  };
}

export function getAllPostsChronological(): Post[] {
  return allPosts
    .filter(
      (p) =>
        !p.draft && p.type !== "page" && p.slug !== "the-work-and-team-im-after"
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByTopic(topic: string): Post[] {
  return allPosts
    .filter(
      (p) =>
        !p.draft &&
        p.type !== "page" &&
        p.slug !== "the-work-and-team-im-after" &&
        p.tags?.includes(topic)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
