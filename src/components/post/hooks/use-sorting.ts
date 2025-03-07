"use client";

import { useMemo } from "react";
import type { Post } from "content-collections";
import type { PostCategory, SortMethod, SortedPostsMap } from "@/types/content";
import {
  groupByYear,
  groupByTopic,
  sortAlphabetically,
  sortSelectedPosts,
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
          ? sortSelectedPosts(posts.projects || [], "projects")
          : posts.projects || [],
      writing:
        sortMethod === "writing"
          ? sortSelectedPosts(posts.writing || [], "writing")
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
