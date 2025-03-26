import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
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

// Extracted carousel item component
const CarouselItem = ({
  asset,
  index,
  isExpanded,
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
      className="relative h-full flex-shrink-0 cursor-pointer snap-center overflow-hidden"
      initial={false}
      animate={{
        width: isExpanded ? `${expandedWidth}px` : `${normalWidth}px`,
        // Optional subtle scale effect
        // scale: isExpanded ? 1.02 : 1,
        cursor: isExpanded ? "zoom-out" : "zoom-in",
      }}
      style={{
        willChange: "width, height",
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <MediaFigure
        caption={
          showCaption &&
          title &&
          date && (
            <SimpleCardCaption
              slug={slug || ""}
              title={title}
              date={date}
              isZoomed={isExpanded}
            />
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

// Main ZoomCarousel component
export function ZoomCarousel({ projects }: { projects: Post[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Base and expanded heights
  const baseHeight = 240;
  const expandedHeight = 480;

  // Center carousel in viewport when expanded
  useEffect(() => {
    if (!isExpanded || !carouselRef.current) return;

    // Wait for animation to start (next frame) to calculate
    requestAnimationFrame(() => {
      // Then wait for animation to complete before scrolling
      // Animation duration is 0.5s (500ms)
      setTimeout(() => {
        if (!carouselRef.current) return;

        // Get current position
        const rect = carouselRef.current.getBoundingClientRect();
        // Calculate where it should be ideally positioned
        const idealTop = Math.max(0, (window.innerHeight - expandedHeight) / 2);
        // Calculate how far to scroll
        const scrollBy = rect.top - idealTop;

        // Scroll to center the carousel
        window.scrollBy({
          top: scrollBy,
          behavior: "smooth",
        });
      }, 100); // Start scrolling slightly after animation begins for better visual effect
    });
  }, [isExpanded, expandedHeight]);

  return (
    <div
      className="w-full overflow-x-auto"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.div
        ref={carouselRef}
        className={cx(
          // place above container pseudo-borders
          "relative z-2",
          // w-fit WTF?
          "w-full",
          // scroll
          "overflow-x-scroll will-change-scroll",
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
          height: isExpanded ? expandedHeight : baseHeight,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          willChange: "height",
        }}
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
                key={index}
                asset={asset}
                index={index}
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
  );
}

// Simple caption component from Slider
const SimpleCardCaption = ({
  slug,
  title,
  date,
  isZoomed,
}: {
  slug: string;
  title: string;
  date: string;
  isZoomed: boolean;
}) => {
  return (
    <Link
      href={`/${slug}`}
      className="link flex items-center gap-1.5 no-underline"
      onClick={(e) => {
        if (!isZoomed) {
          e.stopPropagation();
        } else {
          e.preventDefault();
        }
      }}
    >
      <span>{title}</span>
      <hr className="hr-vertical border-border-hover h-[12px]" />
      <span>{formatYear(date)}</span>
    </Link>
  );
};

// Find the center item in a carousel
const findCenterItem = (items: Element[], containerRect: DOMRect): number => {
  const containerCenterX = containerRect.left + containerRect.width / 2;

  let centerIndex = 0;
  let minDistance = Infinity;

  items.forEach((item, index) => {
    const itemRect = item.getBoundingClientRect();
    const itemCenterX = itemRect.left + itemRect.width / 2;
    const distance = Math.abs(itemCenterX - containerCenterX);

    if (distance < minDistance) {
      minDistance = distance;
      centerIndex = index;
    }
  });

  return centerIndex;
};
