"use client";

import { useState } from "react";
import { GalleryPosts } from "./gallery-posts";
import { Post } from "content-collections";

interface GalleryPostsClientProps {
  posts: Post[];
  kind: string;
}

export function GalleryPostsClient({ posts, kind }: GalleryPostsClientProps) {
  const [isActive, setIsActive] = useState(false);

  /*
   * `isActive` is a hover flag driven by onMouseEnter/Leave on each gallery
   * tile inside <GalleryPosts>. It's hoisted here so we can wrap the tree in
   * a page-level effect if we want to restyle ancestors on hover.
   *
   * Reference pattern — tint the list-header nav background whenever any
   * gallery tile is hovered:
   *
   *   import { BodyClassProvider } from "@/components/utils";
   *
   *   return (
   *     <BodyClassProvider
   *       condition={isActive}
   *       className="[&_[data-component=ListHeader]>nav]:before:bg-background-hover"
   *     >
   *       <GalleryPosts ... />
   *     </BodyClassProvider>
   *   );
   *
   * BodyClassProvider toggles the class on <body> via useEffect. Unused today;
   * kept wired as a seam for future page-level hover effects.
   */

  return (
    <GalleryPosts
      kind={kind}
      posts={posts}
      isActive={isActive}
      setIsActive={setIsActive}
    />
  );
}
