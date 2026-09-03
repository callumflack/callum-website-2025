"use client";

/**
 * Zoomable — inline zoom. Grid centers; width stays in flow.
 *
 * Rest width is NOT owned here. MDX passes it via className (`mdxMediaClass`):
 * default `md:w-text`, breathe `text + 2×super`. Do not put `md:w-text` back
 * on this wrapper — breathe cannot win against it.
 *
 * Open width IS owned here: `scaleAmount × --container-text`, capped to the
 * content well. Never `100% * scaleAmount` or `70vw` — those follow rest
 * width / sit below 2×text on normal screens, so breathe barely moves.
 * Set it as an inline style on this wrapper so it beats the rest class.
 *
 * SSR: no viewport reads during render. `md:` for rest; mobile disable at click.
 */

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
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

  const zoomedWidth = `min(calc(var(--container-text) * ${scaleAmount}), calc(100vw - 2 * var(--spacing-inset)))`;

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
    width: "100%",
    transition: `all ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
    position: "relative" as const,
    zIndex: isZoomed ? 49 : 1,
  };

  return (
    <div
      // NB! We rely on an exact sentence case for CSS styling in mdx-prose
      data-component="Zoomable"
      className={cn("w-full", className)}
      style={{
        display: "grid",
        justifyItems: "center",
        position: "relative",
        margin: "0 auto",
        overflow: "visible",
        width: isZoomed ? zoomedWidth : undefined,
        transition: `width ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
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
