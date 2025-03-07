"use client";

import { Text } from "@/components/atoms";
import { PostPage, ListHeader } from "@/components/page";
import { Post } from "content-collections";
import { cx } from "cva";
import { useState } from "react";
import { sortButtonStyle } from "@/components/post/sort";

interface FeedPageProps {
  posts: Post[];
}

export function FeedPage({ posts }: FeedPageProps) {
  const [showInFull, setShowInFull] = useState(true);

  return (
    <>
      <div className="container">
        <ListHeader
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
            onClick={() => setShowInFull(!showInFull)}
            className={cx(
              sortButtonStyle,
              !showInFull ? "!border-b-fill text-fill" : "text-solid"
            )}
          >
            Index
          </button>
        </ListHeader>
      </div>

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
        <main className="container space-y-0 pt-3">
          {posts.map((post: Post) => (
            <div
              key={post.slug}
              id={post.slug}
              className={cx(
                "group py-w4 border-b-dark/[0.06] hover:border-b-dark/10 border-b"
              )}
            >
              <div className={cx("gap-w4 flex flex-wrap items-center")}>
                <Text as="h2" intent="heading" className="">
                  <a href={`/${post.slug}`} className="link-heading">
                    {post.title}
                  </a>
                </Text>
                <div className="flex-1"></div>
                <Text intent="meta" dim className="text-xs">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </div>
            </div>
          ))}
        </main>
      )}
    </>
  );
}
