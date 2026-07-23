"use client";

import type { Post } from "content-collections";
import { Fragment } from "react";
import { SortModeButton } from "@/components/page/sort-button";
import { PostsList, PostsListBlock, useSortedPosts } from "@/components/post";
import { cn } from "@/lib/utils";
import type { ListCategory, SortMethod } from "@/types/content";
import { ListHeader } from "./list-header";
import { useIndexMode } from "./use-index-mode";

/* Used on writing and work index pages */

interface FeaturedOrIndexPostsProps {
  posts: Record<ListCategory, Post[]>;
  kind: ListCategory;
}

/*
 * State model: the URL is the single source of truth. `currentSort` is
 * derived from `?sort=...` every render, and `showGrid` is derived from
 * `currentSort`. Click handlers only update the URL through `useIndexMode`;
 * the next render picks up the new sort. This keeps browser history and the
 * visible presentation in sync.
 */

export function FeaturedOrIndexPosts({
  posts,
  kind,
}: FeaturedOrIndexPostsProps) {
  const sortOptions = [kind, "year"] as const;
  const { mode: currentSort, setMode: setSort } = useIndexMode({
    allowedValues: sortOptions,
    fallback: kind,
    param: "sort",
  });
  const showGrid = currentSort === kind;

  const sortedPostsMap = useSortedPosts(
    posts,
    kind as ListCategory,
    currentSort as SortMethod,
    false
  );

  const getSortLabel = (sort: string): string => {
    if (sort === "projects" || sort === "writing") return " Selected";
    if (sort === "a-to-z") return "A-Z";
    if (sort === "year") return "Chrono";
    return sort.replace(/-/g, " ");
  };

  return (
    <main className="container" data-slot="PostsIndexOrFeatured">
      <ListHeader>
        {sortOptions.map((sort) => (
          <Fragment key={sort}>
            <SortModeButton
              initialSortBy={kind}
              key={sort}
              onClick={() => setSort(sort)}
              searchParamsValue={currentSort}
              sortBy={sort}
            >
              {getSortLabel(sort)}
            </SortModeButton>
          </Fragment>
        ))}
      </ListHeader>

      {showGrid ? (
        <PostsListBlock
          kind={kind as ListCategory}
          sortBy={currentSort}
          sortedPostsMap={sortedPostsMap}
          wrapperClassName={cn("flex flex-col gap-w8 sm:gap-w6 pt-w8")}
        />
      ) : (
        <PostsList
          kind={kind as ListCategory}
          sortBy={currentSort}
          sortedPostsMap={sortedPostsMap}
          wrapperClassName="pt-3 space-y-0"
        />
      )}
    </main>
  );
}
