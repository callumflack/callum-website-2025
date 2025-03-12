"use client";

import { Link } from "@/components/atoms";
import { mediaWrapperVariants, Video } from "@/components/media";
import { slugify } from "@/lib/utils";
import { cx } from "cva";
import { memo, useMemo } from "react";
import { useMedia } from "react-use";
import type { Project } from "./projects";
// import { CardImage } from "@/components/card";
import Image from "next/image";

/* This requires using the data shape from ./projects! */

export const GraphicsGrid = memo(
  ({ projects, cols }: { projects: Project[]; cols: number }) => {
    // Replace manual media query with useMedia hook
    const isMobile = useMedia("(max-width: 640px)");

    // Track window size with optimized hook (prevents unnecessary rerenders)
    // from "react-use"
    // const { width } = useWindowSize();

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
          className={cx(`gap-w4 z-2 flex flex-col`, basisClass)}
          key={`column-${columnIndex}-${column[0]?.image || "empty"}`}
        >
          {column.map((project) => {
            return (
              <Link
                key={project.image}
                href={`/graphics/${slugify(project.title)}`}
                scroll={false}
                className="w-full !py-0 focus-visible:outline-none"
              >
                {project.video ? (
                  <Video
                    key={project.video}
                    aspect={project.aspect || 16 / 9}
                    className=""
                    poster={project.image}
                    src={project.video}
                  />
                ) : (
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
                )}
                {/* <CardImage
                  asset={{
                    src: project.image,
                    alt: project.title,
                    aspect: project.width / project.height,
                  }}
                  sizes="(min-width: 768px) 350px, 100vw"
                  className={cx(
                    mediaWrapperVariants({
                      border: !project.noBorder,
                    }),
                    "focus-visible:outline-none"
                  )}
                /> */}
              </Link>
            );
          })}
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
