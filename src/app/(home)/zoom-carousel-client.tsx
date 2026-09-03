"use client";

import { animate, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/components/atoms";
import { parseAspectRatio } from "@/components/media/media-utils";
import {
  CAROUSEL_IMAGE_EXPANDED_HEIGHT,
  projectStripItemClassName,
  projectStripOverlayClassName,
  projectStripTrackClassName,
} from "@/components/media/project-strip";
import {
  ProjectStripCaption,
  ProjectStripMedia,
} from "@/components/media/project-strip-item";
import { MediaErrorBoundary } from "@/components/utils";
import { centerInViewport } from "@/lib/center-in-viewport";
import type { CarouselProject } from "@/lib/posts/carousel-projects";
import { cn } from "@/lib/utils";

const logPrefix = "[ZoomCarouselClient]";

// Define the breakpoint for enabling zoom functionality
const ZOOM_BREAKPOINT_PX = 1024;

export function ZoomCarouselClient({
  projects,
  className,
  wrapperClassName,
}: {
  projects: CarouselProject[];
  className?: string;
  wrapperClassName?: string;
}) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Zoom is a local gesture. Next can keep this tree across routes; this
  // effect re-runs when the page is shown again, so home comes back compact
  // with the strip at the start. Don't touch window scroll — that's Back's.
  useEffect(() => {
    if (pathname !== "/") return;

    const collapse = () => {
      setIsExpanded(false);
      setClickedIndex(null);
      const el = carouselRef.current;
      if (!el) return;
      el.scrollTo({ left: 0, behavior: "instant" });
    };

    collapse();

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      collapse();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [pathname]);

  // State to store the parsed grid gap value
  const [gridGap, setGridGap] = useState<number | undefined>(undefined);
  // State to store the parsed padding-left value
  const [paddingLeft, setPaddingLeft] = useState<number | undefined>(undefined);
  // State to track if viewport is wide enough for zoom
  const [isWideEnoughForZoom, setIsWideEnoughForZoom] = useState(false);

  // Image heights (for aspect ratio calculations)
  const imageBaseHeight = 180;
  const imageExpandedHeight = CAROUSEL_IMAGE_EXPANDED_HEIGHT;
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
          const aspectRatio = parseAspectRatio(asset.aspect);
          if (aspectRatio > 0) {
            totalPrecedingWidth += imageExpandedHeight * aspectRatio;
          } else {
            console.warn(
              `Invalid aspect ratio for preceding item index ${i}: ${asset.aspect}`
            );
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
        const aspectRatio = parseAspectRatio(clickedAsset.aspect);
        if (aspectRatio > 0) {
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
          className={cn(projectStripTrackClassName, className)}
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
  asset: CarouselProject["asset"];
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
  const aspectRatio = parseAspectRatio(asset.aspect);
  const normalWidth = imageBaseHeight * aspectRatio;
  const expandedWidth = imageExpandedHeight * aspectRatio;
  const currentImageHeight =
    isZoomEnabled && isExpanded ? imageExpandedHeight : imageBaseHeight;

  return (
    <motion.div
      key={index}
      className={projectStripItemClassName("start")}
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
      {slug ? (
        <Link
          href={`/${slug}`}
          aria-label={title || asset.alt}
          className={cn(projectStripOverlayClassName, "absolute! block lg:hidden")}
          style={{ height: currentImageHeight }}
        />
      ) : null}
      <button
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? "Zoom out" : "Zoom in"}: ${title || asset.alt}`}
        className={cn(
          projectStripOverlayClassName,
          "hidden lg:block",
          isExpanded ? "cursor-zoom-out" : "cursor-zoom-in"
        )}
        onClick={() => onToggle(index)}
        style={{ height: currentImageHeight }}
        type="button"
      />
      <ProjectStripMedia
        asset={asset}
        figureClassName="transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        imageHeight={currentImageHeight}
        index={index}
      />
      {showCaption && title && yearSpan && slug ? (
        <ProjectStripCaption slug={slug} title={title} yearSpan={yearSpan} />
      ) : null}
    </motion.div>
  );
};
