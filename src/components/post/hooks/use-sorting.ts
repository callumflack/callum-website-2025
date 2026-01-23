"use client";

import { useMemo } from "react";
import type { Post } from "content-collections";
import type { ListCategory, SortMethod, SortedPostsMap } from "@/types/content";
import {
  groupByYear,
  groupByTopic,
  sortAlphabetically,
  sortSelectedPosts,
} from "@/lib/posts/sorting";

export function useSortedPosts(
  posts: Record<ListCategory, Post[]>,
  kind: ListCategory,
  sortMethod: SortMethod,
  enableGroupedViews: boolean = true
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

    // Create grouped data on demand based on sort method - only if grouped views are enabled
    if (enableGroupedViews) {
      // Grouped views for years and topics only
      if (sortMethod === "year") {
        result.year = groupByYear(currentPosts);
      } else if (sortMethod === "topic") {
        result.topic = groupByTopic(currentPosts);
      }
    } else {
      // When grouped views are disabled, provide flat arrays instead
      if (sortMethod === "year") {
        // Just sort by year but keep flat
        result.year = [...currentPosts].sort(
          (a, b) =>
            Number(b.date?.split("-")[0] || 0) -
            Number(a.date?.split("-")[0] || 0)
        );
      } else if (sortMethod === "topic") {
        // Use alphabetical sort as fallback for topic view
        result.topic = sortAlphabetically(currentPosts);
      }
    }

    return result;
  }, [posts, kind, sortMethod, enableGroupedViews]);
}
