"use client";

import { useState, ReactNode } from "react";
import { CONTAINER_TEXT_WIDTH } from "@/lib/constants";

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
  scaleAmount = 1.5,
  transitionDuration = 0.3,
  className,
}: ZoomableProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const zoomedWidth = maxWidth * scaleAmount;

  return (
    <div
      data-component="Zoomable"
      className={className}
      onClick={() => setIsZoomed(!isZoomed)}
      style={{
        width: isZoomed ? zoomedWidth : maxWidth,
        transition: `width ${transitionDuration}s ease`,
        cursor: isZoomed ? "zoom-out" : "zoom-in",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}
