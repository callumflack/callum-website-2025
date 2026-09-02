import type { Post } from "content-collections";
import { ZoomCarousel as ZoomCarouselClient } from "@/app/(home)/zoom-carousel";
import { getPublishedPosts } from "@/lib/posts/actions";

interface ZoomCarouselProps {
  slugs: readonly string[];
  className?: string;
}

const publishedPostsBySlug = new Map(
  getPublishedPosts().map((post) => [post.slug, post])
);

export function ZoomCarousel({ slugs, className }: ZoomCarouselProps) {
  const projects = slugs.map(resolveProject);

  if (projects.length === 0) {
    throw new Error("ZoomCarousel requires at least one slug");
  }

  return <ZoomCarouselClient className={className} projects={projects} />;
}

function resolveProject(slug: string): Post {
  const post = publishedPostsBySlug.get(slug);

  if (!post) {
    throw new Error(`ZoomCarousel references missing or draft post: ${slug}`);
  }

  if (!post.assets?.length) {
    throw new Error(`ZoomCarousel post "${slug}" has no assets`);
  }

  return post;
}
