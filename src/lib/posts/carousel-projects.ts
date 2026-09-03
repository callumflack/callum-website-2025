import { formatPostYearSpan } from "@/lib/utils";
import type { Asset } from "@/types/content";
import { getPublishedPosts } from "./actions";

/*
  RSC lookup: slugs → published posts → { asset: assets[0], slug, title, yearSpan }. Draft/missing posts or empty assets throw.
*/

export type CarouselProject = {
  asset: Asset;
  slug: string;
  title: string;
  yearSpan: string;
};

export function getCarouselProjects(
  slugs: readonly string[]
): CarouselProject[] {
  const publishedPostsBySlug = new Map(
    getPublishedPosts().map((post) => [post.slug, post])
  );

  return slugs.map((slug) => {
    const post = publishedPostsBySlug.get(slug);

    if (!post) {
      throw new Error(`Carousel references missing or draft post: ${slug}`);
    }

    if (!post.assets?.length) {
      throw new Error(`Carousel post "${slug}" has no assets`);
    }

    return {
      asset: post.assets[0],
      slug: post.slug,
      title: post.title,
      yearSpan: formatPostYearSpan(post),
    };
  });
}
