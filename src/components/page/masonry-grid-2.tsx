import { memo } from "react";
import { cx } from "cva";
import NextLink from "next/link";
import { Post } from "content-collections";
import { CardImage } from "@/components/card";
import { parseAspectRatio } from "@/components/media/utils";
import { PostLinkHeadingWrapper } from "../post/post-link-heading-wrapper";
import { Text } from "@/components/atoms";

/*
  NB! Simplest possible masonry grid is this!
  …but it gets hard to style the gaps, etc.
  className="columns-[375px] 3xl:columns-[600px] gap-w6"
*/

// Shared types and utilities
type GridTheme = "default" | "gallery";
type PostItem = { post: Post; width: number; height: number };

// Shared item creation function
function createPostItems(posts: Post[]): PostItem[] {
  // Filter out posts without assets
  const postsWithAssets = posts.filter(
    (post) => post.assets && post.assets.length > 0
  );

  // Create post objects with dimensions
  return postsWithAssets.map((post) => {
    const firstAsset = post.assets?.[0];
    const width = 16;
    const height = firstAsset?.aspect
      ? width / parseAspectRatio(firstAsset.aspect)
      : 9;

    return { post, width, height };
  });
}

// Shared render item function
function renderPostItem(item: PostItem) {
  return (
    <NextLink
      key={item.post._id}
      href={item.post.thumbnailLink || item.post.slug}
      className="group flex flex-col gap-3 overflow-hidden"
    >
      <CardImage
        asset={item.post.assets?.[0] || { src: "", alt: "", aspect: "16-9" }}
        priority={false}
        className="w-full"
        sizes="(min-width: 1000px) 1080px, 100vw"
      />
      {/* CAPTION */}
      <div className="translate-y-[-0.2em] transform space-y-1">
        <PostLinkHeadingWrapper>
          <Text as="h2" weight="medium">
            {item.post.title}
          </Text>
        </PostLinkHeadingWrapper>
        <Text dim intent="meta">
          {item.post.summary}
          {/* <span className={cx("Text-subheading text-solid")}>
              {date ? format(parseISO(date), "yyyy") : "HEY"}
            </span> */}
        </Text>
        {/* {theme === "home" && <CardTitleMeta post={post} />} */}
      </div>
    </NextLink>
  );
}

// VERSION 1: Simple CSS Grid Layout
export const GridLayout = memo(
  ({ posts, theme = "default" }: { posts: Post[]; theme?: GridTheme }) => {
    const postItems = createPostItems(posts);

    // Use static classes for grid configuration based on theme
    const gridClasses = {
      default: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
      gallery: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5",
    };

    return (
      <div className={cx("gap-w8 grid w-full", gridClasses[theme])}>
        {postItems.map((item) => renderPostItem(item))}
      </div>
    );
  }
);

GridLayout.displayName = "GridLayout";

// VERSION 2: Masonry Layout with Column Packing
export const MasonryGrid = memo(
  ({ posts, theme = "default" }: { posts: Post[]; theme?: GridTheme }) => {
    const postItems = createPostItems(posts);

    // Column configuration
    const columnConfig = {
      default: { mobile: 1, sm: 2, lg: 3, "2xl": 4 },
      gallery: { mobile: 1, sm: 2, lg: 4, "2xl": 5 },
    };

    // Pack items into columns for each breakpoint
    const mobileColumns = pack(postItems, columnConfig[theme].mobile);
    const tabletColumns = pack(postItems, columnConfig[theme].sm);
    const desktopColumns = pack(postItems, columnConfig[theme].lg);
    const largeColumns = pack(postItems, columnConfig[theme]["2xl"]);

    // Grid classes by theme
    const gridClasses = {
      default: {
        sm: "grid-cols-2",
        lg: "grid-cols-3",
        "2xl": "grid-cols-4",
      },
      gallery: {
        sm: "grid-cols-2",
        lg: "grid-cols-4",
        "2xl": "grid-cols-5",
      },
    };

    return (
      <>
        {/* Mobile: 1 column */}
        <div className="gap-w8 grid w-full grid-cols-1 sm:hidden">
          {renderMasonryLayout(mobileColumns)}
        </div>

        {/* Small screens: 2 columns */}
        <div
          className={cx(
            "gap-w8 hidden w-full sm:grid lg:hidden",
            gridClasses[theme].sm
          )}
        >
          {renderMasonryLayout(tabletColumns)}
        </div>

        {/* Medium screens: 3-4 columns */}
        <div
          className={cx(
            "gap-w8 hidden w-full lg:grid 2xl:hidden",
            gridClasses[theme].lg
          )}
        >
          {renderMasonryLayout(desktopColumns)}
        </div>

        {/* Large screens: 4-5 columns */}
        <div
          className={cx(
            "gap-w8 hidden w-full 2xl:grid",
            gridClasses[theme]["2xl"]
          )}
        >
          {renderMasonryLayout(largeColumns)}
        </div>
      </>
    );
  }
);

MasonryGrid.displayName = "MasonryGrid";

// Pack items into columns (true masonry layout)
function pack(items: PostItem[], columns: number): Array<PostItem[]> {
  const packed = Array.from({ length: columns }, () => [] as PostItem[]);
  const heights = Array.from({ length: columns }, () => 0);

  // Sort items by height in descending order for better distribution
  const sortedItems = [...items].sort((a, b) => b.height - a.height);

  for (const item of sortedItems) {
    // Find the column with the smallest height
    const minHeight = Math.min(...heights);
    const columnIndex = heights.indexOf(minHeight);

    // Add the item to the column
    packed[columnIndex].push(item);
    heights[columnIndex] += item.height / item.width; // Use aspect ratio
  }

  return packed;
}

// Render the masonry layout with packed columns
function renderMasonryLayout(columns: PostItem[][]) {
  return columns.map((column, colIndex) => (
    <div key={`col-${colIndex}`} className="gap-w4 flex flex-col">
      {column.map((item) => renderPostItem(item))}
    </div>
  ));
}
