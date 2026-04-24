"use client";

import { PostsList, StyledSortButton } from "@/components/post";
import { ListHeader } from "@/components/page/list-header";
import type { Post } from "content-collections";

interface ShelfPostsProps {
  posts: Post[];
}

export function ShelfPosts({ posts }: ShelfPostsProps) {
  const sortedPostsMap = { year: posts };

  return (
    <main className="container">
      <ListHeader>
        <StyledSortButton
          initialSortBy="year"
          onClick={() => {}}
          searchParamsValue="year"
          sortBy="year"
        >
          Chrono
        </StyledSortButton>
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
