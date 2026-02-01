import { Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { PageInner, PageWrapper } from "@/components/page";
import { Post } from "content-collections";
import { GalleryPostsClient } from "./gallery-posts-client";

export const GalleryPage = ({
  projects,
  currentSort,
  kind,
}: {
  projects: Post[];
  currentSort: string;
  kind: string;
}) => {
  return (
    <PageWrapper activeNav="/graphics">
      <PageInner variant="index">
        <TitleHeader>
          <Text as="h1" intent="title">
            A gallery of graphics and interactions.
          </Text>
        </TitleHeader>
        <GalleryPostsClient
          currentSort={currentSort}
          kind={kind}
          posts={projects}
        />
      </PageInner>
    </PageWrapper>
  );
};
