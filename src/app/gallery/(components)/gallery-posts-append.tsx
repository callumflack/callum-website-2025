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
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ManualPost } from "./projects-manual";
import { cn } from "@/lib/classes";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { centerInViewport } from "@/lib/center-in-viewport";

/* A relative of FeaturedOrIndexPosts and FullOrIndexPosts */

// Type guard to check if a project is a ManualPost
function isManualPost(project: Post | ManualPost): project is ManualPost {
  return !("category" in project);
}

// Define sort options as const tuple for type safety
const SORT_BY = ["all", "interactions", "graphics"] as const;
type SortOption = (typeof SORT_BY)[number];

interface GalleryPostsAppendProps {
  posts: (Post | ManualPost)[];
  kind: string;
  initialSort?: string; // ViewMode?;
  setIsActive: (isActive: boolean) => void;
  isActive: boolean;
}

export function GalleryPostsAppend({
  posts,
  kind,
  initialSort = "all",
  setIsActive,
  isActive,
}: GalleryPostsAppendProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const expandedRef = useRef<HTMLDivElement | null>(null);

  const centerExpanded = useCallback(() => {
    const el = expandedRef.current;
    if (!el) return;
    centerInViewport(el, { behavior: "smooth", thresholdPx: 1 });
  }, []);

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
    setActiveKey(null);
  };

  // When an item becomes active, scroll the expanded row into the middle of the viewport
  useEffect(() => {
    if (!activeKey) return;
    const el = expandedRef.current;
    if (!el) return;
    const center = () => centerExpanded();
    let raf1 = 0;
    let raf2 = 0;
    let timeoutId: number | null = null;

    // Let layout + Framer's layout pass settle
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(center);
      // Fallback in case rAF fires before final layout
      timeoutId = window.setTimeout(center, 180);
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [activeKey, centerExpanded]);

  // Observe size changes of the expanded row (e.g., image loads) and re-center
  useEffect(() => {
    if (!activeKey) return;
    const el = expandedRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      // throttle via rAF
      requestAnimationFrame(centerExpanded);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeKey, centerExpanded]);

  // Process posts into rows before rendering
  const postsInRows = useMemo(() => {
    if (!filteredPosts.length)
      return [] as { post: Post | ManualPost; expanded: boolean }[][];

    // Group posts into rows of 3
    const rows: (Post | ManualPost)[][] = [];
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

      <LayoutGroup id="gallery">
        <div
          data-slot="GalleryPostsAppend"
          className={cn(
            "relative z-9",
            "pt-w12 px-inset",
            "grid justify-center",
            "gap-y-w8 gap-x-3",
            "grid-cols-36",
            "group/gallery" // Required for hover effect - see globals.css
          )}
        >
          {postsInRows.map((row, rowIdx) => {
            const rowKeys = row.map(({ post }, colIdx) => {
              const base = post.slug ?? post.title;
              return `${base}-${rowIdx}-${colIdx}`;
            });
            const rowActiveKey =
              activeKey && rowKeys.includes(activeKey) ? activeKey : null;

            return (
              <Fragment key={`row-${rowIdx}`}>
                {row.map(({ post, expanded }, colIdx) => {
                  if (!post.assets || post.assets.length === 0) return null;

                  const { title, slug, assets, date } = post;
                  const asset = assets[0];
                  const { width, height } = getImageDimensions(asset.aspect);
                  const isVideo = isVideoFile(asset.src);
                  const isImageSquare = isSquare(asset.aspect);
                  const isImagePortrait =
                    !isImageSquare && isPortrait(asset.aspect);
                  const noBorder = isManualPost(post)
                    ? post.noBorder || false
                    : false;

                  const key = `${slug ?? title}-${rowIdx}-${colIdx}`;

                  return (
                    <motion.div
                      key={key}
                      layout
                      layoutId={key}
                      data-active={isActive}
                      onMouseEnter={() => setIsActive(true)}
                      onMouseLeave={() => setIsActive(false)}
                      onClick={() =>
                        setActiveKey(activeKey === key ? null : key)
                      }
                      className={cn(
                        expanded
                          ? "col-span-24 lg:col-span-18 2xl:col-span-12"
                          : "col-span-12 lg:col-span-9 2xl:col-span-6",
                        activeKey === key && "pointer-events-none opacity-10",
                        "transition-[opacity] duration-200"
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
                              priority={rowIdx * 3 + colIdx < 7}
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
                    </motion.div>
                  );
                })}

                <AnimatePresence>
                  {rowActiveKey ? (
                    <motion.div
                      key={`expanded-${rowActiveKey}`}
                      layout
                      layoutId={rowActiveKey}
                      className="col-span-36"
                      ref={expandedRef}
                      onLayoutAnimationComplete={centerExpanded}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 40,
                      }}
                      onClick={() => setActiveKey(null)}
                    >
                      <div className="grid grid-cols-36">
                        {row.map(({ post }, colIdx) => {
                          const key = `${post.slug ?? post.title}-${rowIdx}-${colIdx}`;
                          if (key !== rowActiveKey) return null;

                          const { title, slug, assets, date } = post;
                          const asset = assets![0];
                          const { width, height } = getImageDimensions(
                            asset.aspect
                          );
                          const isVideo = isVideoFile(asset.src);
                          const isSquareImg = isSquare(asset.aspect);
                          const isPortraitImg =
                            !isSquareImg && isPortrait(asset.aspect);
                          const noBorder = isManualPost(post)
                            ? post.noBorder || false
                            : false;

                          return (
                            <div
                              key={`expanded-wrapper-${key}`}
                              className="col-span-14 col-start-12"
                            >
                              <MediaFigure
                                key={`expanded-media-${key}`}
                                caption={
                                  slug ? (
                                    <Link
                                      href={`/${slug}`}
                                      className="link flex items-center gap-1.5 no-underline"
                                    >
                                      <Caption title={title} date={date} />
                                    </Link>
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      <Caption title={title} date={date} />
                                    </div>
                                  )
                                }
                                className={cn(
                                  isSquareImg ? "isSquare" : "",
                                  "[&_figcaption]:w-full",
                                  "flex flex-col items-center justify-start"
                                )}
                                captionClassName=""
                                figureIntent="inGrid"
                                isPortrait={isPortraitImg}
                                style={{
                                  aspectRatio: getAspectRatioCSS(asset.aspect),
                                }}
                              >
                                <MediaErrorBoundary>
                                  {isVideo ? (
                                    <Video
                                      key={`expanded-${asset.src}`}
                                      aspect={asset.aspect}
                                      className={cn(
                                        mediaWrapperVariants({
                                          border: !noBorder,
                                        }),
                                        "transition-transform duration-200 will-change-transform"
                                      )}
                                      poster={asset.poster || asset.src}
                                      src={asset.src}
                                    />
                                  ) : (
                                    <Image
                                      alt={asset.alt || title}
                                      src={asset.src}
                                      priority
                                      height={height}
                                      width={width}
                                      sizes={
                                        "(min-width: 1200px) 1800px, (min-width: 660px) 1200px, 100vw"
                                      }
                                      style={{
                                        aspectRatio: getAspectRatioCSS(
                                          asset.aspect
                                        ),
                                      }}
                                      className={cn(
                                        mediaWrapperVariants({
                                          border: !noBorder,
                                        }),
                                        "transition-transform duration-200 will-change-transform"
                                      )}
                                    />
                                  )}
                                </MediaErrorBoundary>
                              </MediaFigure>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Fragment>
            );
          })}
        </div>
      </LayoutGroup>
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
