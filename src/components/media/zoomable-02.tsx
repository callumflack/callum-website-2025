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
};

export function Zoomable({
  children,
  maxWidth = CONTAINER_TEXT_WIDTH,
  scaleAmount = 2,
  transitionDuration = 0.3,
  className,
  disableOnMobile = true,
  mobileBreakpoint = 768,
}: ZoomableProps) {
  const { width: viewportWidth } = useWindowSize();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const baseWidthRef = useRef<number | null>(null);

  // Determine if on mobile
  const isMobile = viewportWidth < mobileBreakpoint;
  const desktopMaxWidthVw = 0.9;

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
    // If a className is provided, wrap children in a simple div with that className. This helps maintain any layout/spacing applied via className (e.g., mediaSpacing)
    if (className) {
      return (
        <div data-component="Zoomable-mobile" className={className}>
          {children}
        </div>
      );
    }
    // Otherwise, render children directly
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

  // Calculate dimensions
  const measuredWidth =
    contentRef.current?.getBoundingClientRect().width ?? undefined;
  const baseWidth = isMobile
    ? (baseWidthRef.current ?? measuredWidth ?? viewportWidth)
    : Math.min(maxWidth, viewportWidth * desktopMaxWidthVw);
  const calculatedOriginalWidth = isMobile
    ? Math.min(baseWidth, viewportWidth)
    : baseWidth;

  const zoomedWidth = Math.min(
    calculatedOriginalWidth * scaleAmount,
    viewportWidth * 0.95
  );
  const offset = isZoomed ? (calculatedOriginalWidth - zoomedWidth) / 2 : 0;

  return (
    <div
      // NB! We rely on an exact sentence case for CSS styling in mdx-prose
      data-component="Zoomable"
      className={className}
      style={{
        width: isMobile
          ? "100%"
          : (`min(${maxWidth}px, ${desktopMaxWidthVw * 100}vw)` as const), // cap by px, but scale down with viewport
        position: "relative",
        margin: "0 auto",
        overflow: "visible", // Allow content to overflow
      }}
    >
      <div
        ref={contentRef}
        onClick={handleZoom}
        style={{
          width: isZoomed ? zoomedWidth : "100%", // Inner content takes 100% of parent
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
