import {
  ZoomCarouselClient,
  type ZoomCarouselProject,
} from "@/app/(home)/zoom-carousel-client";
import { getPublishedPosts } from "@/lib/posts/actions";
import { formatPostYearSpan } from "@/lib/utils";

interface MdxZoomCarouselProps {
  slugs: readonly string[];
  className?: string;
  wrapperClassName?: string;
}

const publishedPostsBySlug = new Map(
  getPublishedPosts().map((post) => [post.slug, post])
);

export function MdxZoomCarousel({
  slugs,
  className,
  wrapperClassName,
}: MdxZoomCarouselProps) {
  const projects = slugs.map(resolveProject);

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

function resolveProject(slug: string): ZoomCarouselProject {
  const post = publishedPostsBySlug.get(slug);

  if (!post) {
    throw new Error(`ZoomCarousel references missing or draft post: ${slug}`);
  }

  if (!post.assets?.length) {
    throw new Error(`ZoomCarousel post "${slug}" has no assets`);
  }

  return {
    asset: post.assets[0],
    slug: post.slug,
    title: post.title,
    yearSpan: formatPostYearSpan(post),
  };
}
