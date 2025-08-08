import { useEffect, useState, useRef } from "react";
import { motion, animate } from "framer-motion";
import { cx } from "class-variance-authority";
import { Asset } from "@/types/content";
import { MediaFigure, mediaWrapperVariants } from "@/components/media";
import {
  getAspectRatioCSS,
  isPortrait,
  isVideoFile,
  getDimensions,
} from "@/components/media/media-utils";
import Link from "next/link";
import { formatYear } from "@/lib/utils";
import { Post } from "content-collections";
import Image from "next/image";
import { MediaErrorBoundary } from "@/components/utils";

const logPrefix = "[ZoomCarousel]";

// Define the breakpoint for enabling zoom functionality
const ZOOM_BREAKPOINT_PX = 1024;

// Main ZoomCarousel component
export function ZoomCarousel({ projects }: { projects: Post[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // State to store the parsed grid gap value
  const [gridGap, setGridGap] = useState<number | undefined>(undefined);
  // State to store the parsed padding-left value
  const [paddingLeft, setPaddingLeft] = useState<number | undefined>(undefined);
  // State to track if viewport is wide enough for zoom
  const [isWideEnoughForZoom, setIsWideEnoughForZoom] = useState(false);

  // Base and expanded heights
  const baseHeight = 240;
  const expandedHeight = 480;

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

    // Vertical centering logic remains here
    const rect = carouselRef.current.getBoundingClientRect();
    const idealTop = Math.max(0, (window.innerHeight - expandedHeight) / 2);
    const scrollByY = rect.top - idealTop;
    window.scrollBy({
      top: scrollByY,
      behavior: "smooth",
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
        const asset = project?.assets?.[0];
        if (project && asset) {
          const aspectParts = asset.aspect.split("-");
          const aspectRatio =
            parseInt(aspectParts[0]) / parseInt(aspectParts[1]);
          // Ensure aspect ratio is valid to avoid NaN
          if (!isNaN(aspectRatio) && aspectRatio > 0) {
            totalPrecedingWidth += expandedHeight * aspectRatio;
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
      const clickedAsset = clickedProject?.assets?.[0];
      let clickedItemExpandedWidth = 0; // Default
      if (clickedProject && clickedAsset) {
        const aspectParts = clickedAsset.aspect.split("-");
        const aspectRatio = parseInt(aspectParts[0]) / parseInt(aspectParts[1]);
        if (!isNaN(aspectRatio) && aspectRatio > 0) {
          clickedItemExpandedWidth = expandedHeight * aspectRatio;
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

      animate(container.scrollLeft, targetScrollLeft, {
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
    } else if (!isExpanded) {
      // Ensure classes, default anchor, and default will-change are present when collapsed
      if (!container.classList.contains("snap-x")) {
        container.classList.add(...snapClasses);
      }
      container.style.overflowAnchor = originalOverflowAnchor;
      container.style.willChange = originalWillChange; // Ensure will-change is reset
      setClickedIndex(null);
    }

    // Cleanup function to restore styles if component unmounts mid-animation
    return () => {
      if (container) {
        container.style.overflowAnchor = originalOverflowAnchor;
        container.style.willChange = originalWillChange; // Restore on unmount too
      }
    };
  }, [
    isExpanded,
    clickedIndex,
    projects,
    expandedHeight,
    gridGap,
    paddingLeft,
  ]);

  // Handle clicks on the container
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // --- Prevent zoom if viewport is too narrow ---
    if (!isWideEnoughForZoom) {
      // On narrow screens, clicking the image area does nothing.
      // Navigation still works via the caption link.
      return;
    }
    // ---------------------------------------------

    const clickedItem = (e.target as Element).closest<HTMLDivElement>(
      "[data-index]"
    );
    const index = clickedItem?.dataset.index
      ? parseInt(clickedItem.dataset.index, 10)
      : null;

    if (isExpanded) {
      console.log(
        logPrefix,
        `[handleContainerClick] Collapsing. Setting isExpanded: false`
      );
      setIsExpanded(false);
    } else if (index !== null) {
      console.log(
        logPrefix,
        `[handleContainerClick] Item ${index} clicked. Expanding. Setting clickedIndex: ${index}, isExpanded: true`
      );
      setClickedIndex(index);
      setIsExpanded(true);
    }
  };

  return (
    <MediaErrorBoundary>
      <div className="w-full overflow-x-auto" onClick={handleContainerClick}>
        <motion.div
          ref={carouselRef}
          // Ensure initial classes include snap/smooth
          className={cx(
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
            "min-[620px]:scroll-px-(--inset-text) min-[620px]:px-(--inset-text)",
            // hide scrollbar
            "hide-scrollbar"
          )}
          initial={false}
          animate={{
            height:
              isWideEnoughForZoom && isExpanded ? expandedHeight : baseHeight,
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
          {projects
            .filter(
              (
                project
              ): project is Post & { assets: NonNullable<Post["assets"]> } =>
                !!project.assets && project.assets.length > 0
            )
            .map((project, index) => {
              const asset = project.assets[0];
              return (
                <CarouselItem
                  key={project.slug}
                  asset={asset}
                  index={index}
                  isZoomEnabled={isWideEnoughForZoom}
                  isExpanded={isExpanded}
                  baseHeight={baseHeight}
                  expandedHeight={expandedHeight}
                  title={project.title}
                  date={project.date}
                  slug={project.slug}
                  showCaption={true}
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
  baseHeight,
  expandedHeight,
  slug,
  title,
  date,
  showCaption = true,
}: {
  asset: Asset;
  index: number;
  isExpanded: boolean;
  isZoomEnabled: boolean;
  baseHeight: number;
  expandedHeight: number;
  slug?: string;
  title?: string;
  date?: string;
  showCaption?: boolean;
}) => {
  const { aspect } = asset;
  const isImagePortrait = isPortrait(aspect);
  const isVideo = isVideoFile(asset.src);

  const { width, height } = getDimensions(aspect);

  // Calculate width based on aspect ratio to maintain consistent height
  const aspectParts = aspect.split("-");
  const aspectRatio = parseInt(aspectParts[0]) / parseInt(aspectParts[1]);

  // Calculate the width for both states
  const normalWidth = baseHeight * aspectRatio;
  const expandedWidth = expandedHeight * aspectRatio;

  return (
    <motion.div
      key={index}
      data-index={index}
      className="relative h-full flex-shrink-0 snap-center overflow-hidden"
      initial={false}
      animate={{
        width:
          isZoomEnabled && isExpanded
            ? `${expandedWidth}px`
            : `${normalWidth}px`,
      }}
      style={{
        willChange: "width, height",
        cursor: isZoomEnabled ? (isExpanded ? "zoom-out" : "zoom-in") : "auto",
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <MediaFigure
        caption={
          showCaption &&
          title &&
          date && (
            <SimpleCardCaption slug={slug || ""} title={title} date={date} />
          )
        }
        figureIntent="inGrid"
        isPortrait={isImagePortrait}
        className="flex h-full flex-col items-center justify-end [&_figcaption]:w-full"
      >
        <Image
          src={isVideo ? asset.poster || "" : asset.src}
          alt={asset.alt || ""}
          height={height}
          width={width}
          priority={index < 7}
          // set this at the max image size so Next.js doesn't recompute sizes and flash the UI…
          // sizes={isExpanded ? "50vw" : "33vw"}
          sizes="(min-width: 660px) 600px, 1200px"
          className={cx(
            "h-full w-full object-cover",
            mediaWrapperVariants({
              border: true,
            })
          )}
          style={{
            aspectRatio: getAspectRatioCSS(aspect),
          }}
        />
      </MediaFigure>
    </motion.div>
  );
};

// Simple caption component from Slider
const SimpleCardCaption = ({
  slug,
  title,
  date,
}: {
  slug: string;
  title: string;
  date: string;
}) => {
  return (
    <Link
      href={`/${slug}`}
      className="link flex items-center gap-1.5 no-underline"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <span>{title}</span>
      <hr className="hr-vertical border-border-hover h-[12px]" />
      <span>{formatYear(date)}</span>
    </Link>
  );
};
