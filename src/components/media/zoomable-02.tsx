"use client";

/**
 * Zoomable - Simple inline zoom component
 *
 * Width changes preserve inline flow while CSS Grid keeps expanded content centered.
 *
 * The server and the client's first render must produce identical markup, so
 * nothing here reads the viewport during render: responsive width lives in
 * CSS (`md:`), and mobile zoom-disabling is checked at click time.
 */

import { ReactNode, useEffect, useRef, useState } from "react";
import { centerInViewport } from "@/lib/center-in-viewport";
import { cn } from "@/lib/utils";

export type ZoomableProps = {
  children: ReactNode;
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
  scaleAmount = 2,
  transitionDuration = 0.3,
  className,
  disableOnMobile = true,
  mobileBreakpoint = 768,
  aspect,
}: ZoomableProps) {
  const contentRef = useRef<HTMLButtonElement | HTMLDivElement | null>(null);
  const setContentRef = (node: HTMLButtonElement | HTMLDivElement | null) => {
    contentRef.current = node;
  };
  const [isZoomed, setIsZoomed] = useState(false);

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
  const isZoomable = !isPortraitOrSquare;

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
  }, [isZoomed]);

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

  const handleZoom = () => {
    if (!isZoomable) return;
    // Viewport is only read here, inside the event handler, never at render.
    if (disableOnMobile && window.innerWidth < mobileBreakpoint) return;
    setIsZoomed((zoomed) => !zoomed);
  };

  const contentClassName = cn(
    isZoomable && (isZoomed ? "md:cursor-zoom-out" : "md:cursor-zoom-in"),
    isZoomable &&
      "block w-full border-0 bg-transparent p-0 text-left font-[inherit]"
  );

  const contentStyle = {
    width: isZoomed
      ? `min(calc(100% * ${scaleAmount}), ${zoomedMaxVw * 100}vw)`
      : "100%",
    transition: `all ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
    position: "relative" as const,
    zIndex: isZoomed ? 49 : 1,
  };

  return (
    <div
      // NB! We rely on an exact sentence case for CSS styling in mdx-prose
      data-component="Zoomable"
      className={cn("md:w-text w-full", className)}
      style={{
        display: "grid",
        justifyItems: "center",
        position: "relative",
        margin: "0 auto",
        overflow: "visible", // Allow content to overflow
      }}
    >
      {isZoomable ? (
        <button
          type="button"
          ref={setContentRef}
          onClick={handleZoom}
          aria-pressed={isZoomed}
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          data-zoomed={isZoomed || undefined}
          className={contentClassName}
          style={contentStyle}
        >
          {children}
        </button>
      ) : (
        <div
          ref={setContentRef}
          data-zoomed={isZoomed || undefined}
          className={contentClassName}
          style={contentStyle}
        >
          {children}
        </div>
      )}
    </div>
  );
}
