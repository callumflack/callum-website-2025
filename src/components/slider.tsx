"use client";

import Image from "next/image";
import { Post } from "content-collections";
import { cx } from "class-variance-authority";
import { MediaFigure } from "@/components/media";
import { mediaWrapperVariants } from "@/components/media";
import { slugify } from "@/lib/utils";
import { Video } from "@/components/media";
import { Asset } from "@/types/content";
import { getDimensions, parseAspectRatio } from "@/components/media/utils";

// Define ManualPost interface that matches content collection Post where relevant
export interface ManualPost {
  title: string;
  date: string;
  summary?: string;
  slug?: string;
  assets: Asset[];
  noBorder?: boolean;
}

// Type guard to check if a project is a ManualPost
function isManualPost(project: Post | ManualPost): project is ManualPost {
  return !("category" in project);
}

interface Props {
  projects: (Post | ManualPost)[];
  showInFull: boolean;
  isZoomed: boolean;
}

/* Carousel duped from HomeSnapCarousel in callum-website v1 (w/o the lib) */

export const Slider = ({ projects, showInFull, isZoomed }: Props) => {
  return (
    <div
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
    >
      {projects.map((project, index) => {
        // Skip if the project doesn't have assets
        if (!project.assets || project.assets.length === 0) return null;

        const asset = project.assets[0];
        const isVideo = asset.src.endsWith(".mp4");
        const slug = project.slug || slugify(project.title);
        const { title } = project;

        // Get dimensions directly from aspect if it's a string with dash
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

        const noBorder = isManualPost(project)
          ? project.noBorder || false
          : false;

        const isSquare = height / width >= 0.825 && height / width <= 1;
        const isPortrait = height > width;

        const sizeClasses = {
          portrait: {
            full: "max-w-none lg:max-w-[calc(66vw*0.5)] 2xl:max-w-[calc(40vw*0.5)]",
            default: "max-w-[280px] lg:max-w-[250px]",
          },
          square: {
            full: "max-w-none lg:max-w-[calc(66vw*0.75)] 2xl:max-w-[calc(40vw*0.75)]",
            default: "max-w-[320px] lg:max-w-[350px]",
          },
          landscape: {
            // could we use clamp here?
            full: "max-w-none lg:max-w-[66vw] 2xl:max-w-[40vw]",
            default: "max-w-[400px] lg:max-w-[480px]",
          },
        };

        const shape = isPortrait
          ? "portrait"
          : isSquare
            ? "square"
            : "landscape";
        const size = showInFull ? "full" : "default";
        const classes = sizeClasses[shape][size];

        // Log the asset name and dimensions for debugging
        console.log(
          `Project: ${project.title}`,
          `Asset: ${asset.src.split("/").pop()}`,
          `Original aspect: ${typeof asset.aspect === "number" ? asset.aspect.toFixed(4) : asset.aspect}`,
          `Calculated dimensions: ${width}x${height}`,
          isPortrait ? "Portrait" : isSquare ? "Square" : "Landscape",
          `Raw aspect: ${1840 / 2519}`
        );

        return (
          <div
            key={slug}
            // href={`/graphics/${slug}`}
            // scroll={false}
            className={cx(
              "snap-center",
              "!py-0 focus-visible:outline-none",
              "grid w-[calc(100vw-(var(--spacing-inset)*2))]",
              classes
            )}
          >
            <MediaFigure
              caption={title} // TODO: add date and project type?
              captionClassName={cx(isZoomed && "hidden")}
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
                  sizes={
                    isZoomed
                      ? "(min-width: 660px) 600px, 1200px"
                      : "(min-width: 660px) 600px, 400px"
                  }
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
          </div>
        );
      })}
    </div>
  );
};
