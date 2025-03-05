"use client";

import { cx } from "cva";
import Image from "next/image";
import { useState } from "react";

export type MediaType = "image" | "video";

export type ZoomableMediaProps = {
  src: string;
  alt?: string;
  type?: MediaType;
  width?: number;
  height?: number;
  maxWidth?: number;
  aspectRatio?: number;
  transitionDuration?: number;
  scaleAmount?: number;
  priority?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
};

export function ZoomableMedia({
  src,
  alt = "",
  type,
  width,
  height,
  maxWidth = 600, // matches --container-text: 600px;
  aspectRatio,
  transitionDuration = 0.3,
  scaleAmount = 1.5,
  priority = false,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
}: ZoomableMediaProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Auto-detect media type if not specified
  const mediaType =
    type || (src.match(/\.(mp4|webm|mov)$/i) ? "video" : "image");

  // Calculate aspect ratio if not provided but width and height are
  const calculatedAspectRatio =
    aspectRatio || (width && height ? width / height : 16 / 9);

  // Calculate zoomed width
  const zoomedWidth = maxWidth * scaleAmount;

  return (
    <div
      className="ZoomableMedia mx-auto"
      style={{
        aspectRatio: calculatedAspectRatio,
        width: isZoomed ? zoomedWidth : maxWidth,
        transition: `width ${transitionDuration}s ease`,
        position: "relative",
      }}
    >
      <figure
        onClick={(e) => {
          e.stopPropagation();
          setIsZoomed(!isZoomed);
        }}
        className={cx(
          "relative h-full w-full",
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        )}
      >
        {mediaType === "image" ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 660px) 620px, 100vw"
            draggable={false}
            priority={priority}
          />
        ) : (
          <video
            src={src}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline={playsInline}
            className="h-full w-full object-cover"
          />
        )}
      </figure>
    </div>
  );
}
