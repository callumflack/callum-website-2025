"use server";

// import "server-only";
import { allPosts, Post } from "content-collections";
import { Category, PostCategory, PostsData } from "./types";

// Mapping from our string literals to the enum values
const categoryMap: Record<PostCategory, Category> = {
  projects: Category.PROJECTS,
  writing: Category.WRITING,
};

export async function getPosts(category: PostCategory): Promise<Post[]> {
  "use server";

  return allPosts.filter(
    (p) => !p.draft && p.category === categoryMap[category]
  );
}

export async function getAllPosts(): Promise<PostsData> {
  "use server";

  return {
    projects: allPosts.filter(
      (p) => !p.draft && p.category === categoryMap.projects
    ),
    writing: allPosts.filter(
      (p) => !p.draft && p.category === categoryMap.writing
    ),
  };
}
