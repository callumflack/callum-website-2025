// Types only - safe to import anywhere
import type { Post } from "content-collections";

// Use string literals for client-safe types
export type PostCategory = "projects" | "writing";
export type SortMethod =
  | "default"
  | "year"
  | "topic"
  | "a-to-z"
  | "projects"
  | "writing";

// Duplicated Category enum values as string constants for client usage
// String literals for types and client components
export const CATEGORY = {
  PROJECTS: "projects",
  WRITING: "writing",
  LIBRARY: "library",
  HOME: "home",
  ABOUT: "about",
  CONTENT: "content",
  NOTE: "note",
} as const;

// Duplicated Category enum for server filtering
// Enum values for comparisons (strict equality checks)
export enum Category {
  WRITING = "writing",
  PROJECTS = "projects",
  LIBRARY = "library",
  HOME = "home",
  ABOUT = "about",
  CONTENT = "content",
  NOTE = "note",
}

export type GroupedPosts = Record<string, Post[]>;

export interface SortedPostsMap {
  [key: string]: Post[] | GroupedPosts;
}

export interface PostsData {
  projects: Post[];
  writing: Post[];
}
