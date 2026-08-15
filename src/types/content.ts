// Central type definitions for content collections
// Shared between Next.js app and content-collections.ts

import type { Post } from "content-collections";

// Category definitions
export enum Category {
  WRITING = "writing",
  PROJECTS = "projects",
  NOTES = "notes",
  PAGE = "page",
  SHELF = "shelf",
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

/*
 * The slim shape list UIs actually render. Server pages map full `Post`s
 * through `toPostListItem` before handing them to client components so the
 * compiled MDX `content` bundle never lands in the flight payload. A full
 * `Post` is structurally assignable wherever a `PostListItem` is expected.
 */
export type PostListItem = Pick<
  Post,
  | "_id"
  | "slug"
  | "title"
  | "linkTitle"
  | "date"
  | "dateLabel"
  | "endDate"
  | "summary"
  | "category"
  | "tags"
  | "thumbnailLink"
  | "showAsNew"
  | "assets"
>;

// Posts collection types
export type GroupedPosts<T extends PostListItem = PostListItem> = Record<
  string,
  T[]
>;

export interface SortedPostsMap {
  [key: string]: PostListItem[] | GroupedPosts;
}

export interface ListPostsData {
  projects: Post[];
  writing: Post[];
}

export interface WritingIndexPostsData {
  notes: PostListItem[];
  shelf: PostListItem[];
  writing: PostListItem[];
}
