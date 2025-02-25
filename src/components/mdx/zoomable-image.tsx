"use client";

import { cx } from "cva";
// import Image, { ImageProps } from "next/image";
import Image from "next/image";
import { useState } from "react";

type ZoomableImageProps = {
  src: string;
  alt: string;
  maxWidth?: number;
  aspectRatio?: number;
  transitionDuration?: number;
  scaleAmount?: number;
};

export function ZoomableImage({
  src,
  alt,
  maxWidth = 620,
  aspectRatio = 16 / 9,
  transitionDuration = 0.3,
  scaleAmount = 1.5,
}: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Calculate zoomed width
  const zoomedWidth = maxWidth * scaleAmount;

  return (
    <div
      className="ZoomableImage mx-auto"
      style={{
        aspectRatio: aspectRatio,
        // Container width changes based on zoom state
        width: isZoomed ? zoomedWidth : maxWidth,
        transition: `width ${transitionDuration}s ease`,
        position: "relative",
      }}
    >
      <figure
        onClick={() => setIsZoomed(!isZoomed)}
        className={cx(
          "h-full w-full cursor-zoom-in",
          isZoomed && "cursor-zoom-out"
        )}
      >
        <Image
          src={src}
          alt={alt}
          // className="h-full w-full object-cover"
          fill
          sizes="(min-width: 660px) 620px, 100vw"
          draggable={false}
        />
      </figure>
    </div>
  );
}
