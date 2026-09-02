import type { Post } from "content-collections";
import { focusVisibleOutlineStyle, Link } from "@/components/atoms";
import { CardImage } from "@/components/card";
import { mediaWrapperVariants } from "@/components/media";
import { PostBlock } from "@/components/post/list/post-block";
import { PostLine } from "@/components/post/list/post-line";
import { lineHoverStyle } from "@/components/post/post.styles";
import { getPublishedPosts, toPostListItem } from "@/lib/posts/actions";
import { cn, formatPostYearSpan } from "@/lib/utils";
import type { PostListItem } from "@/types/content";
import { mdxMediaSpacing } from "./mdx-media";
import { StoryPostMeta } from "./story-post-meta";

/** Flip to true to restore StoryPost card hover overlay (lineHoverStyle). */
const SHOW_STORY_POST_HOVER = false;

export type StorySlide = {
  assetIndex?: number;
  showSummary?: boolean;
  slug: string;
};

export interface StoryPostProps extends StorySlide {
  variant?: "block" | "card";
}

export interface StoryPostListProps {
  showThumbnails?: boolean;
  slugs: readonly string[];
}

type StoryAsset = NonNullable<Post["assets"]>[number];

const publishedPostsBySlug = new Map(
  getPublishedPosts().map((post) => [post.slug, post])
);

export function getStorySlideKey(slide: StorySlide, index: number): string {
  return `${slide.slug}-${slide.assetIndex ?? 0}-${index}`;
}

export function StoryPost({
  slug,
  assetIndex = 0,
  showSummary = false,
  variant = "card",
}: StoryPostProps) {
  const post = resolveStoryPost(slug);
  const body = renderStoryPostBody({
    assetIndex,
    post,
    showSummary,
    variant,
  });

  return (
    <div
      className={mdxMediaSpacing}
      data-component="StoryPost"
      data-variant={variant}
    >
      {body}
    </div>
  );
}

function renderStoryPostBody({
  assetIndex,
  post,
  showSummary,
  variant,
}: {
  assetIndex: number;
  post: Post;
  showSummary: boolean;
  variant: NonNullable<StoryPostProps["variant"]>;
}) {
  switch (variant) {
    case "block":
      return <StoryPostBlock post={post} />;
    case "card":
      return (
        <StoryPostCard
          asset={resolveStoryAsset(post, assetIndex)}
          post={post}
          showSummary={showSummary}
        />
      );
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

export function StoryPostList({
  showThumbnails = false,
  slugs,
}: StoryPostListProps) {
  const posts = resolveStoryPosts(slugs);

  return (
    <div
      className={cn(
        showThumbnails
          ? "py-small gap-w6 flex flex-col"
          : "pt-[calc(var(--spacing-small)---spacing(2.5))]"
      )}
      data-component="StoryPostList"
      data-thumbnails={showThumbnails ? "true" : "false"}
    >
      {posts.map((post) =>
        showThumbnails ? (
          <StoryPostBlock key={post._id} post={post} />
        ) : (
          <StoryPostLine key={post._id} post={post} />
        )
      )}
    </div>
  );
}

export function StoryPostCard({
  asset,
  post,
  sizes,
  showSummary = false,
}: {
  asset?: StoryAsset;
  post: Post;
  sizes?: string;
  showSummary?: boolean;
}) {
  return (
    <Link
      className={cn(
        "group rounded-button block",
        SHOW_STORY_POST_HOVER && [lineHoverStyle, "hover:before:-inset-y-3"],
        "text-fill! hover:text-fill! focus-visible:text-fill! no-underline!",
        focusVisibleOutlineStyle
      )}
      data-has-media={asset ? "true" : "false"}
      href={`/${post.slug}`}
    >
      {asset ? (
        <CardImage
          asset={asset}
          className={cn(
            mediaWrapperVariants(),
            "group-hover:border-fill group-focus-visible:border-fill w-full"
          )}
          sizes={sizes ?? "(min-width: 660px) 620px, 100vw"}
        />
      ) : null}

      <StoryPostMeta
        className={cn(asset && "pt-2.5")}
        showSummary={showSummary}
        summary={post.summary}
        summaryClassName={cn(
          SHOW_STORY_POST_HOVER && "group-hover:text-fill-light!",
          "group-focus-visible:text-fill-light!"
        )}
        title={post.title}
        yearSpan={formatPostYearSpan(post)}
      />
    </Link>
  );
}

function StoryPostBlock({ post }: { post: Post }) {
  const listItem = toCanonicalListItem(post);

  return (
    <Link
      className="text-fill! hover:text-fill! focus-visible:text-fill! block no-underline!"
      href={`/${post.slug}`}
    >
      <PostBlock post={listItem} priority={false} />
    </Link>
  );
}

function StoryPostLine({ post }: { post: Post }) {
  const listItem = toCanonicalListItem(post);

  return (
    <Link
      className="text-fill! hover:text-fill! focus-visible:text-fill! block no-underline!"
      href={`/${post.slug}`}
    >
      <PostLine post={listItem} />
    </Link>
  );
}

function toCanonicalListItem(post: Post): PostListItem {
  return {
    ...toPostListItem(post),
    thumbnailLink: undefined,
  };
}

function resolveStoryPost(slug: string): Post {
  const post = publishedPostsBySlug.get(slug);

  if (!post) {
    throw new Error(`Homepage story references missing or draft post: ${slug}`);
  }

  return post;
}

function resolveStoryPosts(slugs: readonly string[]): Post[] {
  return slugs.map(resolveStoryPost);
}

function resolveStoryAsset(
  post: Post,
  assetIndex: number
): StoryAsset | undefined {
  const assets = post.assets;

  if (!assets?.length) {
    return undefined;
  }

  const asset = assets[assetIndex];

  if (!asset) {
    throw new Error(
      `Homepage story post "${post.slug}" has no asset at index ${assetIndex}`
    );
  }

  return asset;
}
