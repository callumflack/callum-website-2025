import {
  featuredWorkSlugs,
  featuredWritingSlugs,
} from "@/lib/posts/featured-posts";
import { filterFeaturedBySlugs } from "@/lib/posts/sorting";
import { allPosts, Post } from "content-collections";
import { HomePage } from "./(home)/home-page";

const getFeaturedProjects = (): Post[] => {
  return filterFeaturedBySlugs(allPosts, featuredWorkSlugs);
};

const getFeaturedWriting = (): Post[] => {
  return filterFeaturedBySlugs(allPosts, featuredWritingSlugs);
};

export default function Home() {
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
  const latestPost = sortedPosts[0];

  const projects = getFeaturedProjects();
  const writing = getFeaturedWriting();

  return (
    <HomePage latestPost={latestPost} projects={projects} writing={writing} />
  );
}
