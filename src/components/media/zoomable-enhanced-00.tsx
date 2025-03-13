"use client";

import { useState, ReactNode, useRef, useEffect } from "react";
import { CONTAINER_TEXT_WIDTH } from "@/lib/constants";
import { useWindowSize } from "react-use";

export type EnhancedZoomableProps = {
  children: ReactNode;
  maxWidth?: number | "full";
  scaleAmount?: number;
  transitionDuration?: number;
  className?: string;
  onZoomChange?: (isZoomed: boolean) => void;
  fullWidthWhenZoomed?: boolean;
};

export function EnhancedZoomable({
  children,
  maxWidth = CONTAINER_TEXT_WIDTH,
  scaleAmount = 1.5,
  transitionDuration = 0.3,
  className,
  onZoomChange,
  fullWidthWhenZoomed,
}: EnhancedZoomableProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { width: viewportWidth, height: viewportHeight } = useWindowSize();

  useEffect(() => {
    // We could add additional logic here if needed
    // For example, adjusting scale based on viewport size
  }, [viewportWidth, viewportHeight]);

  const handleZoom = () => {
    const newZoomState = !isZoomed;
    setIsZoomed(newZoomState);

    // Call the callback with the new zoom state
    if (onZoomChange) {
      onZoomChange(newZoomState);
    }
  };

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
      <div
        ref={ref}
        onClick={handleZoom}
        style={{
          width: "100%",
          transition: `transform ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
          cursor: isZoomed ? "zoom-out" : "zoom-in",
          transform: isZoomed ? `scale(${scaleAmount})` : "scale(1)",
          transformOrigin: "center top",
          position: "relative",
          margin: "0 auto",
          zIndex: isZoomed ? 10 : 1,
          ...(isZoomed && {
            maxHeight: fullWidthWhenZoomed
              ? `${viewportHeight / scaleAmount}px`
              : undefined,
          }),
        }}
      >
        {children}
      </div>
    </div>
  );
}
