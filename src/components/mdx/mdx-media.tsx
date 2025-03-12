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
import { calculateMissingDimension } from "@/components/media/utils";
import { cx } from "cva";
import NextImage, { type ImageProps } from "next/image";
import React from "react";

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

  // Convert string dimensions to numbers if needed
  const numericWidth = width ? Number(width) : undefined;
  const numericHeight = height ? Number(height) : undefined;

  // Calculate dimensions based on aspect ratio
  const { width: calculatedWidth, height: calculatedHeight } =
    calculateMissingDimension(numericWidth, numericHeight, aspect);

  const isPortrait = Boolean(
    calculatedHeight && calculatedWidth && calculatedHeight > calculatedWidth
  );

  return {
    cleanAlt,
    extractedCaption,
    width: calculatedWidth,
    height: calculatedHeight,
    isPortrait,
  };
}

const mediaSpacing = "py-w6 first:pt-0";

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

  // Make sure we're only passing numeric aspect ratios
  const standardizedAspect = typeof aspect === "number" ? aspect : undefined;

  const {
    cleanAlt,
    extractedCaption,
    width: calculatedWidth,
    height: calculatedHeight,
    isPortrait,
  } = processMediaProps(alt, width, height, standardizedAspect, caption);

  // Ensure we have dimensions for NextImage
  if (!calculatedHeight && !calculatedWidth) {
    console.warn("Image missing dimensions, using defaults");
  }

  return (
    <Zoomable className={mediaSpacing}>
      <MediaFigure caption={extractedCaption} isPortrait={isPortrait}>
        <NextImage
          src={src}
          alt={cleanAlt}
          width={calculatedWidth}
          height={calculatedHeight}
          priority={priority}
          sizes="(min-width: 660px) 600px, 400px" // TODO: adjust based on isZoomed?
          draggable={false}
          className={cx(mediaWrapperVariants({ border, background, rounded }))}
          style={aspect ? { aspectRatio: aspect } : undefined}
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

  // Make sure we're only passing numeric aspect ratios
  const standardizedAspect = typeof aspect === "number" ? aspect : undefined;

  const altText = "";
  const { extractedCaption, isPortrait } = processMediaProps(
    altText,
    width,
    height,
    standardizedAspect,
    caption
  );

  // Video component already handles proper aspect ratio formatting internally
  return (
    <Zoomable className={mediaSpacing}>
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
