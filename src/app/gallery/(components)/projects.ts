import { sortSelectedPosts } from "@/lib/posts/sorting";
import { Category } from "@/types/content";
import { allPosts, Post } from "content-collections";
import { ManualPost, manualProjects } from "./projects-manual";

const getFeaturedProjects = (): Post[] => {
  const projectPosts = allPosts.filter((p) => p.category === Category.PROJECTS);
  return sortSelectedPosts(projectPosts, "projects");
};

// Fisher-Yates shuffle algorithm to randomize array order
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Combine featured posts + manual projects with filtering logic
const getCombinedProjects = (): (Post | ManualPost)[] => {
  const featuredWithAssets = getFeaturedProjects().filter(
    (post) => post.assets && post.assets.length > 0
  );

  const nonDuplicateManuals = manualProjects.filter(
    (manual) =>
      !getFeaturedProjects().some((featured) => featured.title === manual.title)
  );

  return shuffleArray([...featuredWithAssets, ...nonDuplicateManuals]);
};

const projects = getCombinedProjects();

export default projects;
