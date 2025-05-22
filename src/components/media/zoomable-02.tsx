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
  const { width: viewportWidth } = useWindowSize();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [originalWidth, setOriginalWidth] = useState(maxWidth);
  const [contentHeight, setContentHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);

  // Determine if on mobile
  const isMobile = viewportWidth < mobileBreakpoint;

  // Measure content dimensions on mount
  useEffect(() => {
    if (contentRef.current) {
      const width = contentRef.current.offsetWidth;
      const height = contentRef.current.offsetHeight;
      // Set originalWidth based on actual rendered width on mobile if it's smaller than maxWidth
      setOriginalWidth(isMobile ? Math.min(width, viewportWidth) : width);
      setContentHeight(height);
      setAspectRatio(width / height);
    }
  }, [isMobile, viewportWidth]);

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
      setIsZoomed(!isZoomed);
    }
  };

  // Calculate dimensions
  const calculatedOriginalWidth = isMobile
    ? Math.min(originalWidth, viewportWidth)
    : originalWidth;

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
        width: isMobile ? "100%" : maxWidth, // Adjust width for mobile
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
