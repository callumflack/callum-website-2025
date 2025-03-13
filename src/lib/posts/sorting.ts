import type { Post } from "content-collections";
import { GroupedPosts } from "@/types/content";
import {
  featuredSlugs,
  featuredWorkSlugs,
  featuredWritingSlugs,
} from "./featured-posts";

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

// Filter posts by featured slugs and sort them according to the order in specified slugs array
export function filterFeaturedBySlugs(
  posts: Post[],
  slugsArray: string[] = featuredSlugs
): Post[] {
  // Filter posts to only include those in the specified slugs array
  const featured = posts.filter((post) => slugsArray.includes(post.slug));

  // Sort posts according to the order in the slugs array
  return featured.sort((a, b) => {
    return slugsArray.indexOf(a.slug) - slugsArray.indexOf(b.slug);
  });
}

// Filter posts by "featured" tag and sort by date (newest first)
export function filterFeaturedByTag(posts: Post[]): Post[] {
  return posts
    .filter((post) => post.tags?.includes("featured"))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Sort posts for the "Selected" sort option (projects or writing)
// 1. First show posts from featured lists in their order
// 2. Then show any posts with "featured" tag that aren't already included
export function sortSelectedPosts(
  posts: Post[],
  category: "projects" | "writing"
): Post[] {
  // Get the appropriate featured slugs list based on category
  const featuredList =
    category === "projects" ? featuredWorkSlugs : featuredWritingSlugs;

  // First, get posts that match the featured list in their defined order
  const featuredListPosts = featuredList
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter(Boolean) as Post[];

  // Get slugs of posts already included
  const includedSlugs = featuredListPosts.map((post) => post.slug);

  // Get posts with "featured" tag that aren't already included
  const featuredTagPosts = posts.filter(
    (post) =>
      post.tags?.includes("featured") && !includedSlugs.includes(post.slug)
  );

  // Combine both lists
  return [...featuredListPosts, ...featuredTagPosts];
}
