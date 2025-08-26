"use client";

import { MediaFigure, mediaWrapperVariants, Video } from "@/components/media";
import {
  getAspectRatioCSS,
  getImageDimensions,
  isPortrait,
  isSquare,
  isVideoFile,
} from "@/components/media/media-utils";
import { ListHeader } from "@/components/page";
import { StyledSortButton } from "@/components/post";
import { MediaErrorBoundary } from "@/components/utils";
import { formatYear } from "@/lib/utils";
import type { Post } from "content-collections";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useMemo } from "react";
import { ManualPost } from "./projects-manual";
import { cn } from "@/lib/classes";

/* A relative of FeaturedOrIndexPosts and FullOrIndexPosts */

// Type guard to check if a project is a ManualPost
function isManualPost(project: Post | ManualPost): project is ManualPost {
  return !("category" in project);
}

// Define sort options as const tuple for type safety
const SORT_BY = ["all", "interactions", "graphics"] as const;
type SortOption = (typeof SORT_BY)[number];

interface GalleryPostsProps {
  posts: (Post | ManualPost)[];
  kind: string;
  initialSort?: string; // ViewMode?;
  setIsActive: (isActive: boolean) => void;
  isActive: boolean;
}

export function GalleryPosts({
  posts,
  kind,
  initialSort = "all",
  setIsActive,
  isActive,
}: GalleryPostsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive current sort from URL params, with validation and fallback
  const currentSort = useMemo(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam && SORT_BY.includes(sortParam as SortOption)) {
      return sortParam as SortOption;
    }
    return (initialSort as SortOption) || "all";
  }, [searchParams, initialSort]);

  // Derive filtered posts based on current sort
  const filteredPosts = useMemo(() => {
    if (currentSort === "all") {
      return posts;
    } else if (currentSort === "interactions") {
      // Filter for posts with video assets
      return posts.filter((post) => {
        if (!post.assets || post.assets.length === 0) return false;
        return isVideoFile(post.assets[0].src);
      });
    } else if (currentSort === "graphics") {
      // Filter for posts without video assets
      return posts.filter((post) => {
        if (!post.assets || post.assets.length === 0) return false;
        return !isVideoFile(post.assets[0].src);
      });
    }
    return posts;
  }, [currentSort, posts]);

  const handleSortButtonClick = (sortKind: string) => {
    router.push(`?sort=${sortKind}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Process posts into rows before rendering
  const postsInRows = useMemo(() => {
    if (!filteredPosts.length) return [];

    // Group posts into rows of 3
    const rows = [];
    for (let i = 0; i < filteredPosts.length; i += 3) {
      const row = filteredPosts.slice(i, i + 3);
      rows.push(row);
    }

    // For each row, determine if any item should be expanded
    return rows.map((row) => {
      // Only consider expansion for complete rows of 3
      const isCompleteRow = row.length === 3;

      // Find first non-portrait item if it exists
      const expandableIndex = isCompleteRow
        ? row.findIndex(
            (post) =>
              post.assets &&
              post.assets.length > 0 &&
              !isPortrait(post.assets[0].aspect) &&
              !isSquare(post.assets[0].aspect)
          )
        : -1;

      // Mark the item to be expanded
      return row.map((post, idx) => ({
        post,
        expanded: expandableIndex === idx,
      }));
    });
  }, [filteredPosts]);

  return (
    <>
      <ListHeader showContained>
        {SORT_BY.map((sort) => (
          <Fragment key={sort}>
            <StyledSortButton
              initialSortBy={kind}
              onClick={() => handleSortButtonClick(sort)}
              searchParamsValue={currentSort}
              sortBy={sort}
            >
              {sort}
            </StyledSortButton>
          </Fragment>
        ))}
      </ListHeader>

      <div
        data-slot="GalleryPosts"
        className={cn(
          "relative z-9",
          "pt-w12 px-inset",
          "grid justify-center",
          "gap-y-w8 gap-x-3",
          "grid-cols-36",
          "group/gallery" // Unused hover effect - see globals.css
        )}
      >
        {postsInRows.flat().map(({ post, expanded }, index) => {
          if (!post.assets || post.assets.length === 0) return null;

          console.log(post);

          const { title, slug, assets, date } = post;
          const asset = assets[0];
          const { width, height } = getImageDimensions(asset.aspect);
          const isVideo = isVideoFile(asset.src);
          const isImageSquare = isSquare(asset.aspect);
          const isImagePortrait = !isImageSquare && isPortrait(asset.aspect);
          const noBorder = isManualPost(post) ? post.noBorder || false : false;

          return (
            <div
              data-active={isActive}
              key={`${title}-${index}`}
              onMouseEnter={() => setIsActive(true)}
              onMouseLeave={() => setIsActive(false)}
              className={cn(
                expanded
                  ? "col-span-24 lg:col-span-18 2xl:col-span-12"
                  : "col-span-12 lg:col-span-9 2xl:col-span-6"
              )}
            >
              <MediaFigure
                caption={
                  slug ? (
                    <Link
                      href={`/${slug}`}
                      className="link flex items-center gap-1.5 no-underline"
                    >
                      <Caption title={title} date={date} />
                      {/* <hr className="hr-vertical h-[12px] border-transparent" />
                      <span className="flex items-center gap-0.5">
                        View
                        <ArrowRightIcon className="size-em translate-y-[0.05em] transform" />
                      </span> */}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Caption title={title} date={date} />
                    </div>
                  )
                }
                className={cn(
                  isImageSquare ? "isSquare" : "",
                  "[&_figcaption]:w-full",
                  "flex flex-col items-center justify-start"
                  // Required for hover effect - see globals.css
                  // "gallery-item transition-[filter] duration-300"
                )}
                captionClassName=""
                figureIntent="inGrid"
                isPortrait={isImagePortrait}
                style={{
                  aspectRatio: getAspectRatioCSS(asset.aspect),
                }}
              >
                <MediaErrorBoundary>
                  {isVideo ? (
                    <Video
                      key={asset.src}
                      aspect={asset.aspect}
                      className={cn(
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
                        aspectRatio: getAspectRatioCSS(asset.aspect),
                      }}
                      className={cn(
                        mediaWrapperVariants({
                          border: !noBorder,
                        }),
                        "focus-visible:outline-none"
                      )}
                    />
                  )}
                </MediaErrorBoundary>
              </MediaFigure>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* Duplicated from Slider.tsx */
export const Caption = ({ title, date }: { title: string; date: string }) => {
  return (
    <>
      <span>{title}</span>
      <hr className="hr-vertical border-border-hover h-[12px]" />
      <span>{formatYear(date)}</span>
    </>
  );
};
