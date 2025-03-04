"use server";

import { allPosts, Post } from "content-collections";
import { Category, PostCategory, PostsData } from "./types";

// Map from string literals to enum values
const categoryMap: Record<PostCategory, Category> = {
  projects: Category.PROJECTS,
  writing: Category.WRITING,
};

export async function getPosts(category: PostCategory): Promise<Post[]> {
  // Do this within client components when you want to mark specific functions as server actions
  // "use server";

  return allPosts.filter(
    (p) => !p.draft && p.category === categoryMap[category]
  );
}

export async function getAllPosts(): Promise<PostsData> {
  return {
    projects: allPosts.filter(
      (p) => !p.draft && p.category === categoryMap.projects
    ),
    writing: allPosts.filter(
      (p) => !p.draft && p.category === categoryMap.writing
    ),
  };
}
