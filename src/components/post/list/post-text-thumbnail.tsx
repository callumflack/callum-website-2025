"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { MediaWrapper } from "@/components/media";
import { cn } from "@/lib/utils";

const VIEWBOX_WIDTH = 1600;
const VIEWBOX_HEIGHT = 1000;
const MAX_TEXT_WIDTH = VIEWBOX_WIDTH * 0.6;
const MAX_TEXT_HEIGHT = VIEWBOX_HEIGHT * 0.55;

export function PostTextThumbnail({
  className,
  text,
}: {
  className?: string;
  text: string;
}) {
  const textRef = useRef<SVGTextElement>(null);
  const [transform, setTransform] = useState<string>();

  useLayoutEffect(() => {
    let cancelled = false;

    const fitText = () => {
      const textElement = textRef.current;

      if (!textElement || cancelled) return;

      const context = document.createElement("canvas").getContext("2d");

      if (!context) return;

      const style = getComputedStyle(textElement);
      context.font = `${style.fontStyle} ${style.fontWeight} ${VIEWBOX_HEIGHT}px ${style.fontFamily}`;

      const metrics = context.measureText(text);
      const width =
        metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
      const height =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

      if (!width || !height) return;

      const scale = Math.min(MAX_TEXT_WIDTH / width, MAX_TEXT_HEIGHT / height);
      const centerX =
        (metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft) / 2;
      const centerY =
        (metrics.actualBoundingBoxDescent - metrics.actualBoundingBoxAscent) /
        2;

      setTransform(
        `translate(${VIEWBOX_WIDTH / 2} ${VIEWBOX_HEIGHT / 2}) scale(${scale}) translate(${-centerX} ${-centerY})`
      );
    };

    fitText();
    void document.fonts.ready.then(fitText);

    return () => {
      cancelled = true;
    };
  }, [text]);

  return (
    <MediaWrapper
      aspect="1600-1000"
      className={cn(
        "bg-thumbnail-background text-foreground/72 font-medium",
        className
      )}
    >
      <svg
        aria-hidden="true"
        className="size-full"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      >
        <text
          fill="currentColor"
          fontSize={VIEWBOX_HEIGHT}
          opacity={transform ? 1 : 0}
          ref={textRef}
          transform={transform}
        >
          {text}
        </text>
      </svg>
    </MediaWrapper>
  );
}
