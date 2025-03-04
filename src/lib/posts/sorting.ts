import type { Post } from "content-collections";
import { GroupedPosts } from "./types";

// Group posts by year
export function groupByYear(posts: Post[]): GroupedPosts {
  return posts.reduce((groups, post) => {
    const year = new Date(post.date).getFullYear().toString();
    groups[year] = [...(groups[year] || []), post];
    return groups;
  }, {} as GroupedPosts);
}

// Group posts by topic (tag)
export function groupByTopic(posts: Post[]): GroupedPosts {
  return posts.reduce((groups, post) => {
    if (!post.tags?.length) return groups;

    post.tags.forEach((tag) => {
      if (!tag) return;
      groups[tag] = [...(groups[tag] || []), post];
    });

    return groups;
  }, {} as GroupedPosts);
}

// Sort posts alphabetically
export function sortAlphabetically(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => a.title.localeCompare(b.title));
}

// Filter posts by featured tag
export function filterFeatured(posts: Post[]): Post[] {
  return posts.filter((post) => post.tags?.includes("featured"));
}
