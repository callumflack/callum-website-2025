import { buttonVariants, Link, Text } from "@/components/atoms";
import { PageInner, PageWrapper } from "@/components/page";
import { SearchParams } from "@/types/search-params";
import { Cross1Icon } from "@radix-ui/react-icons";
import { cx } from "cva";
import { GraphicsGridSimple } from "./(components)/graphics-grid-simple";
import { GalleryListHeader } from "./(components)/gallery-list-header";
import projects from "./(components)/projects-test";
import { Metadata } from "next";
import { TitleHeader } from "@/components/elements";

/* TODO: add searchParam filters? */
export default async function GraphicsIndexPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { show } = await searchParams;
  const currentShow = (show as string) || "";
  const showInFull = currentShow === "full";

  if (showInFull)
    return (
      <div className="bg-background-hover py-w24 relative grid min-h-dvh items-center">
        <Link
          href="/gallery?show=index"
          className={cx(
            "top-inset right-inset absolute",
            buttonVariants({ variant: "icon" })
          )}
        >
          <Cross1Icon />
        </Link>
        <GraphicsGridSimple projects={projects} showInFull={true} />
      </div>
    );

  return (
    <PageWrapper activeNav="/graphics">
      <PageInner variant="index">
        <TitleHeader>
          <Text as="h1" intent="title">
            Graphics and interactions.
          </Text>
          {/* <Text dim intent="meta">
              {graphicsDescription}{" "}
              <Link className="link" href="/work">
                View case studies
              </Link>
              .
            </Text> */}
        </TitleHeader>
        <GalleryListHeader routePrefix="/gallery" />

        {/* <main className="pt-w6 pb-w12 container max-w-[1500px]"> */}
        {/* <GraphicsGrid cols={4} projects={projects} /> */}
        <main className="pt-w6">
          <GraphicsGridSimple projects={projects} showInFull={false} />
        </main>
      </PageInner>
    </PageWrapper>
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
