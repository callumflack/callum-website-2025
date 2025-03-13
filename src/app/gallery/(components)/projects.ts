import { sortSelectedPosts } from "@/lib/posts/sorting";
import { Category } from "@/types/content";
import { allPosts, Post } from "content-collections";
import { ManualPost, manualProjects } from "./projects-manual";

const getFeaturedProjects = (): Post[] => {
  const projectPosts = allPosts.filter((p) => p.category === Category.PROJECTS);
  return sortSelectedPosts(projectPosts, "projects");
};

// Combine featured posts + manual projects
// Ensure no duplicates by checking titles
const projects: (Post | ManualPost)[] = [
  ...getFeaturedProjects().filter(
    (post) => post.assets && post.assets.length > 0
  ),
  ...manualProjects.filter(
    (manual) =>
      !getFeaturedProjects().some((featured) => featured.title === manual.title)
  ),
];

export default projects;
