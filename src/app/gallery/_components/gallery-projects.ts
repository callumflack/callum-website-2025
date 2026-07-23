import type { Post } from "content-collections";
import { allPosts } from "content-collections";
import { sortSelectedPosts } from "@/lib/posts/sorting";
import { Category } from "@/types/content";
import {
  manualGalleryProjects,
  type ManualGalleryProject,
} from "./manual-gallery-projects";

type GalleryAsset = NonNullable<Post["assets"]>[number];

export interface GalleryItem {
  asset: GalleryAsset;
  href?: string;
  id: string;
  noBorder: boolean;
  title: string;
  date: string;
}

export function getGalleryItems(): GalleryItem[] {
  const featuredProjects = sortSelectedPosts(
    allPosts.filter(
      (post) => !post.draft && post.category === Category.PROJECTS
    ),
    "projects"
  ).filter(hasAsset);

  const featuredTitles = new Set(
    featuredProjects.map((project) => project.title)
  );
  const manualProjects = manualGalleryProjects.filter(
    (project) => !featuredTitles.has(project.title)
  );

  return [
    ...featuredProjects.map(toPostGalleryItem),
    ...manualProjects.map(toManualGalleryItem),
  ];
}

function hasAsset(
  post: Post
): post is Post & { assets: [GalleryAsset, ...GalleryAsset[]] } {
  return Boolean(post.assets?.length);
}

function toPostGalleryItem(
  post: Post & { assets: [GalleryAsset, ...GalleryAsset[]] }
): GalleryItem {
  return {
    asset: post.assets[0],
    href: `/${post.slug}`,
    id: post._id,
    noBorder: false,
    title: post.title,
    date: post.date,
  };
}

function toManualGalleryItem(project: ManualGalleryProject): GalleryItem {
  return {
    asset: project.assets[0],
    href: project.slug ? `/${project.slug}` : undefined,
    id: `${project.title}-${project.date}`,
    noBorder: project.noBorder ?? false,
    title: project.title,
    date: project.date,
  };
}
