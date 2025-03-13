"use client";

import {
  getDimensions,
  MediaFigure,
  mediaWrapperVariants,
  parseAspectRatio,
  Video,
} from "@/components/media";
import { ListHeader } from "@/components/page";
import { StyledSortButton } from "@/components/post";
import type { Post } from "content-collections";
import { cx } from "cva";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { ManualPost } from "./projects-manual";

/* A relative of FeaturedOrIndexPosts and FullOrIndexPosts */

// Type guard to check if a project is a ManualPost
function isManualPost(project: Post | ManualPost): project is ManualPost {
  return !("category" in project);
}

interface GalleryPostsProps {
  posts: (Post | ManualPost)[];
  kind: string;
  initialSort?: string; // ViewMode?;
}

export function GalleryPosts({
  posts,
  kind,
  initialSort = "index",
}: GalleryPostsProps) {
  const router = useRouter();
  const [currentSort, setCurrentSort] = useState<string>(initialSort);

  const SORT_BY = ["all", "interactions", "graphics"];

  const handleSortButtonClick = (sortKind: string) => {
    setCurrentSort(sortKind);
    router.push(`?sort=${sortKind}`, { scroll: false });
  };

  const getSortLabel = (sort: string): string => {
    if (sort === "projects" || sort === "writing") return " Selected";
    if (sort === "a-to-z") return "A-Z";
    if (sort === "year") return "Chrono";
    return sort.replace(/-/g, " ");
  };

  return (
    <main>
      <div className="container">
        <ListHeader>
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
      </div>

      <div
        className={cx(
          "pt-w12 px-inset relative z-2",
          "gap-x-inset gap-y-w12 grid grid-cols-2 min-[1800px]:!grid-cols-5 lg:grid-cols-3 xl:grid-cols-4"
        )}
      >
        {posts.map((post, index) => {
          // Skip if the post doesn't have assets
          if (!post.assets || post.assets.length === 0) return null;

          const { title, slug, assets } = post;

          const asset = assets[0];
          const isVideo = asset.src.endsWith(".mp4");

          let width: number;
          let height: number;
          let aspectRatio: number;

          if (typeof asset.aspect === "string" && asset.aspect.includes("-")) {
            [width, height] = asset.aspect.split("-").map(Number);
            aspectRatio = width / height;
          } else {
            // Fallback to the utility functions for other formats
            aspectRatio = parseAspectRatio(asset.aspect);
            const dimensions = getDimensions(aspectRatio);
            width = dimensions.width;
            height = dimensions.height;
          }

          const noBorder = isManualPost(post) ? post.noBorder || false : false;

          const isSquare = height / width >= 0.825 && height / width <= 1;
          const isPortrait = height > width;

          return (
            <MediaFigure
              key={slug}
              caption={title} // TODO: add date and project type?
              captionClassName=""
              // mt-auto
              className="flex flex-col items-center justify-end [&_figcaption]:w-full"
              figureIntent="inGrid"
              isPortrait={isPortrait}
              style={{
                aspectRatio: `${width}/${height}`,
              }}
            >
              {isVideo ? (
                <Video
                  key={asset.src}
                  aspect={aspectRatio}
                  className={cx(
                    mediaWrapperVariants({
                      border: !noBorder,
                    })
                  )}
                  poster={asset.poster || asset.src}
                  src={asset.src}
                />
              ) : (
                <Image
                  alt={asset.alt || title}
                  src={asset.src}
                  priority={index < 7}
                  height={height}
                  width={width}
                  sizes={"(min-width: 660px) 600px, 400px"}
                  style={{
                    aspectRatio: `${width}/${height}`,
                  }}
                  className={cx(
                    mediaWrapperVariants({
                      border: !noBorder,
                    }),
                    "focus-visible:outline-none"
                  )}
                />
              )}
            </MediaFigure>
          );
        })}
      </div>
    </main>
  );
}
