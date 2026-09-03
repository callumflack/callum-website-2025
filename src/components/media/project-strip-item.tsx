import Image from "next/image";
import { Link } from "@/components/atoms";
import { Caption } from "@/components/media/caption";
import { MediaFigure } from "@/components/media/media-figure";
import {
  getDimensions,
  isPortrait as assetIsPortrait,
  isVideoFile,
} from "@/components/media/media-utils";
import { mediaWrapperVariants } from "@/components/media/media-wrapper";
import {
  CAROUSEL_CARD_WIDTH,
  CAROUSEL_IMAGE_EXPANDED_HEIGHT,
  projectStripItemClassName,
  type ProjectStripItemSnap,
} from "@/components/media/project-strip";
import { Video } from "@/components/media/video";
import type { CarouselProject } from "@/lib/posts/carousel-projects";
import { cn } from "@/lib/utils";
import type { Asset } from "@/types/content";

const mediaSizes = "(min-width: 660px) 600px, 1200px";

function ProjectStripCaptionInner({
  title,
  yearSpan,
}: {
  title: string;
  yearSpan: string;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span>{title}</span>
      <hr className="hr-vertical border-border-hover h-[12px]" />
      <span>{yearSpan}</span>
    </span>
  );
}

export function ProjectStripCaption({
  slug,
  title,
  yearSpan,
}: {
  slug: string;
  title: string;
  yearSpan: string;
}) {
  return (
    <Caption className="w-full">
      <Link
        href={`/${slug}`}
        className="hover:text-fill! focus-visible:text-fill! no-underline!"
      >
        <ProjectStripCaptionInner title={title} yearSpan={yearSpan} />
      </Link>
    </Caption>
  );
}

export function ProjectStripMedia({
  asset,
  figureClassName,
  imageHeight,
  index,
  isPortrait,
}: {
  asset: Asset;
  figureClassName?: string;
  imageHeight: number;
  index: number;
  isPortrait?: boolean;
}) {
  const { aspect } = asset;
  const { width, height } = getDimensions(aspect);
  const portrait = isPortrait ?? assetIsPortrait(aspect);
  // Reel cards are 768px; card 0 is often a posterless video, so card 1 is LCP.
  const loading = index < 2 ? "eager" : "lazy";
  const mediaClassName = "h-full w-full object-cover";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-zero",
        mediaWrapperVariants({ border: true, background: false })
      )}
      style={{ height: imageHeight }}
    >
      <MediaFigure
        className={cn("h-full w-full", figureClassName)}
        figureIntent="inGrid"
        isPortrait={portrait}
      >
        {isVideoFile(asset.src) ? (
          <Video
            key={asset.src}
            src={asset.src}
            poster={asset.poster || ""}
            posterPriority={index < 2}
            aspect={aspect}
            className={mediaClassName}
          />
        ) : (
          <Image
            key={asset.src}
            src={asset.src}
            alt={asset.alt || ""}
            height={height}
            width={width}
            loading={loading}
            sizes={mediaSizes}
            className={mediaClassName}
          />
        )}
      </MediaFigure>
    </div>
  );
}

export function ProjectStripCard({
  index,
  project,
  snap = "center",
}: {
  index: number;
  project: CarouselProject;
  snap?: ProjectStripItemSnap;
}) {
  const { asset, slug, title, yearSpan } = project;

  return (
    <Link
      aria-label={title}
      className={cn(
        projectStripItemClassName(snap),
        "group hover:text-fill focus-visible:text-fill no-underline!"
      )}
      href={`/${slug}`}
      style={{ width: CAROUSEL_CARD_WIDTH }}
    >
      <ProjectStripMedia
        asset={asset}
        imageHeight={CAROUSEL_IMAGE_EXPANDED_HEIGHT}
        index={index}
        isPortrait={false}
      />
      <Caption className="w-full group-hover:text-fill! group-focus-visible:text-fill!">
        <ProjectStripCaptionInner title={title} yearSpan={yearSpan} />
      </Caption>
    </Link>
  );
}
