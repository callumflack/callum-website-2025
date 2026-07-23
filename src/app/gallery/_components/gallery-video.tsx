"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getAspectRatioCSS } from "@/components/media/media-utils";
import { cn } from "@/lib/utils";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function GalleryVideo({
  alt,
  aspect,
  autoplayDelay,
  className,
  height,
  poster,
  preload,
  sizes,
  src,
  width,
}: {
  alt: string;
  aspect: string;
  autoplayDelay: number;
  className: string;
  height: number;
  poster: string;
  preload: boolean;
  sizes: string;
  src: string;
  width: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAutoplayReady, setIsAutoplayReady] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const aspectRatio = getAspectRatioCSS(aspect);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") {
      setIsNearViewport(true);
      setIsVisible(true);
      return;
    }

    const sourceObserver = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
        if (!entry.isIntersecting) setIsAutoplayReady(false);
      },
      { rootMargin: "240px 0px" }
    );
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );

    sourceObserver.observe(root);
    visibilityObserver.observe(root);
    return () => {
      sourceObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isNearViewport) return;

    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    let timeoutId: number | undefined;

    const clearSchedule = () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      window.removeEventListener("load", scheduleAutoplay);
    };
    const scheduleAutoplay = () => {
      clearSchedule();
      if (motionQuery.matches) return;

      timeoutId = window.setTimeout(
        () => setIsAutoplayReady(true),
        autoplayDelay
      );
    };
    const scheduleAfterLoad = () => {
      clearSchedule();
      if (motionQuery.matches) return;

      if (autoplayDelay === 0 || document.readyState === "complete") {
        scheduleAutoplay();
      } else {
        window.addEventListener("load", scheduleAutoplay, { once: true });
      }
    };
    const handleMotionChange = () => {
      clearSchedule();
      setIsAutoplayReady(false);
      if (!motionQuery.matches) scheduleAfterLoad();
    };

    motionQuery.addEventListener("change", handleMotionChange);
    scheduleAfterLoad();

    return () => {
      clearSchedule();
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [autoplayDelay, isNearViewport]);

  useEffect(() => {
    const video = videoRef.current;
    if (!isAutoplayReady || !video) return;

    if (isVisible) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isAutoplayReady, isNearViewport, isVisible]);

  return (
    <div className="relative w-full" ref={rootRef} style={{ aspectRatio }}>
      <Image
        alt={alt}
        className={cn(className, "absolute inset-0 h-full w-full")}
        height={height}
        preload={preload}
        sizes={sizes}
        src={poster}
        width={width}
      />
      {isAutoplayReady && isNearViewport && !hasError ? (
        <video
          aria-label={alt}
          className={cn(className, "absolute inset-0 h-full w-full")}
          loop
          muted
          onError={() => setHasError(true)}
          playsInline
          preload="none"
          ref={videoRef}
          src={src}
        />
      ) : null}
    </div>
  );
}
