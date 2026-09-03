import { ZoomCarouselClient } from "@/app/(home)/zoom-carousel-client";
import { getCarouselProjects } from "@/lib/posts/carousel-projects";

export function ZoomCarousel({
  slugs,
  className,
  wrapperClassName,
}: {
  slugs: readonly string[];
  className?: string;
  wrapperClassName?: string;
}) {
  const projects = getCarouselProjects(slugs);

  if (projects.length === 0) {
    throw new Error("ZoomCarousel requires at least one slug");
  }

  return (
    <ZoomCarouselClient
      className={className}
      wrapperClassName={wrapperClassName}
      projects={projects}
    />
  );
}
