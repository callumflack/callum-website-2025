"use client";

import { Link } from "@/components/atoms";
import { MediaFigure, mediaWrapperVariants } from "@/components/media";
import { cx } from "cva";
import Image from "next/image";
import { memo, useMemo } from "react";
import { slugify } from "@/lib/utils";
import type { Project } from "./projects";
import { useMedia, useWindowSize } from "react-use";

export const GraphicsGrid = memo(
  ({ projects, cols }: { projects: Project[]; cols: number }) => {
    // Replace manual media query with useMedia hook
    const isMobile = useMedia("(max-width: 640px)");

    // Track window size with optimized hook (prevents unnecessary rerenders)
    const { width } = useWindowSize();

    // Memoize packed columns based on device type and window width
    const columns = useMemo(() => {
      const currentCols = isMobile ? 2 : cols;
      return pack(projects, currentCols);
    }, [projects, cols, isMobile]);

    // Memoize the rendering function for better performance
    const renderColumns = useMemo(() => {
      const basisClass = isMobile ? "basis-1/2" : renderColStyle(cols);

      return columns.map((column, columnIndex) => (
        <div
          className={cx(`gap-w4 flex flex-col`, basisClass)}
          key={`column-${columnIndex}-${column[0]?.image || "empty"}`}
        >
          {column.map((project) => (
            <Link
              className="w-full !py-0 focus-visible:outline-none"
              href={`/graphics/${slugify(project.title)}`}
              key={project.image}
              scroll={false}
            >
              <MediaFigure
                className="!py-0 focus-visible:outline-none"
                figureIntent="inGrid"
              >
                <Image
                  alt={project.title}
                  src={project.image}
                  priority={columnIndex < 7}
                  height={project.height}
                  width={project.width}
                  sizes="(min-width: 768px) 350px, 100vw"
                  style={{
                    aspectRatio: `${project.width}/${project.height}`,
                  }}
                  className={cx(
                    mediaWrapperVariants({
                      border: !project.noBorder,
                    }),
                    "focus-visible:outline-none"
                  )}
                />
              </MediaFigure>
            </Link>
          ))}
        </div>
      ));
    }, [columns, cols, isMobile]);

    // Single layout rendering instead of two parallel layouts with CSS hiding
    return <div className="gap-w4 flex flex-row">{renderColumns}</div>;
  }
);

GraphicsGrid.displayName = "GraphicsGrid";

function pack(images: Project[], columns: number): Project[][] {
  const packed: Project[][] = Array.from({ length: columns }, () => []);
  const heights = Array.from({ length: columns }, () => 0);

  // Sort images by height in descending order
  const sortedImages = [...images].sort((a, b) => b.height - a.height);

  for (const image of sortedImages) {
    // Find the column with the smallest height
    const minHeight = Math.min(...heights);
    const columnIndex = heights.indexOf(minHeight);

    // Add the image to the column
    packed[columnIndex].push(image);
    heights[columnIndex] += image.height / image.width; // Use aspect ratio
  }

  return packed;
}

const renderColStyle = (col: number) => {
  if (col === 4) return "sm:basis-1/4";
  if (col === 3) return "sm:basis-1/3";
  if (col === 2) return "sm:basis-1/2";
  return "basis-1/2";
};
