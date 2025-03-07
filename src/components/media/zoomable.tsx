"use client";

import { useState, ReactNode, useRef, useEffect } from "react";
import { CONTAINER_TEXT_WIDTH } from "@/lib/constants";
import { useWindowSize } from "react-use";

export type ZoomableProps = {
  children: ReactNode;
  maxWidth?: number;
  scaleAmount?: number;
  transitionDuration?: number;
  className?: string;
};

export function Zoomable({
  children,
  maxWidth = CONTAINER_TEXT_WIDTH,
  scaleAmount = 2,
  transitionDuration = 0.3,
  className,
}: ZoomableProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { width: viewportWidth } = useWindowSize();
  const [originalWidth, setOriginalWidth] = useState(maxWidth);

  useEffect(() => {
    if (ref.current) {
      setOriginalWidth(ref.current.offsetWidth);
    }
  }, []);

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
          transition: `all ${transitionDuration}s ease`,
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
