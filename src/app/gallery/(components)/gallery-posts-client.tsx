"use client";

import { BodyClassProvider } from "@/components/utils/body-class-provider";
import { cn } from "@/lib/utils";
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

  return (
    <BodyClassProvider
      condition={isActive}
      className={cn(
        // Style the list-header so that it has a background color
        // "bg-background-hover [&_[data-component=Nav]]:bg-background-hover",
        "[&_[data-component=ListHeader]>nav]:before:bg-background-hover"
      )}
    >
      <GalleryPosts
        initialSort={currentSort}
        kind={kind}
        posts={posts}
        isActive={isActive}
        setIsActive={setIsActive}
      />
    </BodyClassProvider>
  );
}
