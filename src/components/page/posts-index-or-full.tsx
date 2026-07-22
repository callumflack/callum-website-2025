"use client";

import type { Post } from "content-collections";
import { useRouter, useSearchParams } from "next/navigation";
import type { KeyboardEvent } from "react";
import { Link } from "@/components/atoms";
import { ListHeader, PostPage } from "@/components/page";
import { PostLine, sortButtonStyle } from "@/components/post";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/types/viewMode";

/* Used on log and topic pages */

interface FullOrIndexPostsProps {
  posts: Post[];
  topic?: string; // Make optional since feed page doesn't need it
  initialShow?: ViewMode;
  routePrefix: string; // Add route prefix for navigation
  listHeaderNode?: React.ReactNode; // only used in [topic] pages ATM
}

export function FullOrIndexPosts({
  posts,
  topic,
  initialShow = "index",
  routePrefix,
  listHeaderNode,
}: FullOrIndexPostsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive view mode from URL (source of truth), fallback to initialShow
  const showParam = searchParams.get("show") as ViewMode | null;
  const showInFull = showParam ? showParam === "full" : initialShow === "full";

  const updateShowMode = (show: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("show", show);
    const path = topic ? `${routePrefix}/${topic}` : routePrefix;
    router.push(`${path}?${params.toString()}`);
  };

  const moveToTab = (
    event: KeyboardEvent<HTMLButtonElement>,
    show: ViewMode,
    tabId: string
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    updateShowMode(show);
    requestAnimationFrame(() => document.getElementById(tabId)?.focus());
  };

  const viewTabs = (
    <div aria-label="Choose a post view" className="flex" role="tablist">
      <ViewTab
        controls="full-or-index-panel-index"
        isActive={!showInFull}
        label="Index"
        onKeyDown={(event) =>
          moveToTab(event, "full", "full-or-index-tab-full")
        }
        onSelect={() => {
          updateShowMode("index");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        tabId="full-or-index-tab-index"
      />
      <ViewTab
        controls="full-or-index-panel-full"
        isActive={showInFull}
        label="Full"
        onKeyDown={(event) =>
          moveToTab(event, "index", "full-or-index-tab-index")
        }
        onSelect={() => updateShowMode("full")}
        tabId="full-or-index-tab-full"
      />
    </div>
  );

  return (
    <>
      <ListHeader
        ariaLabel={topic ? "Topic views" : "Log views"}
        showContained
        rhsNode={listHeaderNode ? viewTabs : undefined}
      >
        {listHeaderNode ?? viewTabs}
      </ListHeader>

      <div
        aria-labelledby="full-or-index-tab-full"
        hidden={!showInFull}
        id="full-or-index-panel-full"
        data-slot="PostsIndexOrFull"
        role="tabpanel"
      >
        {showInFull ? (
          <main className="space-y-w10 pt-w8">
            {posts.map((post: Post) => (
              <div
                key={post.slug}
                // NB! This space MUST match PostPageInner
                className="Post space-y-w6 [&>header]:container"
              >
                <PostPage key={post.slug} post={post} theme="feed" />
                <div className="pt-w6">
                  <hr />
                </div>
              </div>
            ))}
          </main>
        ) : null}
      </div>

      <div
        aria-labelledby="full-or-index-tab-index"
        hidden={showInFull}
        id="full-or-index-panel-index"
        role="tabpanel"
      >
        {!showInFull ? (
          <main className="container pt-3">
            {posts.map((post: Post) => (
              <Link
                key={post._id}
                href={post.thumbnailLink ? post.thumbnailLink : `/${post.slug}`}
                className="block"
              >
                <PostLine
                  post={post}
                  // isFeatured={post.tags?.includes("featured")}
                  isFeatured={false}
                  isFeed
                />
              </Link>
            ))}
          </main>
        ) : null}
      </div>
    </>
  );
}

function ViewTab({
  controls,
  isActive,
  label,
  onKeyDown,
  onSelect,
  tabId,
}: {
  controls: string;
  isActive: boolean;
  label: string;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onSelect: () => void;
  tabId: string;
}) {
  return (
    <button
      aria-controls={controls}
      aria-selected={isActive}
      className={cn(
        sortButtonStyle,
        isActive ? "border-b-fill! text-fill" : "text-solid"
      )}
      id={tabId}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      role="tab"
      tabIndex={isActive ? 0 : -1}
      type="button"
    >
      {label}
    </button>
  );
}
