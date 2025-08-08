"use server";

import { allPosts, Post } from "content-collections";
import { Category, PostCategory, PostsData } from "@/types/content";

// Map from string literals to enum values
const categoryMap: Record<PostCategory, Category> = {
  projects: Category.PROJECTS,
  writing: Category.WRITING,
};

export async function getPosts(category: PostCategory): Promise<Post[]> {
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

// filter ut "about" + "the-work-and-team-im-after"
export async function getAllPostsChronological(): Promise<Post[]> {
  return allPosts
    .filter(
      (p) =>
        !p.draft &&
        p.category !== Category.ABOUT &&
        p.category !== Category.CONTENT &&
        p.slug !== "the-work-and-team-im-after"
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostsByTopic(topic: string): Promise<Post[]> {
  return allPosts
    .filter(
      (p) =>
        !p.draft &&
        p.category !== Category.ABOUT &&
        p.category !== Category.CONTENT &&
        p.slug !== "the-work-and-team-im-after" &&
        p.tags?.includes(topic)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
