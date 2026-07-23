import type { Post } from "content-collections";
import { GroupedPosts, PostListItem } from "@/types/content";
import { featuredWorkSlugs, featuredWritingSlugs } from "./featured-posts";

/*
 * Generic over the post shape so both full `Post`s (server) and slim
 * `PostListItem`s (client) flow through without casts.
 */

// Group posts by year
export function groupByYear<T extends PostListItem>(posts: T[]): GroupedPosts<T> {
  return posts.reduce((groups, post) => {
    const year = new Date(post.date).getFullYear().toString();
    groups[year] = [...(groups[year] || []), post];
    return groups;
  }, {} as GroupedPosts<T>);
}

// Group posts by topic (tag)
export function groupByTopic<T extends PostListItem>(
  posts: T[]
): GroupedPosts<T> {
  return posts.reduce((groups, post) => {
    if (!post.tags?.length) return groups;

    post.tags.forEach((tag) => {
      if (!tag) return;
      groups[tag] = [...(groups[tag] || []), post];
    });

    return groups;
  }, {} as GroupedPosts<T>);
}

// Sort posts alphabetically
export function sortAlphabetically<T extends PostListItem>(posts: T[]): T[] {
  return [...posts].sort((a, b) => a.title.localeCompare(b.title));
}

// Filter posts by featured slugs and sort them according to the order in specified slugs array
export function filterFeaturedBySlugs<T extends PostListItem>(
  posts: T[],
  slugsArray: readonly string[]
): T[] {
  const featured = posts.filter((post) => slugsArray.includes(post.slug));
  return featured.sort(
    (a, b) => slugsArray.indexOf(a.slug) - slugsArray.indexOf(b.slug)
  );
}

/*
 * Build the "Latest" feed: date-desc, minus excludes, with pinned slugs
 * forced to the top in pin-order, capped to `limit`.
 *
 * Used by the home page. Pinned posts that are excluded or missing are
 * silently dropped.
 */
export function getLatestWithPins(
  posts: Post[],
  options: {
    pinned: readonly string[];
    exclude: readonly string[];
    limit: number;
  }
): Post[] {
  const { pinned, exclude, limit } = options;

  const eligible = posts
    .filter((post) => !post.draft && !exclude.includes(post.slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pinnedPosts = pinned
    .map((slug) => eligible.find((post) => post.slug === slug))
    .filter(Boolean) as Post[];

  const rest = eligible.filter((post) => !pinned.includes(post.slug));

  return [...pinnedPosts, ...rest].slice(0, limit);
}

// Filter posts by "featured" tag and sort by date (newest first)
export function filterFeaturedByTag<T extends PostListItem>(posts: T[]): T[] {
  return posts
    .filter((post) => post.tags?.includes("featured"))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Sort posts for the "Selected" sort option (projects or writing)
// 1. First show posts from featured lists in their order
// 2. Then show any posts with "featured" tag that aren't already included
export function sortSelectedPosts<T extends PostListItem>(
  posts: T[],
  category: "projects" | "writing"
): T[] {
  // Get the appropriate featured slugs list based on category
  const featuredList =
    category === "projects" ? featuredWorkSlugs : featuredWritingSlugs;

  // First, get posts that match the featured list in their defined order
  const featuredListPosts = featuredList
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter(Boolean) as T[];

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
