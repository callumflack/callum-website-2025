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
import type { Post } from "content-collections";
import { cx } from "cva";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
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
  const [currentSort, setCurrentSort] = useState<string>(initialSort);
  const [filteredPosts, setFilteredPosts] =
    useState<(Post | ManualPost)[]>(posts);

  const SORT_BY = useMemo(() => ["all", "interactions", "graphics"], []);

  useEffect(() => {
    // Filter posts based on the current sort
    if (currentSort === "all") {
      setFilteredPosts(posts);
    } else if (currentSort === "interactions") {
      // Filter for posts with video assets
      setFilteredPosts(
        posts.filter((post) => {
          if (!post.assets || post.assets.length === 0) return false;
          return isVideoFile(post.assets[0].src);
        })
      );
    } else if (currentSort === "graphics") {
      // Filter for posts without video assets
      setFilteredPosts(
        posts.filter((post) => {
          if (!post.assets || post.assets.length === 0) return false;
          return !isVideoFile(post.assets[0].src);
        })
      );
    }
  }, [currentSort, posts]);

  // Sync with URL params on mount
  useEffect(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam && SORT_BY.includes(sortParam)) {
      setCurrentSort(sortParam);
    }
  }, [searchParams, SORT_BY]);

  const handleSortButtonClick = (sortKind: string) => {
    setCurrentSort(sortKind);
    router.push(`?sort=${sortKind}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        className={cx(
          // place above container pseudo-borders
          "relative z-9",
          "pt-w12 px-inset",
          "grid justify-center",
          // "auto-cols-max grid-flow-row",
          // "gap-x-inset gap-y-w12",
          "gap-y-inset gap-x-3",
          "grid-cols-24"
          // min-[1800px]:!grid-cols-5
          // "grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
          // "grid-cols-[minmax(500px,_3fr)]"
        )}
        style={
          {
            // https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/
            // gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          }
        }
      >
        {filteredPosts.map((post, index) => {
          if (!post.assets || post.assets.length === 0) return null;

          const { title, slug, assets } = post;

          const asset = assets[0];
          const { width, height } = getImageDimensions(asset.aspect);
          const isVideo = isVideoFile(asset.src);
          const isImageSquare = isSquare(asset.aspect);
          const isImagePortrait = !isImageSquare && isPortrait(asset.aspect);
          const noBorder = isManualPost(post) ? post.noBorder || false : false;

          // First, group items into chunks of 3
          const itemsInGroups = [];
          for (let i = 0; i < posts.length; i += 3) {
            itemsInGroups.push(posts.slice(i, i + 3));
          }

          return (
            <div
              data-active={isActive}
              key={`${slug}-${index}`}
              onMouseEnter={() => setIsActive(true)}
              onMouseLeave={() => setIsActive(false)}
              className={cx("col-span-6")}
            >
              <MediaFigure
                key={`${slug}-${index}`}
                caption={title} // TODO: add date and project type?
                captionClassName=""
                className={cx(
                  isImageSquare ? "isSquare" : "",
                  "[&_figcaption]:w-full",
                  "grayscale hover:grayscale-0",
                  "flex flex-col items-center justify-start",
                  // "justify-self-center"
                  "col-span-6"
                  // isImagePortrait ? "col-span-5" : "col-span-8"
                  // isImagePortrait ? "!px-w20" : "",
                  // isImageSquare ? "isSquare !px-w12" : ""
                  // isImagePortrait ? "!w-[50%]" : "",
                  // isImageSquare ? "!w-[60%]" : ""
                )}
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
                        aspectRatio: getAspectRatioCSS(asset.aspect),
                      }}
                      className={cx(
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
