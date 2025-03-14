"use client";

import { ManualPost } from "@/app/gallery/(components)/projects-manual";
import { MediaFigure, mediaWrapperVariants, Video } from "@/components/media";
import {
  getAspectRatioCSS,
  getImageDimensions,
  isPortrait,
  isSquare,
  isVideoFile,
} from "@/components/media/media-utils";
import { formatYear, slugify } from "@/lib/utils";
import { cx } from "class-variance-authority";
import { Post } from "content-collections";
import Image from "next/image";
import Link from "next/link";

interface SliderProps {
  projects: (Post | ManualPost)[];
  showInFull: boolean;
  isZoomed: boolean;
}

/* Slider must work for both ManualPost and Post types */
function isManualPost(project: Post | ManualPost): project is ManualPost {
  return !("category" in project);
}

/* Carousel duped from HomeSnapCarousel in callum-website v1 (w/o the lib) */
export const Slider = ({ projects, showInFull, isZoomed }: SliderProps) => {
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
        if (!project.assets || project.assets.length === 0) return null;

        const { title } = project;
        const slug = project.slug || slugify(title);

        const asset = project.assets[0];
        const { width, height } = getImageDimensions(asset.aspect);
        const isImageSquare = isSquare(asset.aspect);
        const isVideo = isVideoFile(asset.src);
        const isImagePortrait = isPortrait(asset.aspect);

        const noBorder = isManualPost(project)
          ? project.noBorder || false
          : false;

        const sizeClasses = {
          portrait: {
            full: "max-w-none lg:max-w-[calc(66vw*0.5)] 2xl:max-w-[calc(40vw*0.5)]",
            default: "max-w-[280px] lg:max-w-[250px]",
          },
          square: {
            full: "max-w-none lg:max-w-[calc(66vw*0.75)] 2xl:max-w-[calc(40vw*0.75)]",
            default: "max-w-[320px] lg:max-w-[350px]",
          },
          /* NB! currently we only use landscape.default =================== */
          landscape: {
            // could we use clamp here?
            full: "max-w-none lg:max-w-[66vw] 2xl:max-w-[40vw]",
            default:
              // pruposely NOT 100vw
              "max-w-[calc(85vw-(var(--spacing-inset)*2))] lg:max-w-[480px]",
          },
        };

        const shape = isImagePortrait
          ? "portrait"
          : isImageSquare
            ? "square"
            : "landscape";
        const size = showInFull ? "full" : "default";
        const classes = sizeClasses[shape][size];

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
              caption={
                !isZoomed && (
                  <SimpleCardCaption
                    slug={slug}
                    title={title}
                    date={project.date}
                    isZoomed={isZoomed}
                  />
                )
              }
              captionClassName={cx(
                "transition duration-100 ease-out delay-75"
                // Apply inverse scale when zoomed, origin from top
                // isZoomed && "scale-[0.5] origin-top transform-gpu"
              )}
              className={cx(
                "flex flex-col items-center justify-end [&_figcaption]:w-full"
                // isZoomed &&
                //   "pointer-events-none [&_figcaption]:pointer-events-auto"
              )}
              figureIntent="inGrid"
              isPortrait={isImagePortrait}
            >
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
                  sizes={
                    isZoomed
                      ? "(min-width: 660px) 600px, 1200px"
                      : "(min-width: 660px) 600px, 400px"
                  }
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
            </MediaFigure>
          </div>
        );
      })}
    </div>
  );
};

type SimpleCardCaptionProps = {
  slug: string;
  title: string;
  date: string;
  isZoomed: boolean;
};

export const SimpleCardCaption = ({
  slug,
  title,
  date,
  isZoomed,
}: SimpleCardCaptionProps) => {
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
