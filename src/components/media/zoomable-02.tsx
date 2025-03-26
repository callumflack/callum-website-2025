"use client";

/**
 * Zoomable - Simple inline zoom component
 *
 * Now using CSS transforms instead of width changes for more consistent behavior
 */

import { useState, ReactNode, useRef, useEffect } from "react";
import { CONTAINER_TEXT_WIDTH } from "@/lib/constants";
import { useWindowSize } from "react-use";

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
  const [isZoomed, setIsZoomed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { width: viewportWidth } = useWindowSize();
  const [originalWidth, setOriginalWidth] = useState(maxWidth);
  const [contentHeight, setContentHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);

  // Measure content dimensions on mount
  useEffect(() => {
    if (contentRef.current) {
      const width = contentRef.current.offsetWidth;
      const height = contentRef.current.offsetHeight;
      setOriginalWidth(width);
      setContentHeight(height);
      setAspectRatio(width / height);
    }
  }, []);

  // Center element in viewport when zoomed
  useEffect(() => {
    if (!isZoomed || !contentRef.current) return;

    requestAnimationFrame(() => {
      if (!contentRef.current) return;

      // Calculate final dimensions after zoom
      const zoomedWidth = Math.min(
        originalWidth * scaleAmount,
        viewportWidth * 0.95
      );
      // Maintain aspect ratio
      const finalHeight = zoomedWidth / aspectRatio;

      // Current position
      const rect = contentRef.current.getBoundingClientRect();

      // Ideal position (centered)
      const idealTop = (window.innerHeight - finalHeight) / 2;

      // How far to scroll to center it
      const scrollBy = rect.top - idealTop;

      window.scrollBy({ top: scrollBy, behavior: "smooth" });
    });
  }, [
    isZoomed,
    originalWidth,
    contentHeight,
    aspectRatio,
    scaleAmount,
    viewportWidth,
  ]);

  const handleZoom = () => {
    if (!(viewportWidth < mobileBreakpoint && disableOnMobile)) {
      setIsZoomed(!isZoomed);
    }
  };

  // Calculate dimensions
  const zoomedWidth = Math.min(
    originalWidth * scaleAmount,
    viewportWidth * 0.95
  );
  const offset = isZoomed ? (originalWidth - zoomedWidth) / 2 : 0;

  return (
    <div
      data-component="Zoomable"
      className={className}
      style={{
        width: maxWidth,
        position: "relative",
        margin: "0 auto",
        overflow: "visible", // Allow content to overflow
      }}
    >
      <div
        ref={contentRef}
        onClick={handleZoom}
        style={{
          width: isZoomed ? zoomedWidth : "100%",
          transition: `all ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
          cursor: !(viewportWidth < mobileBreakpoint && disableOnMobile)
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
