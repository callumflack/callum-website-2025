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
import type { CategoryType } from "@/types/content";

export type MdxImageProps = Partial<ZoomableProps> &
  Partial<Omit<MediaFigureProps, "children">> &
  Partial<MediaWrapperProps> &
  ImageProps & {
    caption?: React.ReactNode;
    aspect: AspectRatio;
    breathe?: boolean;
    category?: CategoryType;
  };

export type ZoomableVideoProps = Omit<VideoProps, "className"> &
  Partial<Omit<MediaFigureProps, "children">> &
  Partial<MediaWrapperProps> & {
    caption?: React.ReactNode;
    breathe?: boolean;
    category?: CategoryType;
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

export const mdxMediaSpacing = "py-submajor first:pt-0 first:pb-gap";
const mdxMediaSpacingWriting = "py-small first:pt-0 first:pb-gap";

function mediaSpacing(category?: CategoryType) {
  return category === "writing" ? mdxMediaSpacingWriting : mdxMediaSpacing;
}

/** Rest width/rhythm for MDX Image/Video. Open/zoom size lives in zoomable-02. */
export function mdxMediaClass(breathe?: boolean, category?: CategoryType) {
  return cn(
    mediaSpacing(category),
    breathe
      ? "py-submajor mx-auto md:w-[calc(var(--container-text)+2*var(--spacing-super))]"
      : "md:w-text"
  );
}

/** Keep caption on the text column while the frame is breathe-wide. */
const breatheCaptionClass = "md:px-super";

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
    breathe,
    category,
  } = props;

  // console.log("ZoomableImage props:", props);

  const { caption: extractedCaption, cleanAlt } = extractCaption(alt, caption);
  const { width, height } = getImageDimensions(aspect);

  return (
    <Zoomable02 className={mdxMediaClass(breathe, category)} aspect={aspect}>
      <MediaFigure
        caption={extractedCaption}
        captionClassName={breathe ? breatheCaptionClass : undefined}
        isPortrait={isPortrait(aspect)}
      >
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
    breathe,
    category,
    ...rest
  } = props;

  const video = (
    <MediaFigure
      caption={caption}
      captionClassName={breathe ? breatheCaptionClass : undefined}
      isPortrait={isPortrait(aspect)}
    >
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
    return (
      <div
        className={mdxMediaClass(breathe, category)}
        data-component="Zoomable"
      >
        {video}
      </div>
    );
  }

  return (
    <Zoomable02 className={mdxMediaClass(breathe, category)} aspect={aspect}>
      {video}
    </Zoomable02>
  );
}
