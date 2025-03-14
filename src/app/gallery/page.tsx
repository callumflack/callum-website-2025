import { SearchParams } from "@/types/search-params";
import { Post } from "content-collections";
import { Metadata } from "next";
import { getGalleryProjects } from "./(components)";
import { GalleryPage } from "./(components)/gallery-page";

export default async function GraphicsIndexPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const kind = "all";
  const { sort } = await searchParams;
  const currentSort = (sort as string) || kind;
  const projects = await getGalleryProjects();

  return (
    <GalleryPage
      currentSort={currentSort}
      kind={kind}
      projects={projects as Post[]}
    />
  );
}

// visual composition and aesthetic impact
// Fast highlights from 20 years of visual composition, typographic play and aesthetic impact.
// Fast highlights from 20 years of creating visual impact.
// export const graphicsDescription = `Fast highlights from 20 years of delivering visual impact.`;

export const metadata: Metadata = {
  title: "Gallery",
  description: `Visual gallery of highlights from design and code projects produced since 1998.`,
};
