import { Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { PageInner, PageWrapper } from "@/components/page";
import { SearchParams } from "@/types/search-params";
import { Metadata } from "next";
import { GalleryPosts, getGalleryProjects } from "./(components)";
import { BodyClassProvider } from "@/components/utils/body-class-provider";
import { cx } from "cva";

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
    <BodyClassProvider
      condition={false}
      className={cx(
        "bg-background-hover [&_[data-component=Nav]]:bg-background-hover"
      )}
    >
      <PageWrapper activeNav="/graphics">
        <PageInner variant="index">
          <TitleHeader>
            <Text as="h1" intent="title">
              A gallery of graphics and interactions.
            </Text>
            {/* <Text dim intent="meta">
              {graphicsDescription}{" "}
              <Link className="link" href="/work">
              View case studies
              </Link>
              .
              </Text> */}
          </TitleHeader>

          <GalleryPosts
            initialSort={currentSort}
            kind={kind}
            posts={projects}
          />
        </PageInner>
      </PageWrapper>
    </BodyClassProvider>
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
