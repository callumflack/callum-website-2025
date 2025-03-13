"use client";

import { LinkWithArrow } from "@/components/elements";
import {
  PostsList,
  PostsListBlock,
  StyledSortButton,
  sortButtonStyle,
  useSortedPosts,
} from "@/components/post";
import { PostsListGrouped } from "@/components/post/list/posts-list-grouped";
import type { GroupedPosts, PostCategory, SortMethod } from "@/types/content";
import type { Post } from "content-collections";
import { cx } from "cva";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { ListHeader } from "./list-header";

/* Used on writing and work index pages */

// Explicitly defines which sort types should display as grouped
const GROUPED_SORT_TYPES = new Set(["year", "topic"]);

// Flag to enable/disable grouped views
const ENABLE_GROUPED_VIEWS = false;

// Optional: For more configurability
type DisplayMode = "flat" | "grouped" | "grid";

const SORT_DISPLAY_MODES: Record<string, DisplayMode> = {
  year: "grouped",
  topic: "grouped",
  latest: "flat",
  "a-to-z": "flat",
  projects: "grid",
  writing: "grid",
};

interface FeaturedOrIndexPostsProps {
  posts: Record<PostCategory, Post[]>;
  kind: PostCategory;
  initialSort: string;
}

export function FeaturedOrIndexPosts({
  posts,
  kind,
  initialSort,
}: FeaturedOrIndexPostsProps) {
  const router = useRouter();
  const [currentSort, setCurrentSort] = useState<string>(initialSort);

  // Use the configuration to determine display mode
  const [showGrid, setShowGrid] = useState(
    SORT_DISPLAY_MODES[initialSort] === "grid" || initialSort === kind
  );

  const sortedPostsMap = useSortedPosts(
    posts,
    kind as PostCategory,
    currentSort as SortMethod,
    ENABLE_GROUPED_VIEWS
  );

  // "topic" + "a-to-z" also available
  const SORT_BY = [kind, "year"];

  const handleSortButtonClick = (sortKind: string) => {
    setCurrentSort(sortKind);
    router.push(`?sort=${sortKind}`, { scroll: false });

    if (sortKind === "projects" || sortKind === "writing") {
      setShowGrid((prev) => !prev);
    } else {
      setShowGrid(false);
    }
  };

  const getSortLabel = (sort: string): string => {
    if (sort === "projects" || sort === "writing") return " Selected";
    if (sort === "a-to-z") return "A-Z";
    if (sort === "year") return "Chrono";
    return sort.replace(/-/g, " ");
  };

  return (
    <main className="container">
      <ListHeader
        rhsNode={
          kind === "projects" && (
            <LinkWithArrow
              className={cx(
                sortButtonStyle,
                "text-solid pr-0 normal-case opacity-0"
              )}
              href="/gallery"
              iconClassName="!translate-y-[-0.2em]"
            >
              Just show me
            </LinkWithArrow>
          )
        }
      >
        {SORT_BY.map((sort) => (
          <Fragment key={sort}>
            <StyledSortButton
              initialSortBy={kind}
              key={sort}
              onClick={() => handleSortButtonClick(sort)}
              searchParamsValue={currentSort}
              sortBy={sort}
            >
              {getSortLabel(sort)}
            </StyledSortButton>
          </Fragment>
        ))}
      </ListHeader>

      {showGrid ? (
        <PostsListBlock
          kind={kind as PostCategory}
          sortBy={currentSort}
          sortedPostsMap={sortedPostsMap}
          wrapperClassName={cx("flex flex-col gap-w6 pt-w8")}
        />
      ) : GROUPED_SORT_TYPES.has(currentSort) && ENABLE_GROUPED_VIEWS ? (
        <PostsListGrouped
          groupedPosts={sortedPostsMap[currentSort] as GroupedPosts}
        />
      ) : (
        <PostsList
          kind={kind as PostCategory}
          sortBy={currentSort}
          sortedPostsMap={sortedPostsMap}
          wrapperClassName="pt-3 space-y-0"
        />
      )}
    </main>
  );
}
