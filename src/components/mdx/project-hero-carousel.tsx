import type { Post } from "content-collections";
import { isVideoFile } from "@/components/media/media-utils";
import { getPublishedPosts } from "@/lib/posts/actions";
import { formatPostYearSpan } from "@/lib/utils";
import {
  ProjectHeroCarouselClient,
  type ProjectHeroCarouselSlide,
} from "./project-hero-carousel-client";

type ProjectHeroSlideReference = {
  assetIndex?: number;
  slug: string;
};

interface ProjectHeroCarouselProps {
  label?: string;
  slides: readonly ProjectHeroSlideReference[];
}

type ProjectAsset = NonNullable<Post["assets"]>[number];

const publishedPostsBySlug = new Map(
  getPublishedPosts().map((post) => [post.slug, post])
);

export function ProjectHeroCarousel({
  label = "Selected project images",
  slides,
}: ProjectHeroCarouselProps) {
  const resolvedSlides = slides.map(resolveSlide);

  if (resolvedSlides.length === 0) {
    throw new Error("ProjectHeroCarousel requires at least one slide");
  }

  return <ProjectHeroCarouselClient label={label} slides={resolvedSlides} />;
}

function resolveSlide(
  { assetIndex = 0, slug }: ProjectHeroSlideReference,
  index: number
): ProjectHeroCarouselSlide {
  const post = publishedPostsBySlug.get(slug);

  if (!post) {
    throw new Error(
      `ProjectHeroCarousel references missing or draft post: ${slug}`
    );
  }

  const asset = resolveAsset(post, assetIndex);

  if (isVideoFile(asset.src) && !asset.poster) {
    throw new Error(
      `ProjectHeroCarousel video asset "${slug}" at index ${assetIndex} has no poster`
    );
  }

  return {
    asset,
    href: `/${post.slug}`,
    id: `${slug}-${assetIndex}-${index}`,
    title: post.title,
    yearSpan: formatPostYearSpan(post),
  };
}

function resolveAsset(post: Post, assetIndex: number): ProjectAsset {
  const asset = post.assets?.[assetIndex];

  if (!asset) {
    throw new Error(
      `ProjectHeroCarousel post "${post.slug}" has no asset at index ${assetIndex}`
    );
  }

  return asset;
}
