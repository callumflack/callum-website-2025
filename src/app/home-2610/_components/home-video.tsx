"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getDimensions } from "@/components/media/media-utils";
import type { HomeSlide } from "./slides";

// Mobile panels subtract the shared 15px gap and responsive w12 × 1.5
// padding on each side. Lazy images can use their actual laid-out width.
export const HOME_MEDIA_SIZES =
  "(width < 660px) calc(100vw - 111px - 48 * clamp(0px, (100vw - 500px) / 700, 1px)), 600px";

export function HomeVideo({
  asset,
  eager,
  first,
}: {
  asset: HomeSlide["asset"];
  eager: boolean;
  first: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const [hasFrame, setHasFrame] = useState(false);
  const { width, height } = getDimensions(asset.aspect);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video && frameRef.current !== null) {
        video.cancelVideoFrameCallback(frameRef.current);
      }
    };
  }, []);

  function revealFrame() {
    const video = videoRef.current;
    if (!video || hasFrame || frameRef.current !== null) return;
    if (typeof video.requestVideoFrameCallback === "function") {
      frameRef.current = video.requestVideoFrameCallback(() => {
        frameRef.current = null;
        setHasFrame(true);
      });
    } else if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setHasFrame(true);
    }
  }

  return (
    <div className="relative h-full w-full" data-slot="home-video">
      <Image
        src={asset.poster!}
        alt={asset.alt}
        width={width}
        height={height}
        quality={75}
        sizes={eager ? HOME_MEDIA_SIZES : `auto, ${HOME_MEDIA_SIZES}`}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={first ? "high" : undefined}
        className="relative z-10 h-full w-full object-contain"
        style={{ visibility: hasFrame ? "hidden" : "visible" }}
        draggable={false}
      />
      <video
        ref={videoRef}
        data-src={asset.src}
        aria-label={asset.alt}
        className="absolute inset-0 h-full w-full object-contain"
        muted
        loop
        playsInline
        preload="none"
        onPlaying={revealFrame}
        onError={() => setHasFrame(false)}
      />
    </div>
  );
}
