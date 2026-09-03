import { ProjectStripCarousel } from "@/components/media/project-strip-carousel";
import { featuredWorkSlugs } from "@/lib/posts/featured-posts";

export function WorkReel() {
  return (
    <ProjectStripCarousel
      slugs={featuredWorkSlugs}
      wrapperClassName="pt-w8"
      snap="center"
    />
  );
}
