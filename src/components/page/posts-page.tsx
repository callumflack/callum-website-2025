"use client";

import { LinkWithArrow } from "@/components/elements";
import {
  PostsList,
  PostsListBlock,
  StyledSortButton,
  sortButtonStyle,
  useSortedPosts,
} from "@/components/post";
import type { PostCategory, SortMethod } from "@/lib/posts/types";
import type { Post } from "content-collections";
import { cx } from "cva";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { ListHeader } from "./list-header";

interface PostsPageProps {
  posts: Record<PostCategory, Post[]>;
  kind: PostCategory;
  initialSort: string;
}

export function PostsPage({ posts, kind, initialSort }: PostsPageProps) {
  const router = useRouter();
  const [currentSort, setCurrentSort] = useState<string>(initialSort);
  const [showGrid, setShowGrid] = useState(
    initialSort === kind ||
      initialSort === "projects" ||
      initialSort === "writing"
  );

  // Log received posts
  console.log("Posts page received posts:", {
    kind,
    projectsCount: posts.projects?.length || 0,
    writingCount: posts.writing?.length || 0,
  });

  const sortedPostsMap = useSortedPosts(
    posts,
    kind as PostCategory,
    currentSort as SortMethod
  );

  const sortBy = [kind, "year", "topic", "a-to-z"];

  const handleSortButtonClick = (sortKind: string) => {
    setCurrentSort(sortKind);
    router.push(`?sort=${sortKind}`, { scroll: false });

    if (sortKind === "projects" || sortKind === "writing") {
      setShowGrid((prev) => !prev);
    } else {
      setShowGrid(false);
    }
  };

  return (
    <main className={cx("pb-major relative container")}>
      <ListHeader
        className={cx("top-nav translate-y-px transform")}
        rhsElement={
          kind === "projects" && (
            <LinkWithArrow
              className={cx(sortButtonStyle, "text-solid pr-0")}
              href="/graphics"
              iconClassName="!translate-y-[-0.2em]"
            >
              GxIx
            </LinkWithArrow>
          )
        }
      >
        {sortBy.map((sort) => (
          <Fragment key={sort}>
            <StyledSortButton
              initialSortBy={kind}
              key={sort}
              onClick={() => handleSortButtonClick(sort)}
              searchParamsValue={currentSort}
              sortBy={sort}
            >
              {sort === "projects" || sort === "writing"
                ? " Selected"
                : sort.replace(/-/g, " ")}
            </StyledSortButton>
          </Fragment>
        ))}
      </ListHeader>

      {showGrid ? (
        <PostsListBlock
          kind={kind as PostCategory}
          sortBy={currentSort}
          sortedPostsMap={sortedPostsMap}
          wrapperClassName={cx("flex flex-col gap-w8 pt-w8")}
        />
      ) : (
        <PostsList
          kind={kind as PostCategory}
          sortBy={currentSort}
          sortedPostsMap={sortedPostsMap}
          wrapperClassName="pt-3 relative"
        />
      )}
    </main>
  );
}
