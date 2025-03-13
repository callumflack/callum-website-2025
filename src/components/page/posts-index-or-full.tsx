"use client";

import { Button, Link } from "@/components/atoms";
import { ListHeader, PostPage } from "@/components/page";
import { PostLine } from "@/components/post/list/post-line";
import { EyeOpenIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { Post } from "content-collections";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ViewMode } from "@/types/viewMode";

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
  const showParam = (searchParams.get("show") as ViewMode) || initialShow;
  const [showInFull, setShowInFull] = useState(showParam === "full");

  const updateShowMode = (show: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("show", show);
    // Use the provided routePrefix for navigation
    const path = topic ? `${routePrefix}/${topic}` : routePrefix;
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <>
      <ListHeader
        showContained
        rhsNode={
          <div className="flex items-center gap-[2px]">
            <Button
              title="Full"
              variant="icon"
              onClick={() => {
                setShowInFull(true);
                updateShowMode("full");
              }}
              className={showInFull ? "bg-background-hover text-fill" : ""}
            >
              <EyeOpenIcon className="size-em" />
            </Button>
            <Button
              title="Index"
              variant="icon"
              onClick={() => {
                setShowInFull(false);
                updateShowMode("index");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={!showInFull ? "bg-background-hover text-fill" : ""}
            >
              <ListBulletIcon className="size-em" />
            </Button>
          </div>
        }
      >
        {listHeaderNode ? (
          listHeaderNode
        ) : (
          /* retain consistent height! */
          <div className="h-tab w-px">&nbsp;</div>
        )}
      </ListHeader>

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
      ) : (
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
      )}
    </>
  );
}
