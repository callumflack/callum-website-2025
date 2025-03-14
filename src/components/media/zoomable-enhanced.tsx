"use client";

/**
 * EnhancedZoomable - Advanced zoom component with viewport centering
 *
 * This component provides a more sophisticated zoom experience that centers
 * content in the viewport and supports external control. It's best suited for:
 *
 * - Full-width content like sliders or galleries
 * - Cases where you want content to be centered in the viewport when zoomed
 * - Situations where zoom state needs to be controlled by a parent component
 * - Content that benefits from being vertically positioned in the viewport
 *
 * Key behaviors:
 * - Can be controlled externally through props or use internal state
 * - Uses CSS scale transforms for smoother zooming (not changing actual dimensions)
 * - Maintains document flow by adjusting wrapper height
 * - Automatically scrolls to center content in the viewport when zoomed
 * - Supports configurable vertical positioning with the verticalOffset prop
 * - Supports full-width content with the "full" maxWidth option
 *
 * @see Zoomable - For a simpler inline zoom that expands content in place
 */

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useWindowSize } from "react-use";

export type EnhancedZoomableProps = {
  children: ReactNode;
  maxWidth?: number | "full";
  scaleAmount?: number;
  transitionDuration?: number;
  className?: string;
  onZoomChange?: (isZoomed: boolean) => void;
  fullWidthWhenZoomed?: boolean;
  isControlled?: boolean;
  isZoomed?: boolean;
  verticalOffset?: number; // Percentage of viewport height to offset (negative = up)
  disableOnMobile?: boolean; // Whether to disable zooming on mobile devices
  mobileBreakpoint?: number; // Width below which device is considered mobile
};

export function EnhancedZoomable({
  children,
  maxWidth = "full",
  scaleAmount = 1.5,
  transitionDuration = 0.3,
  className,
  onZoomChange,
  isControlled = false,
  isZoomed: externalIsZoomed = false,
  verticalOffset = -10, // Default to move it up 10% of the viewport height
  disableOnMobile = true, // Default to disable on mobile
  mobileBreakpoint = 768, // Default tablet/mobile breakpoint
}: EnhancedZoomableProps) {
  // Internal state is only used when not controlled
  const [internalIsZoomed, setInternalIsZoomed] = useState(false);

  // Use either the external or internal state based on isControlled
  const isZoomedState = isControlled ? externalIsZoomed : internalIsZoomed;

  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const { width: viewportWidth, height: viewportHeight } = useWindowSize();
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  // Determine if on mobile
  const isMobile = viewportWidth < mobileBreakpoint;
  // Enable zoom only if not on mobile or mobile zooming is not disabled
  const zoomEnabled = !(isMobile && disableOnMobile);

  // Setup visibility detection
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.1 } // 10% visibility is enough
    );

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  // Measure the height of the content using ResizeObserver for better reliability
  useEffect(() => {
    if (!contentRef.current) return;

    const measureHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.offsetHeight);
      }
    };

    // Initial measurement
    measureHeight();

    // Setup resize observer
    resizeObserverRef.current = new ResizeObserver(measureHeight);
    resizeObserverRef.current.observe(contentRef.current);

    // Cleanup
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Re-measure when component becomes visible or when window size changes
  useEffect(() => {
    if (!contentRef.current || !isVisible) return;

    const measureHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.offsetHeight);
      }
    };

    // Immediate measurement
    measureHeight();

    // Additional measurement after a short delay to catch any late-loading content
    const delayedMeasurement = setTimeout(measureHeight, 300);

    return () => clearTimeout(delayedMeasurement);
  }, [isVisible, viewportWidth, viewportHeight]);

  // Update wrapper height when zoom changes
  useEffect(() => {
    if (wrapperRef.current && contentHeight > 0) {
      wrapperRef.current.style.height = isZoomedState
        ? `${contentHeight * scaleAmount}px`
        : `${contentHeight}px`;
    }
  }, [isZoomedState, contentHeight, scaleAmount]);

  // Handle zoom change and ensure component is vertically centered when zoomed
  useEffect(() => {
    if (!isZoomedState || !contentRef.current) return;

    // Wait a tick to ensure DOM measurements are accurate after state changes
    setTimeout(() => {
      if (!contentRef.current) return;

      const rect = contentRef.current.getBoundingClientRect();

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
  }, [isZoomedState, verticalOffset]);

  // Memoize the zoom handler to prevent recreation on each render
  const handleZoom = useCallback(() => {
    if (!zoomEnabled) return;

    if (!isControlled) {
      // Only update internal state if not controlled
      setInternalIsZoomed((prev) => !prev);
    }

    if (onZoomChange) {
      onZoomChange(!isZoomedState);
    }
  }, [isControlled, isZoomedState, onZoomChange, zoomEnabled]);

  return (
    <div
      data-component="EnhancedZoomable"
      className={className}
      style={{
        width: maxWidth === "full" ? "100%" : maxWidth,
        position: "relative",
        margin: maxWidth === "full" ? "0 auto" : undefined,
      }}
    >
      {/* Wrapper div with controlled height to maintain document flow */}
      <div
        ref={wrapperRef}
        style={{
          width: "100%",
          height: contentHeight ? `${contentHeight}px` : "auto",
          position: "relative",
          transition: `height ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
          overflow: "hidden", // Prevent breaking page layout
        }}
      >
        <div
          ref={contentRef}
          onClick={handleZoom}
          style={{
            width: "100%",
            transition: `transform ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
            cursor: zoomEnabled
              ? isZoomedState
                ? "zoom-out"
                : "zoom-in"
              : "default",
            transform: isZoomedState ? `scale(${scaleAmount})` : "scale(1)",
            transformOrigin: "center top", // Keep original transform origin
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: isZoomedState ? 49 : 1,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
