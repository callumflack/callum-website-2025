import type { Post } from "content-collections";
import { GroupedPosts } from "@/types/content";
import { featuredSlugs } from "./featured-posts";

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

// Filter posts by featured slugs and sort them according to the order in featuredSlugs
export function filterFeaturedBySlugs(posts: Post[]): Post[] {
  // Filter posts to only include those in featuredSlugs
  const featured = posts.filter((post) => featuredSlugs.includes(post.slug));

  // Sort posts according to the order in featuredSlugs
  return featured.sort((a, b) => {
    return featuredSlugs.indexOf(a.slug) - featuredSlugs.indexOf(b.slug);
  });
}

// Filter posts by "featured" tag and sort by date (newest first)
export function filterFeaturedByTag(posts: Post[]): Post[] {
  return posts
    .filter((post) => post.tags?.includes("featured"))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
