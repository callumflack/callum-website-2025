"use client";

import { useState } from "react";
import { GalleryPosts } from "./gallery-posts";
import { Post } from "content-collections";

interface GalleryPostsClientProps {
  posts: Post[];
  currentSort: string;
  kind: string;
}

export function GalleryPostsClient({
  posts,
  currentSort,
  kind,
}: GalleryPostsClientProps) {
  const [isActive, setIsActive] = useState(false);

  // If we later want to change the page bg on hover, wrap GalleryPosts like:
  // (This requires `"use client"` because BodyClassProvider uses effects.)
  // <BodyClassProvider
  //   condition={isActive}
  //   className={cn(
  //     // Style the list-header so that it has a background color
  //     // "bg-background-hover [&_[data-component=Nav]]:bg-background-hover",
  //     "[&_[data-component=ListHeader]>nav]:before:bg-background-hover"
  //   )}
  // >
  //   ...
  // </BodyClassProvider>

  return (
    <GalleryPosts
      initialSort={currentSort}
      kind={kind}
      posts={posts}
      isActive={isActive}
      setIsActive={setIsActive}
    />
  );
}
