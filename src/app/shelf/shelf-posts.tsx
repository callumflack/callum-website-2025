"use client";

import { ListHeader } from "@/components/page/list-header";
import { PostsList, SortModeButton } from "@/components/post";
import type { PostListItem } from "@/types/content";

interface ShelfPostsProps {
  posts: PostListItem[];
}

export function ShelfPosts({ posts }: ShelfPostsProps) {
  const sortedPostsMap = { year: posts };

  return (
    <main className="container">
      <ListHeader>
        <SortModeButton
          initialSortBy="year"
          onClick={() => {}}
          searchParamsValue="year"
          sortBy="year"
        >
          Chrono
        </SortModeButton>
      </ListHeader>

      <PostsList
        kind={"writing" as const}
        sortBy="year"
        sortedPostsMap={sortedPostsMap}
        wrapperClassName="pt-3 space-y-0"
      />
    </main>
  );
}
