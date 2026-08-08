import type { Post } from "content-collections";
import { focusVisibleOutlineStyle, Link, Text } from "@/components/atoms";
import { CardImage } from "@/components/card";
import { mediaWrapperVariants } from "@/components/media";
import { PostBlock } from "@/components/post/list/post-block";
import { PostLine } from "@/components/post/list/post-line";
import { lineHoverStyle } from "@/components/post/post.styles";
import { getPublishedPosts, toPostListItem } from "@/lib/posts/actions";
import { cn, formatPostYearSpan } from "@/lib/utils";
import type { PostListItem } from "@/types/content";
import { mdxMediaSpacing } from "./mdx-media";

export type StorySlide = {
  assetIndex?: number;
  showSummary?: boolean;
  slug: string;
};

export interface StoryPostProps extends StorySlide {
  variant?: "card";
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
  const asset = resolveStoryAsset(post, assetIndex);

  return (
    <div
      className={mdxMediaSpacing}
      data-component="StoryPost"
      data-variant={variant}
    >
      <StoryPostCard asset={asset} post={post} showSummary={showSummary} />
    </div>
  );
}

export function StoryPostList({
  showThumbnails = false,
  slugs,
}: StoryPostListProps) {
  const posts = resolveStoryPosts(slugs);

  return (
    <div
      className={cn(showThumbnails && "py-minor gap-w6 flex flex-col")}
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

function StoryPostCard({
  asset,
  post,
  showSummary = false,
}: {
  asset?: StoryAsset;
  post: Post;
  showSummary?: boolean;
}) {
  return (
    <Link
      className={cn(
        "group rounded-button block",
        lineHoverStyle,
        "hover:before:-inset-y-3",
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
          sizes="(min-width: 660px) 620px, 100vw"
        />
      ) : null}

      <div className={cn("space-y-1", asset && "pt-2.5")}>
        <div className="flex items-baseline gap-2.5">
          <Text
            as="h2"
            intent={showSummary ? "body" : "meta"}
            weight={showSummary ? "medium" : "normal"}
          >
            {post.title}
          </Text>
          <hr className="hr-vertical border-border-hover h-[0.7em] translate-y-px" />
          <Text
            as="span"
            intent={showSummary ? "body" : "meta"}
            weight={showSummary ? "medium" : "normal"}
          >
            {formatPostYearSpan(post)}
          </Text>
        </div>
        {showSummary ? (
          <Text
            className="group-hover:text-fill-light! group-focus-visible:text-fill-light!"
            dim
            intent="meta"
          >
            {post.summary}
          </Text>
        ) : null}
      </div>
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
