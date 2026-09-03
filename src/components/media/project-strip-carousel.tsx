import type { CSSProperties } from "react";
import {
  CAROUSEL_CARD_WIDTH,
  type ProjectStripSnap,
  projectStripCenterTrackClassName,
  projectStripTrackClassName,
} from "@/components/media/project-strip";
import { ProjectStripCard } from "@/components/media/project-strip-item";
import { MediaErrorBoundary } from "@/components/utils";
import { getCarouselProjects } from "@/lib/posts/carousel-projects";
import { cn } from "@/lib/utils";

export function ProjectStripCarousel({
  slugs,
  snap = "center",
  wrapperClassName,
}: {
  slugs: readonly string[];
  snap?: ProjectStripSnap;
  wrapperClassName?: string;
}) {
  const projects = getCarouselProjects(slugs);

  if (projects.length === 0) {
    throw new Error("ProjectStripCarousel requires at least one slug");
  }

  return (
    <MediaErrorBoundary>
      <div
        className={cn("w-full overflow-x-clip", wrapperClassName)}
        data-component="ProjectStripCarousel"
        style={
          snap === "center"
            ? ({
                "--carousel-card-width": `${CAROUSEL_CARD_WIDTH}px`,
              } as CSSProperties)
            : undefined
        }
      >
        <div
          className={cn(
            snap === "center"
              ? projectStripCenterTrackClassName
              : projectStripTrackClassName,
            "sm:scroll-mask-x sm:scroll-mask-x-from-93%"
          )}
        >
          {projects.map((project, index) => (
            <ProjectStripCard
              key={project.slug}
              index={index}
              project={project}
              snap={
                snap === "center"
                  ? index === 0
                    ? "none"
                    : index === projects.length - 1
                      ? "end"
                      : "center"
                  : "start"
              }
            />
          ))}
        </div>
      </div>
    </MediaErrorBoundary>
  );
}
