"use client";

import { animate, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Caption,
  MediaFigure,
  mediaWrapperVariants,
  Video,
} from "@/components/media";
import {
  getDimensions,
  isPortrait,
  isVideoFile,
} from "@/components/media/media-utils";
import { MediaErrorBoundary } from "@/components/utils";
import { centerInViewport } from "@/lib/center-in-viewport";
import { cn } from "@/lib/utils";
import type { Asset } from "@/types/content";

const logPrefix = "[ZoomCarouselClient]";

// Define the breakpoint for enabling zoom functionality
const ZOOM_BREAKPOINT_PX = 1024;

const overlayClassName =
  "focus-visible:outline-fill absolute inset-x-0 top-0 z-1 border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid";

export type ZoomCarouselProject = {
  asset: Asset;
  slug: string;
  title: string;
  yearSpan: string;
};

export function ZoomCarouselClient({
  projects,
  className,
  wrapperClassName,
}: {
  projects: ZoomCarouselProject[];
  className?: string;
  wrapperClassName?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // State to store the parsed grid gap value
  const [gridGap, setGridGap] = useState<number | undefined>(undefined);
  // State to store the parsed padding-left value
  const [paddingLeft, setPaddingLeft] = useState<number | undefined>(undefined);
  // State to track if viewport is wide enough for zoom
  const [isWideEnoughForZoom, setIsWideEnoughForZoom] = useState(false);

  // Image heights (for aspect ratio calculations)
  const imageBaseHeight = 180;
  const imageExpandedHeight = 480;
  // Buffer for caption + gap (caption sits outside image container)
  const captionBuffer = 40;
  // Container heights (image + caption space)
  const containerBaseHeight = imageBaseHeight + captionBuffer;
  const containerExpandedHeight = imageExpandedHeight + captionBuffer;

  // Effect to read grid gap and padding on mount
  useEffect(() => {
    if (carouselRef.current) {
      const computedStyle = window.getComputedStyle(carouselRef.current);

      // --- Read Gap ---
      const gapValue = computedStyle.getPropertyValue("gap");
      const parsedGap = parseInt(gapValue.split(" ")[0], 10);
      if (!isNaN(parsedGap)) {
        setGridGap(parsedGap);
      } else {
        console.warn("Could not parse grid gap value:", gapValue);
        setGridGap(0);
      }

      // --- Read Padding Left ---
      const paddingValue = computedStyle.getPropertyValue("padding-left");
      const parsedPadding = parseInt(paddingValue, 10);
      if (!isNaN(parsedPadding)) {
        setPaddingLeft(parsedPadding);
      } else {
        console.warn("Could not parse padding-left value:", paddingValue);
        setPaddingLeft(0); // Fallback to 0
      }
    }
  }, []); // Run once on mount

  // Effect to check viewport width on resize
  useEffect(() => {
    const checkWidth = () => {
      setIsWideEnoughForZoom(window.innerWidth >= ZOOM_BREAKPOINT_PX);
    };
    // Check on mount
    checkWidth();
    // Add resize listener
    window.addEventListener("resize", checkWidth);
    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", checkWidth);
  }, []); // Run once on mount

  const handleAnimationComplete = () => {
    if (!isExpanded || !carouselRef.current || !isWideEnoughForZoom) return;

    centerInViewport(carouselRef.current, {
      behavior: "smooth",
      thresholdPx: 1,
    });
  };

  // Effect to handle horizontal scrolling animation
  useEffect(() => {
    const container = carouselRef.current;
    if (!container || gridGap === undefined || paddingLeft === undefined)
      return;

    const snapClasses = ["snap-x", "snap-mandatory", "scroll-smooth"];
    // Store original overflow-anchor value
    const originalOverflowAnchor = container.style.overflowAnchor;
    // Store original will-change value (or determine default)
    const originalWillChange = container.style.willChange;

    if (isExpanded && clickedIndex !== null) {
      // --- Calculate offset instead of reading from DOM ---
      let totalPrecedingWidth = 0;
      for (let i = 0; i < clickedIndex; i++) {
        const project = projects[i];
        const asset = project?.asset;
        if (project && asset) {
          const aspectParts = asset.aspect.split("-");
          const aspectRatio =
            parseInt(aspectParts[0]) / parseInt(aspectParts[1]);
          // Ensure aspect ratio is valid to avoid NaN
          if (!isNaN(aspectRatio) && aspectRatio > 0) {
            totalPrecedingWidth += imageExpandedHeight * aspectRatio;
          } else {
            console.warn(
              `Invalid aspect ratio for preceding item index ${i}: ${asset.aspect}`
            );
            // Add a fallback width maybe? Or just skip?
          }
        } else {
          console.warn(
            `Missing project/asset data for preceding item index ${i}`
          );
          // Add a fallback width maybe? Or just skip?
        }
      }
      const totalPrecedingGaps = clickedIndex * gridGap;
      const calculatedOffsetLeft = totalPrecedingWidth + totalPrecedingGaps;

      // --- Adjust offset for padding ---
      const finalOffsetLeft = paddingLeft + calculatedOffsetLeft;
      // ---------------------------------

      // Get the expanded width of the *clicked* item itself
      const clickedProject = projects[clickedIndex];
      const clickedAsset = clickedProject?.asset;
      let clickedItemExpandedWidth = 0; // Default
      if (clickedProject && clickedAsset) {
        const aspectParts = clickedAsset.aspect.split("-");
        const aspectRatio = parseInt(aspectParts[0]) / parseInt(aspectParts[1]);
        if (!isNaN(aspectRatio) && aspectRatio > 0) {
          clickedItemExpandedWidth = imageExpandedHeight * aspectRatio;
        } else {
          console.warn(
            `Invalid aspect ratio for clicked item index ${clickedIndex}: ${clickedAsset.aspect}`
          );
        }
      } else {
        console.warn(
          `Missing project/asset data for clicked item index ${clickedIndex}`
        );
      }
      // -----------------------------------------------------

      // Read container width here - hopefully stable enough
      const containerWidth = container.clientWidth;

      const targetScrollLeft =
        // Use finalOffsetLeft which includes padding
        finalOffsetLeft + clickedItemExpandedWidth / 2 - containerWidth / 2;
      console.log(
        logPrefix,
        `[useEffect] Calculated targetScrollLeft: ${targetScrollLeft} for index ${clickedIndex}`
      );

      // Disable scroll anchoring, remove snap/smooth classes, add will-change BEFORE animating
      container.style.overflowAnchor = "none";
      container.style.willChange = "scroll-left"; // Add will-change here
      container.classList.remove(...snapClasses);

      const controls = animate(container.scrollLeft, targetScrollLeft, {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          container.scrollLeft = latest;
        },
        onComplete: () => {
          // Restore scroll anchoring and will-change AFTER animating
          container.style.overflowAnchor = originalOverflowAnchor;
          container.style.willChange = originalWillChange; // Restore will-change
          console.log(
            logPrefix,
            `Scroll animation complete. Final scrollLeft: ${container.scrollLeft}`
          );
          // NOTE: Intentionally NOT re-adding snap classes (`snap-x`, `snap-mandatory`, `scroll-smooth`)  when expanded to prevent layout jank after the smooth scroll animation finishes. Snap classes are added back only when collapsing (in the `else if (!isExpanded)` block).
        },
      });

      // Cleanup function to stop any in-flight animation if state flips quickly.
      return () => {
        controls.stop();
        container.style.overflowAnchor = originalOverflowAnchor;
        container.style.willChange = originalWillChange;
      };
    } else if (!isExpanded) {
      // Ensure classes, default anchor, and default will-change are present when collapsed
      if (!container.classList.contains("snap-x")) {
        container.classList.add(...snapClasses);
      }
      container.style.overflowAnchor = originalOverflowAnchor;
      container.style.willChange = originalWillChange; // Ensure will-change is reset
    }

    // Cleanup function to restore styles if component unmounts mid-animation
    return () => {
      if (container) {
        container.style.overflowAnchor = originalOverflowAnchor;
        container.style.willChange = originalWillChange; // Restore on unmount too
      }
    };
  }, [isExpanded, clickedIndex, projects, gridGap, paddingLeft]);

  const toggleExpand = (index: number) => {
    if (!isWideEnoughForZoom) return;

    if (isExpanded) {
      setClickedIndex(null);
      setIsExpanded(false);
      return;
    }

    setClickedIndex(index);
    setIsExpanded(true);
  };

  return (
    <MediaErrorBoundary>
      <div
        className={cn("w-full overflow-x-auto", wrapperClassName)}
        data-component="ZoomCarousel"
      >
        <motion.div
          ref={carouselRef}
          // Ensure initial classes include snap/smooth
          className={cn(
            "relative z-2",
            // w-fit WTF?
            "w-full",
            // scroll
            "overflow-x-scroll will-change-scroll",
            // scroll-snap (start with these)
            "snap-x snap-mandatory scroll-smooth",
            // grid
            "grid grid-flow-col grid-cols-[max-content] grid-rows-1",
            "px-inset gap-inset scroll-px-inset",
            // "lg:gap-[calc(var(--spacing-inset)*2)]",
            "min-[620px]:max-lg:scroll-px-inset-text min-[620px]:max-lg:px-inset-text",
            "lg:scroll-px-[calc(var(--spacing-inset-text)-var(--spacing-major))] lg:px-[calc(var(--spacing-inset-text)-var(--spacing-major))]",
            // hide scrollbar
            "hide-scrollbar",
            className
          )}
          initial={false}
          animate={{
            height:
              isWideEnoughForZoom && isExpanded
                ? containerExpandedHeight
                : containerBaseHeight,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            willChange: "height",
            cursor: isWideEnoughForZoom
              ? isExpanded
                ? "zoom-out"
                : "auto"
              : "auto",
          }}
          onAnimationComplete={handleAnimationComplete}
        >
          {projects.map((project, index) => {
            return (
              <CarouselItem
                key={project.slug}
                asset={project.asset}
                index={index}
                isZoomEnabled={isWideEnoughForZoom}
                isExpanded={isExpanded}
                imageBaseHeight={imageBaseHeight}
                imageExpandedHeight={imageExpandedHeight}
                title={project.title}
                yearSpan={project.yearSpan}
                slug={project.slug}
                showCaption={true}
                onToggle={toggleExpand}
              />
            );
          })}
        </motion.div>
      </div>
    </MediaErrorBoundary>
  );
}

