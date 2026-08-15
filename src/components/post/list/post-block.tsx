import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Text } from "@/components/atoms";
import { CardImage } from "@/components/card";
import { mediaWrapperVariants } from "@/components/media";
import { cn, formatPostYearSpan } from "@/lib/utils";
import type { PostListItem } from "@/types/content";
import { lineHoverStyle, postIconStyle } from "../post.styles";
import { PostLinkHeadingWrapper } from "../post-link-heading-wrapper";

interface PostBlockProps {
  post: PostListItem;
  isExternal?: boolean;
  priority?: boolean;
}

export const PostBlock = ({
  post,
  isExternal,
  priority = false,
}: PostBlockProps) => {
  return (
    <div
      data-component="PostBlock"
      className={cn(
        "group gap-w4 grid grid-cols-20",
        lineHoverStyle,
        "hover:before:-inset-y-3",
        "hover:before:rounded-[12px]"
      )}
    >
      {/* IMAGE */}
      <div className={cn("relative col-span-6 sm:col-span-5")}>
        <div className="relative">
          {post.assets && post.assets.length > 0 ? (
            <CardImage
              asset={{
                ...post.assets[0],
                // Only show videos for home theme, otherwise use static images
                // src:
                //   isVideoFile(post.assets[0]?.src) && theme !== "home"
                //     ? post.assets[0]?.poster || post.assets[0]?.src || ""
                //     : post.assets[0]?.src || "",
                src: post.assets[0]?.src || "",
              }}
              priority={priority}
              sizes="(min-width: 660px) 150px, 400px"
              className={cn(mediaWrapperVariants(), "group-hover:border-fill")}
            />
          ) : null}

          {/* NEW */}
          {post.showAsNew ? (
            <div
              className={cn(
                "sm:rounded-button absolute inset-0 flex overflow-hidden",
                "border-fill group-hover:border-accent border",
                // "transition-colors duration-100 ease-linear",
                "items-start justify-end"
              )}
            >
              <Text
                as="div"
                color="canvas"
                intent="fine"
                className={cn(
                  "bg-fill group-hover:bg-accent",
                  "flex h-[20px] items-center px-3",
                  // "transition-colors duration-100 ease-linear",
                  "sm:rounded-bl-button"
                )}
              >
                <span className="translate-y-[-0.1em] transform">New</span>
              </Text>
            </div>
          ) : null}
        </div>
      </div>

      {/* CAPTION */}
      <div
        className={cn(
          "col-span-14 sm:col-span-15",
          "translate-y-[-0.25em] transform space-y-1"
        )}
      >
        <PostLinkHeadingWrapper className="items-baseline gap-2.5">
          <Text as="h2" intent="body" weight="medium">
            {post.title}
          </Text>
          <hr className="hr-vertical border-border-hover h-[12px]" />
          <Text as="span" dim intent="meta">
            {formatPostYearSpan(post)}
          </Text>
          {post.thumbnailLink && !isExternal ? (
            <ArrowTopRightIcon className={cn(postIconStyle)} />
          ) : null}
        </PostLinkHeadingWrapper>
        <Text dim intent="meta" className="group-hover:text-fill-light!">
          {post.summary}
          {/* <span className={cn("Text-subheading text-solid")}>
              {date ? format(parseISO(date), "yyyy") : "HEY"}
            </span> */}
        </Text>
        {/* {theme === "home" && <CardTitleMeta post={post} />} */}
      </div>
    </div>
  );
}
