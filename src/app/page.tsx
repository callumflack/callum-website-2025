import {
  featuredWorkSlugs,
  featuredWritingSlugs,
} from "@/lib/posts/featured-posts";
import { filterFeaturedBySlugs } from "@/lib/posts/sorting";
import { allPosts, Post } from "content-collections";
import { HomePage } from "./(home)/home-page";

const getFeaturedProjects = (): Post[] => {
  const visiblePosts = allPosts.filter((post) => !post.draft);
  return filterFeaturedBySlugs(visiblePosts, featuredWorkSlugs);
};

const getFeaturedWriting = (): Post[] => {
  const visiblePosts = allPosts.filter((post) => !post.draft);
  return filterFeaturedBySlugs(visiblePosts, featuredWritingSlugs);
};

export default function Home() {
  const pinnedLatestSlugs = ["ways-of-seeing-generative-ai"];
  const filteredPosts = allPosts.filter(
    (post) =>
      !post.draft &&
      // or post.category === about
      post.slug !== "the-work-and-team-im-after" &&
      post.slug !== "about" &&
      post.slug !== "letters"
  );

  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const pinnedLatestPosts = pinnedLatestSlugs
    .map((slug) => sortedPosts.find((post) => post.slug === slug))
    .filter(Boolean) as Post[];
  const remainingPosts = sortedPosts.filter(
    (post) => !pinnedLatestSlugs.includes(post.slug)
  );
  const latestPosts = [...pinnedLatestPosts, ...remainingPosts].slice(0, 3);

  const projects = getFeaturedProjects();
  const writing = getFeaturedWriting();

  return (
    <HomePage latestPosts={latestPosts} projects={projects} writing={writing} />
  );
}
