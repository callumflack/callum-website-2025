import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { focusVisibleOutlineStyle } from "@/components/atoms/focus";
import { MediaFigure } from "@/components/media/media-figure";
import {
  getAspectRatioCSS,
  getImageDimensions,
  isPortrait,
  isSquare,
  isVideoFile,
} from "@/components/media/media-utils";
import { mediaWrapperVariants } from "@/components/media/media-wrapper";
import { cn, formatYear } from "@/lib/utils";
import { GalleryVideo } from "./gallery-video";
import { getGalleryItems, type GalleryItem } from "./gallery-projects";

type GalleryGridItem = {
  expanded: boolean;
  item: GalleryItem;
};

const VIDEO_AUTOPLAY_STAGGER_MS = 1000;
// Cap the stagger so videos far down the page don't wait `order * 1s` after
// scrolling into view; the IntersectionObserver already gates loading.
const VIDEO_AUTOPLAY_STAGGER_MAX_MS = 4000;
// The first grid row (3 tiles) is the LCP candidate set — the expanded tile
// varies per shuffle, so preload the whole row, not just index 0.
const LEADING_TILE_COUNT = 3;

export async function GalleryView() {
  await connection();

  const rows = createGalleryRows(shuffleGalleryItems(getGalleryItems()));
  let nextVideoOrder = 0;

  return (
    <div
      className={cn(
        "relative z-9 grid grid-cols-24 justify-center",
        "gap-y-w8 px-inset pt-w12 gap-x-3",
        "lg:grid-cols-8"
      )}
      data-component="Gallery"
    >
      {rows.flat().map(({ item, expanded }, index) => {
        const autoplayDelay =
          isVideoFile(item.asset.src) && item.asset.poster
            ? Math.min(
                nextVideoOrder++ * VIDEO_AUTOPLAY_STAGGER_MS,
                VIDEO_AUTOPLAY_STAGGER_MAX_MS
              )
            : null;

        return (
          <GalleryTile
            autoplayDelay={autoplayDelay}
            expanded={expanded}
            isLeading={index < LEADING_TILE_COUNT}
            item={item}
            key={item.id}
          />
        );
      })}
    </div>
  );
}

function shuffleGalleryItems(items: GalleryItem[]): GalleryItem[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function GalleryTile({
  autoplayDelay,
  expanded,
  isLeading,
  item,
}: {
  autoplayDelay: number | null;
  expanded: boolean;
  isLeading: boolean;
  item: GalleryItem;
}) {
  const { asset, date, href, noBorder, title } = item;
  const { width, height } = getImageDimensions(asset.aspect);
  const isVideo = isVideoFile(asset.src);
  const isImageSquare = isSquare(asset.aspect);
  const isImagePortrait = !isImageSquare && isPortrait(asset.aspect);
  const mediaClassName = mediaWrapperVariants({ border: !noBorder });
  const sizes = expanded
    ? "(min-width: 1536px) 34vw, (min-width: 1024px) 50vw, 67vw"
    : "(min-width: 1536px) 17vw, (min-width: 1024px) 25vw, 34vw";
  const figure = (
    <MediaFigure
      caption={
        <div className="flex flex-wrap items-center gap-x-1.5">
          <GalleryCaption date={date} title={title} />
        </div>
      }
      captionClassName={href ? "group-hover:text-accent!" : undefined}
      className={cn(
        isImageSquare && "isSquare",
        "flex flex-col items-center justify-start [&_figcaption]:w-full"
      )}
      figureIntent="inGrid"
      isPortrait={isImagePortrait}
      style={{ aspectRatio: getAspectRatioCSS(asset.aspect) }}
    >
      {isVideo ? (
        asset.poster ? (
          <GalleryVideo
            alt={asset.alt || title}
            aspect={asset.aspect}
            autoplayDelay={autoplayDelay ?? 0}
            className={mediaClassName}
            height={height}
            poster={asset.poster}
            preload={isLeading}
            sizes={sizes}
            src={asset.src}
            width={width}
          />
        ) : (
          <video
            aria-label={asset.alt || title}
            className={mediaClassName}
            controls
            playsInline
            preload="none"
            src={asset.src}
            style={{ aspectRatio: getAspectRatioCSS(asset.aspect) }}
          />
        )
      ) : (
        <Image
          alt={asset.alt || title}
          className={mediaClassName}
          height={height}
          preload={isLeading}
          sizes={sizes}
          src={asset.src}
          style={{ aspectRatio: getAspectRatioCSS(asset.aspect) }}
          width={width}
        />
      )}
    </MediaFigure>
  );

  return (
    <div
      className={cn(
        expanded ? "col-span-16 lg:col-span-4" : "col-span-8 lg:col-span-2"
      )}
    >
      {href ? (
        <Link
          className={cn("group block no-underline", focusVisibleOutlineStyle)}
          href={href}
        >
          {figure}
        </Link>
      ) : (
        figure
      )}
    </div>
  );
}

function GalleryCaption({ date, title }: { date: string; title: string }) {
  return (
    <>
      <span>{title}</span>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <hr className="hr-vertical border-border-hover group-hover:border-accent h-[12px]" />
        <span>{formatYear(date)}</span>
      </span>
    </>
  );
}

function createGalleryRows(items: GalleryItem[]): GalleryGridItem[][] {
  const rows: GalleryGridItem[][] = [];

  for (let index = 0; index < items.length; index += 3) {
    const row = items.slice(index, index + 3);
    const expandedIndex =
      row.length === 3
        ? row.findIndex(
            ({ asset }) => !isPortrait(asset.aspect) && !isSquare(asset.aspect)
          )
        : -1;

    rows.push(
      row.map((item, itemIndex) => ({
        expanded: itemIndex === expandedIndex,
        item,
      }))
    );
  }

  return rows;
}
