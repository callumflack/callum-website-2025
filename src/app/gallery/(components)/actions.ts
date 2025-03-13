import { slugify } from "@/lib/utils";
import type { Post } from "content-collections";
import { ManualPost } from "./projects-manual";

/**
 * Server action to fetch projects asynchronously
 * This helps avoid Next.js serverless function issues by deferring the import
 */
export async function getGalleryProjects(): Promise<(Post | ManualPost)[]> {
  const { default: projects } = await import("./projects");
  return projects;
}

/**
 * Server action to fetch a specific project by its slug
 * Handles both projects with explicit slug properties and those that need slugs generated from titles
 */
export async function getGalleryProjectBySlug(
  slug: string
): Promise<Post | ManualPost | undefined> {
  const projects = await getGalleryProjects();

  return projects.find((project) => {
    // If project has its own slug property, use that
    if ("slug" in project && project.slug) {
      return project.slug === slug;
    }
    // Otherwise, generate slug from title
    return slugify(project.title) === slug;
  });
}
