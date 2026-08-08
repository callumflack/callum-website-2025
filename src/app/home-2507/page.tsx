import {
  featuredWorkSlugs,
  featuredWritingSlugs,
} from "@/lib/posts/featured-posts";
import { filterFeaturedBySlugs } from "@/lib/posts/sorting";
import { allPosts, Post } from "content-collections";
import type { Metadata } from "next";
import { HomePage } from "./home-page";

/*
 * ARCHIVE — homepage as of 2025-08, lifted from src/app/page.tsx at fc686ad
 * (the ZoomCarousel era, live ~Apr 2025 → Feb 2026). Reachable at /home-2507
 * for reference; noindex, and absent from sitemap.ts. Its (home)/*
 * dependencies are frozen alongside it in this directory.
 */

export const metadata: Metadata = {
  title: "Home archive — 2025-08",
  robots: { index: false, follow: false },
};

const getFeaturedProjects = (): Post[] => {
  return filterFeaturedBySlugs(allPosts, featuredWorkSlugs);
};

const getFeaturedWriting = (): Post[] => {
  return filterFeaturedBySlugs(allPosts, featuredWritingSlugs);
};

export default function HomeArchive2507() {
  const filteredPosts = allPosts.filter(
    (post) =>
      // or post.category === about
      post.slug !== "the-work-and-team-im-after" &&
      post.slug !== "about" &&
      post.slug !== "letters"
  );

  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const latestPosts = sortedPosts.slice(0, 3);

  const projects = getFeaturedProjects();
  const writing = getFeaturedWriting();

  return (
    <HomePage latestPosts={latestPosts} projects={projects} writing={writing} />
  );
}
