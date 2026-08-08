import NextImage, { type ImageProps } from "next/image";
import type React from "react";
import {
  MediaFigure,
  type MediaFigureProps,
  type MediaWrapperProps,
  mediaWrapperVariants,
  Video,
  type VideoProps,
} from "@/components/media";
import {
  type AspectRatio,
  getAspectRatioCSS,
  getImageDimensions,
  isPortrait,
} from "@/components/media/media-utils";
import {
  Zoomable as Zoomable02,
  type ZoomableProps,
} from "@/components/media/zoomable-02";
import { cn } from "@/lib/utils";

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

export const mdxMediaSpacing = "py-small first:pt-0 first:pb-gap";

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
    <Zoomable02 className={mdxMediaSpacing} aspect={aspect}>
      <MediaFigure caption={extractedCaption} isPortrait={isPortrait(aspect)}>
        <NextImage
          src={src}
          alt={cleanAlt}
          width={width}
          height={height}
          priority={priority}
          sizes="(min-width: 1200px) 1800px, (min-width: 660px) 600px, 100vw"
          draggable={false}
          className={cn(mediaWrapperVariants({ border, background, rounded }))}
          style={
            aspect ? { aspectRatio: getAspectRatioCSS(aspect) } : undefined
          }
        />
      </MediaFigure>
    </Zoomable02>
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

  const video = (
    <MediaFigure caption={caption} isPortrait={isPortrait(aspect)}>
      <Video
        src={typeof src === "string" ? src : ""}
        poster={poster || ""}
        aspect={aspect}
        allowSound={allowSound}
        className={cn(mediaWrapperVariants({ border, background, rounded }))}
        {...rest}
      />
    </MediaFigure>
  );

  // Sound videos render a mute <button> inside Video. Zoomable wraps landscape
  // media in a zoom <button>, which is invalid nested-button HTML + hydration error.
  // If we need zoom + sound later, change Zoomable's outer <button> to a
  // focusable div (role="button") instead of skipping zoom here.
  if (allowSound) {
    return <div className={mdxMediaSpacing}>{video}</div>;
  }

  return (
    <Zoomable02 className={mdxMediaSpacing} aspect={aspect}>
      {video}
    </Zoomable02>
  );
}
