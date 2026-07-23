"use client";

import { useMemo } from "react";
import { PostsList } from "@/components/post/list/posts-list";
import { PostsListBlock } from "@/components/post/list/posts-list-block";
import { sortSelectedPosts } from "@/lib/posts/sorting";
import { cn } from "@/lib/utils";
import type { SortedPostsMap, WritingIndexPostsData } from "@/types/content";
import { ListHeader } from "./list-header";
import { SortModeButton } from "./sort-button";
import { useIndexMode } from "./use-index-mode";

const writingViews = [
  { label: "Selected", value: "writing" },
  { label: "Chrono", value: "year" },
  { label: "Notes", value: "notes" },
  { label: "Shelf", value: "shelf" },
] as const;

type WritingView = (typeof writingViews)[number]["value"];
const writingViewValues = writingViews.map((view) => view.value);

export function WritingIndexPosts({ posts }: { posts: WritingIndexPostsData }) {
  const { mode: currentView, setMode: setView } = useIndexMode<WritingView>({
    allowedValues: writingViewValues,
    fallback: "writing",
    param: "sort",
  });
  const sortedPostsMap = useMemo<SortedPostsMap>(
    () => ({
      writing: sortSelectedPosts(posts.writing, "writing"),
      year: [...posts.writing].sort(
        (a, b) =>
          Number(b.date?.split("-")[0] || 0) -
          Number(a.date?.split("-")[0] || 0)
      ),
      notes: posts.notes,
      shelf: posts.shelf,
    }),
    [posts.notes, posts.shelf, posts.writing]
  );
  const showSelected = currentView === "writing";

  return (
    <main className="container" data-slot="WritingIndexPosts">
      <ListHeader ariaLabel="Writing views">
        {writingViews.map(({ label, value }) => (
          <SortModeButton
            initialSortBy="writing"
            key={value}
            onClick={() => setView(value)}
            searchParamsValue={currentView}
            sortBy={value}
          >
            {label}
          </SortModeButton>
        ))}
      </ListHeader>

      {showSelected ? (
        <PostsListBlock
          kind="writing"
          sortBy={currentView}
          sortedPostsMap={sortedPostsMap}
          wrapperClassName={cn("flex flex-col gap-w8 pt-w8 sm:gap-w6")}
        />
      ) : (
        <PostsList
          kind="writing"
          sortBy={currentView}
          sortedPostsMap={sortedPostsMap}
          wrapperClassName="space-y-0 pt-3"
        />
      )}
    </main>
  );
}
