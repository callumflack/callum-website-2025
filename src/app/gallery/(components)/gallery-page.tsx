"use client";

import { Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { PageInner, PageWrapper } from "@/components/page";
import { BodyClassProvider } from "@/components/utils/body-class-provider";
import { Post } from "content-collections";
import { cx } from "cva";
import { GalleryPosts } from "./gallery-posts";
import { useState } from "react";

export const GalleryPage = ({
  projects,
  currentSort,
  kind,
}: {
  projects: Post[];
  currentSort: string;
  kind: string;
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <BodyClassProvider
      condition={false}
      className={cx(
        // Style the list-header so that it has a background color
        // "bg-background-hover [&_[data-component=Nav]]:bg-background-hover",
        "[&_[data-component=ListHeader]>nav]:before:bg-background-hover"
      )}
    >
      <PageWrapper activeNav="/graphics">
        <PageInner variant="index">
          <TitleHeader>
            <Text as="h1" intent="title">
              A gallery of graphics and interactions.
            </Text>
          </TitleHeader>
          <GalleryPosts
            initialSort={currentSort}
            kind={kind}
            posts={projects}
            isActive={isActive}
            setIsActive={setIsActive}
          />
        </PageInner>
      </PageWrapper>
    </BodyClassProvider>
  );
};
