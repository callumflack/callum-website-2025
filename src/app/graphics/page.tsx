import { Link, Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { PageWrapper } from "@/components/page";
import type { Metadata } from "next";
import { getProjects } from "./(components)/actions";
import { graphicsDescription } from "./(components)/copy";
import { GraphicsGrid } from "./(components)/graphics-grid";
// import type { PostsKind } from "@/components/post";
// import type { SearchParams } from "@/types/search-params";

export const metadata: Metadata = {
  title: "Graphics and interactions",
  description: graphicsDescription,
};

/*
  TODO: add searchParam filters?
 */

export default async function GraphicsIndexPage() {
  const projects = await getProjects();

  // add filters?
  // searchParams: SearchParams;
  // const kind: PostsKind = "projects";
  // const currentSort = (searchParams.sort as string) || kind;

  return (
    <PageWrapper activeNav="/graphics">
      <TitleHeader>
        <Text as="h1" intent="title">
          Graphics and interactions.
        </Text>
        <Text dim intent="meta">
          {graphicsDescription}{" "}
          <Link className="link" href="/work">
            View case studies
          </Link>
          .
        </Text>
      </TitleHeader>
      <main className="pt-w6 pb-w12 container max-w-[1320px]">
        <GraphicsGrid cols={3} projects={projects} />
      </main>
    </PageWrapper>
  );
}
