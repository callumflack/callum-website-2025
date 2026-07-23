"use client";

import type { Post } from "content-collections";
import type { KeyboardEvent } from "react";
import { ListHeader, PostPage } from "@/components/page";
import { ListModeButton } from "@/components/page/sort-button";
import { PostLines } from "@/components/post";
import type { ViewMode } from "@/types/viewMode";
import { useIndexMode } from "./use-index-mode";

/* Used on log and topic pages */

interface FullOrIndexPostsProps {
  posts: Post[];
  topic?: string;
  initialShow?: ViewMode;
  listHeaderNode?: React.ReactNode;
}

/*
 * State model: the URL is the single source of truth. `show` is derived from
 * `?show=...` every render, and `showInFull` is derived from `show`. Click and
 * keyboard handlers only update the URL through `useIndexMode`; the next
 * render mounts the selected presentation and removes the other. This keeps
 * browser history, tab selection, and the visible panel in sync.
 */

export function FullOrIndexPosts({
  posts,
  topic,
  initialShow = "index",
  listHeaderNode,
}: FullOrIndexPostsProps) {
  const { mode: show, setMode: setShow } = useIndexMode({
    allowedValues: ["index", "full"],
    fallback: initialShow,
    param: "show",
  });
  const showInFull = show === "full";

  const moveToTab = (
    event: KeyboardEvent<HTMLButtonElement>,
    show: ViewMode,
    tabId: string
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    setShow(show);
    requestAnimationFrame(() => document.getElementById(tabId)?.focus());
  };

  const viewTabs = (
    <div aria-label="Choose a post view" className="flex" role="tablist">
      <ListModeButton
        aria-controls="full-or-index-panel-index"
        aria-selected={!showInFull}
        id="full-or-index-tab-index"
        isActive={!showInFull}
        onKeyDown={(event) =>
          moveToTab(event, "full", "full-or-index-tab-full")
        }
        onClick={() => setShow("index")}
        role="tab"
        tabIndex={showInFull ? -1 : 0}
      >
        Index
      </ListModeButton>
      <ListModeButton
        aria-controls="full-or-index-panel-full"
        aria-selected={showInFull}
        id="full-or-index-tab-full"
        isActive={showInFull}
        onKeyDown={(event) =>
          moveToTab(event, "index", "full-or-index-tab-index")
        }
        onClick={() => setShow("full")}
        role="tab"
        tabIndex={showInFull ? 0 : -1}
      >
        Full
      </ListModeButton>
    </div>
  );

  return (
    <>
      <ListHeader
        ariaLabel={topic ? "Topic views" : "Log views"}
        showContained
        rhsNode={listHeaderNode}
      >
        {viewTabs}
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
            <PostLines
              isFeed
              postLinkPrefix="/"
              posts={posts}
              showFeatured={false}
            />
          </main>
        ) : null}
      </div>
    </>
  );
}
