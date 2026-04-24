import { allPosts, Post } from "content-collections";
import { Category, ListCategory, ListPostsData } from "@/types/content";

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

export function getAllPostsChronological(): Post[] {
  return allPosts
    .filter(
      (p) =>
        !p.draft &&
        p.type !== "page" &&
        p.slug !== "the-work-and-team-im-after"
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