// Extracted carousel item component
const CarouselItem = ({
  asset,
  index,
  isExpanded,
  isZoomEnabled,
  imageBaseHeight,
  imageExpandedHeight,
  slug,
  title,
  yearSpan,
  showCaption = true,
  onToggle,
}: {
  asset: Asset;
  index: number;
  isExpanded: boolean;
  isZoomEnabled: boolean;
  imageBaseHeight: number;
  imageExpandedHeight: number;
  slug?: string;
  title?: string;
  yearSpan?: string;
  showCaption?: boolean;
  onToggle: (index: number) => void;
}) => {
  const { aspect } = asset;
  const isImagePortrait = isPortrait(aspect);
  const isVideo = isVideoFile(asset.src);

  const { width, height } = getDimensions(aspect);

  // Calculate width based on aspect ratio to maintain consistent height
  const aspectParts = aspect.split("-");
  const aspectRatio = parseInt(aspectParts[0]) / parseInt(aspectParts[1]);

  // Calculate the width for both states (based on IMAGE height, not container)
  const normalWidth = imageBaseHeight * aspectRatio;
  const expandedWidth = imageExpandedHeight * aspectRatio;

  // Current image height for this state
  const currentImageHeight =
    isZoomEnabled && isExpanded ? imageExpandedHeight : imageBaseHeight;

  return (
    <motion.div
      key={index}
      className="relative flex shrink-0 snap-start flex-col gap-2.5 overflow-hidden"
      initial={false}
      animate={{
        width:
          isZoomEnabled && isExpanded
            ? `${expandedWidth}px`
            : `${normalWidth}px`,
      }}
      style={{ willChange: "width" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/*
        CAPTION OUTSIDE FIX: Caption is now a sibling to MediaFigure, not inside it.
        This ensures the image height calculation (for width) matches actual image height.
        MediaFigure gets explicit height, caption sits below with gap-2.5.
      */}
      {slug ? (
        <Link
          href={`/${slug}`}
          aria-label={title || asset.alt}
          className={cn(overlayClassName, "absolute! block lg:hidden")}
          style={{ height: currentImageHeight }}
        />
      ) : null}
      <button
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? "Zoom out" : "Zoom in"}: ${title || asset.alt}`}
        className={cn(
          overlayClassName,
          "hidden lg:block",
          isExpanded ? "cursor-zoom-out" : "cursor-zoom-in"
        )}
        onClick={() => onToggle(index)}
        style={{ height: currentImageHeight }}
        type="button"
      />
      <MediaFigure
        figureIntent="inGrid"
        isPortrait={isImagePortrait}
        className="transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ height: currentImageHeight }}
      >
        {isVideo ? (
          <Video
            src={asset.src}
            poster={asset.poster || ""}
            posterPriority={index === 0}
            aspect={aspect}
            className={cn(
              "h-full w-full object-cover",
              mediaWrapperVariants({
                border: true,
              })
            )}
            onError={() => {
              // No-op: MediaErrorBoundary will handle display; keep callback to satisfy props if needed
            }}
          />
        ) : (
          <Image
            src={asset.src}
            alt={asset.alt || ""}
            height={height}
            width={width}
            priority={index === 0}
            // set this at the max image size so Next.js doesn't recompute sizes and flash the UI…
            // sizes={isExpanded ? "50vw" : "33vw"}
            sizes="(min-width: 660px) 600px, 1200px"
            className={cn(
              "h-full w-full object-cover",
              mediaWrapperVariants({
                border: true,
              })
            )}
          />
        )}
      </MediaFigure>
      {showCaption && title && yearSpan && (
        <Caption className="w-full">
          <SimpleCardCaption
            slug={slug || ""}
            title={title}
            yearSpan={yearSpan}
          />
        </Caption>
      )}
    </motion.div>
  );
};

// Simple caption component from Slider
const SimpleCardCaption = ({
  slug,
  title,
  yearSpan,
}: {
  slug: string;
  title: string;
  yearSpan: string;
}) => {
  return (
    <Link
      href={`/${slug}`}
      className="hover:text-fill! focus-visible:text-fill! flex items-center gap-1.5 no-underline!"
    >
      <span>{title}</span>
      <hr className="hr-vertical border-border-hover h-[12px]" />
      <span>{yearSpan}</span>
    </Link>
  );
};
