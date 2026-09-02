"use client";

import {
  layout,
  measureLineStats,
  prepare,
  prepareWithSegments,
} from "@chenglou/pretext";
import {
  Children,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type MasonryItem = {
  hasMedia: boolean;
  id: string;
  summary: string;
  title: string;
  year: string;
};

type Typography = {
  bodyFont: string;
  bodyLineHeight: number;
  metaFont: string;
  metaLineHeight: number;
};

type PositionedItem = {
  height: number;
  left: number;
  top: number;
  width: number;
};

const GAP = 12;
const MEDIA_ASPECT_HEIGHT = 10 / 16;
const MEDIA_TEXT_GAP = 10;
const ROW_SUMMARY_GAP = 4;
const TITLE_ROW_CHROME = 21;

export function MasonryStoryGrid({
  children,
  items,
}: {
  children: ReactNode;
  items: MasonryItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyProbeRef = useRef<HTMLSpanElement>(null);
  const metaProbeRef = useRef<HTMLSpanElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [typography, setTypography] = useState<Typography>();
  const childArray = Children.toArray(children);

  useEffect(() => {
    const container = containerRef.current;
    const bodyProbe = bodyProbeRef.current;
    const metaProbe = metaProbeRef.current;

    if (!container || !bodyProbe || !metaProbe) return;

    const readLayoutInputs = () => {
      const bodyStyle = getComputedStyle(bodyProbe);
      const metaStyle = getComputedStyle(metaProbe);

      setContainerWidth(container.clientWidth);
      setTypography({
        bodyFont: toCanvasFont(bodyStyle),
        bodyLineHeight: Number.parseFloat(bodyStyle.lineHeight),
        metaFont: toCanvasFont(metaStyle),
        metaLineHeight: Number.parseFloat(metaStyle.lineHeight),
      });
    };

    readLayoutInputs();
    void document.fonts.ready.then(readLayoutInputs);

    const observer = new ResizeObserver(readLayoutInputs);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const masonry = useMemo(() => {
    if (!containerWidth || !typography) return undefined;

    const columnCount = getColumnCount(containerWidth);
    const columnWidth =
      (containerWidth - GAP * (columnCount - 1)) / columnCount;
    const columnHeights = Array<number>(columnCount).fill(0);
    const preparedItems = items.map((item) => ({
      summary: prepare(item.summary, typography.metaFont),
      title: prepare(item.title, typography.bodyFont),
      year: prepareWithSegments(item.year, typography.bodyFont),
    }));

    const positions = items.map((item, index): PositionedItem => {
      const column = getShortestColumn(columnHeights);
      const prepared = preparedItems[index];
      const yearWidth = measureLineStats(
        prepared.year,
        columnWidth
      ).maxLineWidth;
      const titleHeight = layout(
        prepared.title,
        Math.max(48, columnWidth - TITLE_ROW_CHROME - yearWidth),
        typography.bodyLineHeight
      ).height;
      const summaryHeight = layout(
        prepared.summary,
        columnWidth,
        typography.metaLineHeight
      ).height;
      const mediaHeight = item.hasMedia
        ? columnWidth * MEDIA_ASPECT_HEIGHT + MEDIA_TEXT_GAP
        : 0;
      const height =
        mediaHeight + titleHeight + ROW_SUMMARY_GAP + summaryHeight;
      const top = columnHeights[column];

      columnHeights[column] = top + height + GAP;

      return {
        height,
        left: column * (columnWidth + GAP),
        top,
        width: columnWidth,
      };
    });

    return {
      height: Math.max(...columnHeights) - GAP,
      positions,
    };
  }, [containerWidth, items, typography]);

  return (
    <div
      className="relative grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:block"
      data-component="MasonryStoryGrid"
      ref={containerRef}
      style={masonry ? { height: masonry.height } : undefined}
    >
      <span
        aria-hidden
        className="text-body pointer-events-none invisible absolute font-medium"
        ref={bodyProbeRef}
      >
        Typography probe
      </span>
      <span
        aria-hidden
        className="text-meta pointer-events-none invisible absolute"
        ref={metaProbeRef}
      >
        Typography probe
      </span>

      {childArray.map((child, index) => {
        const position = masonry?.positions[index];

        return (
          <div
            className={masonry ? "absolute" : undefined}
            data-masonry-item={items[index]?.id}
            key={items[index]?.id ?? index}
            style={
              position
                ? {
                    height: position.height,
                    left: position.left,
                    top: position.top,
                    width: position.width,
                  }
                : undefined
            }
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

function getColumnCount(width: number): number {
  if (width >= 1280) return 5;
  if (width >= 1024) return 4;
  if (width >= 768) return 3;
  return 2;
}

function getShortestColumn(columnHeights: number[]): number {
  let shortest = 0;

  for (let index = 1; index < columnHeights.length; index += 1) {
    if (columnHeights[index] < columnHeights[shortest]) shortest = index;
  }

  return shortest;
}

function toCanvasFont(style: CSSStyleDeclaration): string {
  return `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
}
