"use client";

/**
 * Zoomable - Simple inline zoom component
 *
 * This component provides a basic zoom functionality that expands content
 * while keeping it within its original document flow. It's best suited for:
 *
 * - Inline content like images or videos in articles/blog posts
 * - Cases where you want content to expand in place without affecting surrounding layout
 * - Situations where you want to limit the maximum zoom width
 *
 * Key behaviors:
 * - Manages its own zoom state internally
 * - Expands content by changing its actual width (not using CSS scale transforms)
 * - Calculates optimal zoom width based on available space
 * - Applies horizontal offset to keep content centered
 * - Scrolls the page to center the zoomed content vertically
 *
 * @see EnhancedZoomable - For a more advanced zoom with viewport centering and external control
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
  verticalOffset?: number; // Percentage of viewport height to offset (negative = up)
};

export function Zoomable({
  children,
  maxWidth = CONTAINER_TEXT_WIDTH,
  scaleAmount = 2,
  transitionDuration = 0.3,
  className,
  verticalOffset = -10, // Default to move it up 10% of the viewport height
}: ZoomableProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { width: viewportWidth, height: viewportHeight } = useWindowSize();
  const [originalWidth, setOriginalWidth] = useState(maxWidth);

  useEffect(() => {
    if (ref.current) {
      setOriginalWidth(ref.current.offsetWidth);
    }
  }, []);

  // Handle zoom change and ensure component is vertically centered when zoomed
  useEffect(() => {
    if (!isZoomed || !ref.current) return;

    // Wait a tick to ensure DOM measurements are accurate after state changes
    setTimeout(() => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();

      // Calculate where the center of the element should be
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Calculate the ideal scroll position to center the element
      const elementCurrentTop = rect.top + window.scrollY;
      const elementCurrentCenter = elementCurrentTop + elementHeight / 2;

      // Apply vertical offset as percentage of viewport height
      const offsetPixels = (verticalOffset / 100) * viewportHeight;
      const viewportCenter = viewportHeight / 2 + offsetPixels;

      const targetScrollY = elementCurrentCenter - viewportCenter;

      // Smooth scroll to center the element vertically (with offset)
      window.scrollTo({
        top: targetScrollY,
        behavior: "smooth",
      });
    }, 10); // Small delay to ensure measurements are correct
  }, [isZoomed, verticalOffset, viewportHeight]);

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const zoomedWidth = Math.min(maxWidth * scaleAmount, viewportWidth * 0.95);
  const offset = isZoomed ? (maxWidth - zoomedWidth) / 2 : 0;

  return (
    <div
      data-component="Zoomable"
      className={className}
      style={{
        width: maxWidth,
        position: "relative",
        overflow: "visible",
      }}
    >
      <div
        ref={ref}
        onClick={handleZoom}
        style={{
          width: isZoomed ? zoomedWidth : originalWidth,
          transition: `all ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
          cursor: isZoomed ? "zoom-out" : "zoom-in",
          transform: `translateX(${offset}px)`,
          transformOrigin: "center",
          position: "relative",
          zIndex: isZoomed ? 49 : 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
