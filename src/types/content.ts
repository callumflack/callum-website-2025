// Central type definitions for content collections
// Shared between Next.js app and content-collections.ts

import type { Post } from "content-collections";

// Category definitions
export enum Category {
  WRITING = "writing",
  PROJECTS = "projects",
  LIBRARY = "library",
  HOME = "home",
  ABOUT = "about",
  CONTENT = "content",
  NOTE = "note",
}

// Client-safe types derived from Category enum
export type CategoryType = `${Category}`;
export type PostCategory = "projects" | "writing";

// Sorting methods specific to the UI
export type SortMethod =
  | "default"
  | "year"
  | "topic"
  | "a-to-z"
  | "projects"
  | "writing";

// Library type definitions
export enum LibraryType {
  SUPERSET = "superset",
  TOPIC = "topic",
  YEAR = "year",
  POST = "post",
  HIDE = "hide",
}

export type LibraryTypeValue = `${LibraryType}`;

// Asset type
export type Asset = {
  src: string;
  poster?: string;
  alt: string;
  aspect: string;
};

// Posts collection types
export type GroupedPosts = Record<string, Post[]>;

export interface SortedPostsMap {
  [key: string]: Post[] | GroupedPosts;
}

export interface PostsData {
  projects: Post[];
  writing: Post[];
}
