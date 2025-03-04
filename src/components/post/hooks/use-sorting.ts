"use client";

import { useMemo } from "react";
import type { Post } from "content-collections";
import type {
  PostCategory,
  SortMethod,
  SortedPostsMap,
} from "@/lib/posts/types";
import {
  groupByYear,
  groupByTopic,
  sortAlphabetically,
  filterFeatured,
} from "@/lib/posts/sorting";

export function useSortedPosts(
  posts: Record<PostCategory, Post[]>,
  kind: PostCategory,
  sortMethod: SortMethod
): SortedPostsMap {
  return useMemo(() => {
    const currentPosts = posts[kind] || [];

    const result: SortedPostsMap = {
      [kind]: currentPosts,
      projects:
        sortMethod === "projects"
          ? filterFeatured(posts.projects || [])
          : posts.projects || [],
      writing:
        sortMethod === "writing"
          ? filterFeatured(posts.writing || [])
          : posts.writing || [],
      "a-to-z": sortAlphabetically(currentPosts),
    };

    // Create grouped data on demand based on sort method
    if (sortMethod === "year") {
      result.year = groupByYear(currentPosts);
    } else if (sortMethod === "topic") {
      result.topic = groupByTopic(currentPosts);
    }

    return result;
  }, [posts, kind, sortMethod]);
}
