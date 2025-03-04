// Types only - safe to import anywhere
import type { Post } from "content-collections";

/*
  You actually can extract the category type from Post, but it loses its connection to the original enum:

  ```typescript
  // This works but gives you a union type, not the enum
  type ExtractedCategory = Post["category"];
  // Result is "writing" | "projects" | "library" | "home" | "about" | "content" | "note"
  ```

  The problem is that this extracted type becomes just string literals without the enum's structure and benefits.

  Content Collections generates types based on Zod schemas, which convert enums to union types during type generation. The original enum structure (with its values, properties, and type-checking benefits) isn't preserved in the generated types.

  This is why duplicating the Category enum/type makes sense - you maintain the structured type information that gets lost in the Content Collections type generation process.
*/

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
