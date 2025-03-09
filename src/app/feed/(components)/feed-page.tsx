"use client";

import { Link } from "@/components/atoms";
import { ListHeader, PostPage } from "@/components/page";
import { PostLine } from "@/components/post/list/post-line";
import { sortButtonStyle } from "@/components/post/sort";
import { Post } from "content-collections";
import { cx } from "cva";
import { useState } from "react";

interface FeedPageProps {
  posts: Post[];
}

export function FeedPage({ posts }: FeedPageProps) {
  const [showInFull, setShowInFull] = useState(true);

  return (
    <>
      <ListHeader
        showContained
        // rhsNode={
        //   <div className="gap-w4 flex items-center">
        //     Up
        //   </div>
        // }
      >
        <button
          onClick={() => setShowInFull(!showInFull)}
          className={cx(
            sortButtonStyle,
            showInFull ? "!border-b-fill text-fill" : "text-solid"
          )}
        >
          Full
        </button>
        <button
          onClick={() => {
            setShowInFull(!showInFull);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={cx(
            sortButtonStyle,
            !showInFull ? "!border-b-fill text-fill" : "text-solid"
          )}
        >
          Index
        </button>
      </ListHeader>

      {showInFull ? (
        <main className="space-y-w10 pt-w8">
          {posts.map((post: Post) => (
            <div
              key={post.slug}
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
              href={post.thumbnailLink ? post.thumbnailLink : post.slug}
              className="block"
            >
              <PostLine
                post={post}
                isFeatured={post.tags?.includes("featured")}
                isFeed
              />
            </Link>
          ))}
        </main>
      )}
    </>
  );
}
