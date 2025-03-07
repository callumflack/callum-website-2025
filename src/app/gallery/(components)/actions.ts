import { slugify } from "@/lib/utils";
import type { Project } from "./projects";

export async function getProjects(): Promise<Project[]> {
  const { default: projects } = await import("./projects");
  return projects;
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => slugify(project.title) === slug);
}
