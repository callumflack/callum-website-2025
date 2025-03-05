import {
  MediaFigure,
  mediaWrapperVariants,
  Video,
  Zoomable,
  type MediaFigureProps,
  type MediaWrapperProps,
  type VideoProps,
  type ZoomableProps,
} from "@/components/media";
import { cx } from "cva";
import NextImage, { type ImageProps } from "next/image";
import React from "react";
import { splitAspect } from "@/lib/utils";

export type MdxImageProps = Partial<ZoomableProps> &
  Partial<Omit<MediaFigureProps, "children">> &
  Partial<MediaWrapperProps> &
  ImageProps & {
    caption?: React.ReactNode;
    aspect?: number;
  };

export type ZoomableVideoProps = Omit<VideoProps, "className"> &
  Partial<Omit<MediaFigureProps, "children">> &
  Partial<MediaWrapperProps> & {
    caption?: React.ReactNode;
  };

/**
 * Shared function to process media properties like dimensions and captions
 */
function processMediaProps(
  src: ImageProps["src"] | string | undefined,
  alt: string = "",
  width: string | number | undefined,
  height: string | number | undefined,
  aspect: number | undefined,
  caption: React.ReactNode | undefined
) {
  // Process caption
  let extractedCaption = caption;
  let cleanAlt = alt;

  const captionMatch = alt.match(/\[caption:\s*(.*?)\]/);
  if (captionMatch) {
    extractedCaption = captionMatch[1];
    cleanAlt = alt.replace(captionMatch[0], "").trim();
  }

  // Use splitAspect to get the dimensions from aspect ratio
  const { width: aspectWidth, height: aspectHeight } = splitAspect(aspect);

  // If explicit dimensions were provided, use those instead
  let calculatedWidth = width ? Number(width) : aspectWidth;
  let calculatedHeight = height ? Number(height) : aspectHeight;

  // If one dimension is missing, calculate it
  if (!width && height) {
    calculatedWidth = Math.round(Number(height) * (aspectWidth / aspectHeight));
  } else if (width && !height) {
    calculatedHeight = Math.round(Number(width) / (aspectWidth / aspectHeight));
  }

  const isPortrait = Boolean(
    calculatedHeight && calculatedWidth && calculatedHeight > calculatedWidth
  );

  return {
    src,
    cleanAlt,
    extractedCaption,
    width: calculatedWidth,
    height: calculatedHeight,
    isPortrait,
  };
}

export function ZoomableImage(props: MdxImageProps) {
  const {
    src,
    alt = "",
    width,
    height,
    aspect,
    priority = false,
    caption,
    border,
    background,
    rounded,
  } = props;

  // Add this line before processMediaProps call to standardize aspect handling
  const standardizedAspect =
    typeof aspect === "string" || typeof aspect === "number"
      ? aspect
      : undefined;

  const {
    cleanAlt,
    extractedCaption,
    width: calculatedWidth,
    height: calculatedHeight,
    isPortrait,
  } = processMediaProps(src, alt, width, height, standardizedAspect, caption);

  // Ensure we have dimensions for NextImage
  if (!calculatedHeight && !calculatedWidth) {
    console.warn("Image missing dimensions, using defaults");
  }

  return (
    <Zoomable className="py-w4 first:pt-0">
      <MediaFigure caption={extractedCaption} isPortrait={isPortrait}>
        <NextImage
          src={src}
          alt={cleanAlt}
          width={calculatedWidth || 1600} // Default width if not calculated
          height={calculatedHeight || 1000} // Default height if not calculated
          priority={priority}
          sizes="(min-width: 660px) 620px, 100vw"
          draggable={false}
          className={cx(mediaWrapperVariants({ border, background, rounded }))}
        />
      </MediaFigure>
    </Zoomable>
  );
}

export function ZoomableVideo(props: ZoomableVideoProps) {
  const {
    src,
    poster,
    width,
    height,
    caption,
    aspect,
    border,
    background,
    rounded,
    allowSound,
    ...rest
  } = props;

  const altText = "";
  const { extractedCaption, isPortrait } = processMediaProps(
    src,
    altText,
    width,
    height,
    aspect,
    caption
  );

  // Video component already handles proper aspect ratio formatting internally
  return (
    <Zoomable className="py-w4 first:pt-0">
      <MediaFigure caption={extractedCaption} isPortrait={isPortrait}>
        <Video
          src={typeof src === "string" ? src : ""}
          poster={poster || ""}
          aspect={typeof aspect === "number" ? aspect : 16 / 9}
          allowSound={allowSound}
          className={cx(mediaWrapperVariants({ border, background, rounded }))}
          {...rest}
        />
      </MediaFigure>
    </Zoomable>
  );
}
