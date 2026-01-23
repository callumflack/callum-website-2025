// Central type definitions for content collections
// Shared between Next.js app and content-collections.ts

import type { Post } from "content-collections";

// Category definitions
export enum Category {
  WRITING = "writing",
  PROJECTS = "projects",
  NOTES = "notes",
  PAGE = "page",
}

// Client-safe types derived from Category enum
export type CategoryType = `${Category}`;
export type ListCategory = "projects" | "writing";

// Sorting methods specific to the UI
export type SortMethod =
  | "default"
  | "year"
  | "topic"
  | "a-to-z"
  | "projects"
  | "writing";

// Library type definitions
export enum PostType {
  POST = "post",
  PAGE = "page",
  LINK = "link",
  INDEX = "index",
}

export type PostTypeValue = `${PostType}`;

// Asset type
// OR NonNullable<Post["assets"]>[number]; for single source of truth?
export type Asset = {
  src: string;
  poster?: string;
  alt: string;
  aspect: string;
  dimensions?: {
    width: number;
    height: number;
    aspectRatioNumber: number;
  };
};

// Posts collection types
export type GroupedPosts = Record<string, Post[]>;

export interface SortedPostsMap {
  [key: string]: Post[] | GroupedPosts;
}

export interface ListPostsData {
  projects: Post[];
  writing: Post[];
}
