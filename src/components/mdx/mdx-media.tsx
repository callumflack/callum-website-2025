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
import {
  getAspectRatioCSS,
  getImageDimensions,
  isPortrait,
  type AspectRatio,
} from "@/components/media/media-utils";
import { cx } from "cva";
import NextImage, { type ImageProps } from "next/image";
import React from "react";

export type MdxImageProps = Partial<ZoomableProps> &
  Partial<Omit<MediaFigureProps, "children">> &
  Partial<MediaWrapperProps> &
  ImageProps & {
    caption?: React.ReactNode;
    aspect: AspectRatio;
  };

export type ZoomableVideoProps = Omit<VideoProps, "className"> &
  Partial<Omit<MediaFigureProps, "children">> &
  Partial<MediaWrapperProps> & {
    caption?: React.ReactNode;
  };

/**
 * Extract caption from alt text if it contains a caption tag
 */
function extractCaption(alt: string = "", explicitCaption?: React.ReactNode) {
  // Return explicit caption if provided
  if (explicitCaption !== undefined) {
    return { caption: explicitCaption, cleanAlt: alt };
  }

  // Check for caption in alt text
  const captionMatch = alt.match(/\[caption:\s*(.*?)\]/);
  if (captionMatch) {
    return {
      caption: captionMatch[1],
      cleanAlt: alt.replace(captionMatch[0], "").trim(),
    };
  }

  // No caption found
  return { caption: undefined, cleanAlt: alt };
}

const mediaSpacing = "py-w6 first:pt-0";

export function ZoomableImage(props: MdxImageProps) {
  const {
    src,
    alt = "",
    aspect,
    priority = false,
    caption,
    border,
    background,
    rounded,
  } = props;

  // console.log("ZoomableImage props:", props);

  const { caption: extractedCaption, cleanAlt } = extractCaption(alt, caption);
  const { width, height } = getImageDimensions(aspect);

  return (
    <Zoomable className={mediaSpacing}>
      <MediaFigure caption={extractedCaption} isPortrait={isPortrait(aspect)}>
        <NextImage
          src={src}
          alt={cleanAlt}
          width={width}
          height={height}
          priority={priority}
          sizes="(min-width: 660px) 600px, 400px"
          draggable={false}
          className={cx(mediaWrapperVariants({ border, background, rounded }))}
          style={
            aspect ? { aspectRatio: getAspectRatioCSS(aspect) } : undefined
          }
        />
      </MediaFigure>
    </Zoomable>
  );
}

export function ZoomableVideo(props: ZoomableVideoProps) {
  const {
    src,
    poster,
    caption,
    aspect,
    border,
    background,
    rounded,
    allowSound,
    ...rest
  } = props;

  // console.log("ZoomableVideo props:", props);

  return (
    <Zoomable className={mediaSpacing}>
      <MediaFigure caption={caption} isPortrait={isPortrait(aspect)}>
        <Video
          src={typeof src === "string" ? src : ""}
          poster={poster || ""}
          aspect={aspect}
          allowSound={allowSound}
          className={cx(mediaWrapperVariants({ border, background, rounded }))}
          {...rest}
        />
      </MediaFigure>
    </Zoomable>
  );
}
