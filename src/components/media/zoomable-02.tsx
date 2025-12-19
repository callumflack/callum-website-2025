"use client";

/**
 * Zoomable - Simple inline zoom component
 *
 * Now using CSS transforms instead of width changes for more consistent behavior
 */

import { useState, ReactNode, useRef, useEffect } from "react";
import { CONTAINER_TEXT_WIDTH } from "@/lib/constants";
import { useWindowSize } from "react-use";
import { centerInViewport } from "@/lib/center-in-viewport";

export type ZoomableProps = {
  children: ReactNode;
  maxWidth?: number;
  scaleAmount?: number;
  transitionDuration?: number;
  className?: string;
  disableOnMobile?: boolean;
  mobileBreakpoint?: number;
  /** Aspect ratio in "width-height" format (e.g. "16-9", "3-4"). Portrait/square images don't zoom. */
  aspect?: string;
};

export function Zoomable({
  children,
  maxWidth = CONTAINER_TEXT_WIDTH,
  scaleAmount = 2,
  transitionDuration = 0.3,
  className,
  disableOnMobile = true,
  mobileBreakpoint = 768,
  aspect,
}: ZoomableProps) {
  const { width: viewportWidth } = useWindowSize();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const baseWidthRef = useRef<number | null>(null);

  // Determine if on mobile
  const isMobile = viewportWidth < mobileBreakpoint;

  // Controls the ZOOMED (open) state max width as fraction of viewport (0.7 = 70vw)
  const zoomedMaxVw = 0.7;

  // Parse aspect ratio to detect portrait/square (no zoom for these)
  const aspectRatio = aspect
    ? (() => {
        const [w, h] = aspect.split("-").map(Number);
        return w && h ? w / h : 1;
      })()
    : null; // null if no aspect provided, assume landscape
  const isPortraitOrSquare = aspectRatio !== null && aspectRatio <= 1;

  // Center element in viewport when zoomed
  useEffect(() => {
    if (!isZoomed || !contentRef.current) return;

    let raf1 = 0;
    let raf2 = 0;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = contentRef.current;
        if (!el) return;
        centerInViewport(el, { behavior: "smooth", thresholdPx: 1 });
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isZoomed, scaleAmount, viewportWidth]);

  // Re-center while zoomed if the content size changes (e.g. image/video load)
  useEffect(() => {
    if (!isZoomed) return;
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    let rafId = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const current = contentRef.current;
        if (!current) return;
        centerInViewport(current, { behavior: "smooth", thresholdPx: 1 });
      });
    });

    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [isZoomed]);

  // If on mobile and zooming is disabled, render children directly
  // We might want to pass down className for layout consistency
  if (isMobile && disableOnMobile) {
    if (className) {
      return (
        <div data-component="Zoomable-mobile" className={className}>
          {children}
        </div>
      );
    }
    return <>{children}</>;
  }

  // Portrait/square images don't zoom — just render without zoom behavior
  if (isPortraitOrSquare) {
    if (className) {
      return (
        <div data-component="Zoomable-portrait" className={className}>
          {children}
        </div>
      );
    }
    return <>{children}</>;
  }

  const handleZoom = () => {
    if (!(isMobile && disableOnMobile)) {
      // Capture the current base width at the moment we zoom in (useful when width is responsive).
      if (!isZoomed) {
        const el = contentRef.current;
        if (el) baseWidthRef.current = el.getBoundingClientRect().width;
      }
      setIsZoomed(!isZoomed);
    }
  };

  // Calculate dimensions (baseline = zoomed-out width)
  const baseWidth = isMobile
    ? (baseWidthRef.current ?? viewportWidth)
    : maxWidth;
  const calculatedOriginalWidth = isMobile
    ? Math.min(baseWidth, viewportWidth)
    : baseWidth;

  // Calculate zoomed width (landscape only — portrait/square already returned above)
  const zoomedWidth = Math.min(
    calculatedOriginalWidth * scaleAmount,
    viewportWidth * zoomedMaxVw
  );

  const offset = isZoomed ? (calculatedOriginalWidth - zoomedWidth) / 2 : 0;

  return (
    <div
      // NB! We rely on an exact sentence case for CSS styling in mdx-prose
      data-component="Zoomable"
      className={className}
      style={{
        width: isMobile ? "100%" : maxWidth,
        position: "relative",
        margin: "0 auto",
        overflow: "visible", // Allow content to overflow
      }}
    >
      <div
        ref={contentRef}
        onClick={handleZoom}
        data-zoomed={isZoomed || undefined}
        style={{
          width: isZoomed ? zoomedWidth : "100%",
          transition: `all ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
          cursor: !(isMobile && disableOnMobile)
            ? isZoomed
              ? "zoom-out"
              : "zoom-in"
            : "default",
          transform: `translateX(${offset}px)`,
          position: "relative",
          zIndex: isZoomed ? 49 : 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
