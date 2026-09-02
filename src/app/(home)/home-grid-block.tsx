import { Text } from "@/components/atoms";
import { CardImage } from "@/components/card";
import { mediaWrapperVariants } from "@/components/media";
import { Intro } from "@/components/page";
import { cn } from "@/lib/utils";
import type { Post } from "content-collections";

interface HomeGridBlockProps {
  post: Post;
  priority?: boolean;
}

export function HomeGridBlock({ post, priority = false }: HomeGridBlockProps) {
  const firstAsset = post.assets?.[0];
  const hasMedia = Boolean(firstAsset);

  return (
    <article
      data-component="HomeGridBlock"
      className={cn(
        "group",
        homeCardArticleStyle,
        "overflow-hidden",
        "grid h-full min-h-[260px] grid-rows-2"
      )}
    >
      <div
        className={cn(
          "border-border border",
          "bg-background-hover relative min-h-0"
        )}
      >
        {hasMedia && firstAsset ? (
          <CardImage
            asset={{
              ...firstAsset,
              src: firstAsset.src || "",
            }}
            priority={priority}
            sizes="(min-width: 1500px) 14vw, (min-width: 1024px) 20vw, 100vw"
            className={cn(
              mediaWrapperVariants({
                border: false,
                background: false,
                rounded: false,
              }),
              "h-full w-full object-cover"
            )}
          />
        ) : (
          <div className={cn("flex h-full items-end", textInnerStyle)}>
            <Text
              as="h3"
              intent="body"
              weight="medium"
              className="line-clamp-3"
            >
              {post.title}
            </Text>
          </div>
        )}
      </div>

      <div className={cn("flex min-h-0 flex-col gap-1", textInnerStyle)}>
        <Text as="h2" intent="body" weight="medium" className="line-clamp-2">
          {post.title}
        </Text>
        <Text
          dim
          intent="meta"
          className="group-hover:text-fill-light! line-clamp-4"
        >
          {post.summary}
        </Text>
      </div>
    </article>
  );
}

export function HomeIntroCard() {
  return (
    <article
      data-component="HomeIntroCard"
      className={cn(homeCardArticleStyle, textInnerStyle)}
    >
      <Intro showLabel={false} textIntent="body" />
    </article>
  );
}

const homeCardArticleStyle = [
  "bg-canvas",
  "bg-[#f1efe9]",
  "sm:rounded-button h-full border",
];

const textInnerStyle = ["px-2.5 sm:px-3", "py-2 sm:py-2.5"];
