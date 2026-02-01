/* eslint-disable */
// @ts-nocheck

/**
 * ============================================================================
 * ⚠️  LEGACY FILE - DO NOT MAINTAIN ⚠️
 * ============================================================================
 *
 * This file is kept as a DESIGN REFERENCE ONLY.
 * It is NOT imported anywhere and is NOT part of the build.
 *
 * The active implementation is: zoomable-02.tsx
 *
 * If you need zoom functionality, use zoomable-02.tsx instead.
 * Do NOT spend time fixing, updating, or refactoring this file.
 *
 * See: docs/251218-zoom-gallery-refactor.md
 * ============================================================================
 */

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
  disableOnMobile = true, // Default to disable on mobile
  mobileBreakpoint = 768, // Default tablet/mobile breakpoint
}: EnhancedZoomableProps) {
  // Internal state is only used when not controlled
  const [internalIsZoomed, setInternalIsZoomed] = useState(false);

  // Use either the external or internal state based on isControlled
  const isZoomedState = isControlled ? externalIsZoomed : internalIsZoomed;

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // "Keeping track of" state
  const { width: viewportWidth, height: viewportHeight } = useWindowSize();
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  // Determine if on mobile
  const isMobile = viewportWidth < mobileBreakpoint;
  // Enable zoom only if not on mobile or mobile zooming is not disabled
  const zoomEnabled = !(isMobile && disableOnMobile);

  // IntersectionObserver to detect whether content is visible
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // If content is at least 10% visible
        setIsVisible(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.1 } // 10% visibility is enough
    );

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  // Measure the content height in a single place using requestAnimationFrame
  useEffect(() => {
    if (!contentRef.current) return;

    let frameId: number | null = null;

    const measureHeight = () => {
      frameId = requestAnimationFrame(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.offsetHeight);
        }
      });
    };

    // Measure once on mount
    measureHeight();

    // Setup resize observer that calls measureHeight again on resize
    resizeObserverRef.current = new ResizeObserver(measureHeight);
    resizeObserverRef.current.observe(contentRef.current);

    // Cleanup
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Re-measure if viewport changes or element becomes visible again
  useEffect(() => {
    if (!contentRef.current || !isVisible) return;

    // Single call that triggers requestAnimationFrame in measureHeight
    // Disconnect first to re-attach
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current?.observe(contentRef.current);
  }, [isVisible, viewportWidth, viewportHeight]);

  // Update wrapper height when zoom changes
  useEffect(() => {
    // If we have a wrapper and a known contentHeight
    if (wrapperRef.current && contentHeight > 0) {
      // If zoomed, multiply by scale; else normal
      wrapperRef.current.style.height = isZoomedState
        ? `${contentHeight * scaleAmount}px`
        : `${contentHeight}px`;
    }
  }, [isZoomedState, contentHeight, scaleAmount]);

  // Center the element in the viewport when zoomed
  useEffect(() => {
    if (!isZoomedState || !contentRef.current) return;

    requestAnimationFrame(() => {
      if (!contentRef.current) return;

      // Get current size (pre-transform or mid-transform)
      const rect = contentRef.current.getBoundingClientRect();
      // Pre-calculate the final size when transform completes
      const finalHeight = contentHeight * scaleAmount;
      // Calculate where it should be positioned
      const idealTop = (window.innerHeight - finalHeight) / 2;
      // Calculate where it will be positioned
      const projectedTop = rect.top;
      // Calculate how far to scroll
      const scrollBy = projectedTop - idealTop;

      window.scrollBy({ top: scrollBy, behavior: "smooth" });
    });
  }, [isZoomedState, contentHeight, scaleAmount]);

  // MEASUREMENT TESTS
  // useEffect(() => {
  //   if (!isZoomedState || !contentRef.current) return;
  //
  //   // First get pre-transform measurements
  //   const preRect = contentRef.current.getBoundingClientRect();
  //   console.log("PRE-SCROLL MEASUREMENTS:");
  //   console.log({
  //     elementTop: preRect.top,
  //     elementBottom: preRect.bottom,
  //     elementHeight: preRect.height,
  //     visualCenter: preRect.top + preRect.height / 2,
  //     viewportHeight: window.innerHeight,
  //     viewportCenter: window.innerHeight / 2,
  //     windowScrollY: window.scrollY,
  //   });
  //
  //   // Wait for transform to settle, then check again
  //   setTimeout(
  //     () => {
  //       if (!contentRef.current) return;
  //       const postRect = contentRef.current.getBoundingClientRect();
  //       console.log("POST-TRANSFORM MEASUREMENTS:");
  //       console.log({
  //         elementTop: postRect.top,
  //         elementBottom: postRect.bottom,
  //         elementHeight: postRect.height,
  //         visualCenter: postRect.top + postRect.height / 2,
  //         viewportHeight: window.innerHeight,
  //         viewportCenter: window.innerHeight / 2,
  //       });
  //     },
  //     transitionDuration * 1000 + 50
  //   );
  // }, [isZoomedState, transitionDuration]);

  // Memoize the zoom handler
  const handleZoom = useCallback(() => {
    if (!zoomEnabled) return;

    if (!isControlled) {
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
          // Prevent breaking page layout
          overflow: "hidden",
        }}
      >
        <div
          ref={contentRef}
          onClick={handleZoom}
          style={{
            width: "100%",
            // transition from normal state to the zoomed scaleAmount
            transition: `transform ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
            cursor: zoomEnabled
              ? isZoomedState
                ? "zoom-out"
                : "zoom-in"
              : "default",
            transform: isZoomedState ? `scale(${scaleAmount})` : "scale(1)",
            // keep the element centered in the viewport on zoom
            transformOrigin: "center top",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: isZoomedState ? 49 : 1,
            willChange: "transform",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
