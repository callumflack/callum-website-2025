import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Text } from "@/components/atoms";
import { mediaWrapperVariants, isVideoFile } from "@/components/media";
import { cx } from "cva";
import { type Post } from "content-collections";
import { CardImage } from "@/components/card";
import { PostLinkHeadingWrapper } from "../post-link-heading-wrapper";
import { postIconStyle } from "../post.styles";
import { lineHoverStyle } from "./post-line";

interface PostBlockProps {
  post: Post;
  isExternal?: boolean;
  theme?: "home" | "index";
  priority?: boolean;
}

export const PostBlock = ({
  post,
  isExternal,
  theme = "index",
  priority = false,
}: PostBlockProps) => {
  return (
    <div
      data-component="PostBlock"
      className={cx(
        "group flex flex-col",
        lineHoverStyle,
        "hover:before:inset-y-[-12px]",
        theme === "index" ? "gap-w4 sm:flex-row" : "gap-3"
      )}
    >
      {/* IMAGE */}
      <div
        className={cx(
          "relative w-full",
          theme === "index" ? "sm:w-1/4 sm:shrink-0" : ""
        )}
      >
        <div className="relative">
          {post.assets && post.assets.length > 0 ? (
            <CardImage
              asset={{
                ...post.assets[0],
                // Only show videos for home theme, otherwise use static images
                src:
                  isVideoFile(post.assets[0]?.src) && theme !== "home"
                    ? post.assets[0]?.poster || post.assets[0]?.src || ""
                    : post.assets[0]?.src || "",
              }}
              priority={priority}
              sizes="(min-width: 660px) 205px, 100vw"
              className={cx(
                mediaWrapperVariants(),
                "group-hover:border-fill",
                theme === "home" && "!aspect-[2/1]"
              )}
            />
          ) : null}

          {/* NEW */}
          {post.showAsNew ? (
            <div
              className={cx(
                "sm:rounded-button absolute inset-0 flex overflow-hidden",
                "border-fill group-hover:border-accent border",
                // "transition-colors duration-100 ease-linear",
                theme === "index"
                  ? "items-start justify-end"
                  : "items-end justify-start"
              )}
            >
              <Text
                as="div"
                color="canvas"
                intent="fine"
                className={cx(
                  "bg-fill group-hover:bg-accent",
                  "flex h-[20px] items-center px-3",
                  // "transition-colors duration-100 ease-linear",
                  theme === "index"
                    ? "sm:rounded-bl-button"
                    : "sm:rounded-tr-button"
                )}
              >
                <span className="translate-y-[-0.1em] transform">New</span>
              </Text>
            </div>
          ) : null}
        </div>
      </div>

      {/* CAPTION */}
      <div className="translate-y-[-0.25em] transform space-y-1">
        <PostLinkHeadingWrapper>
          <Text as="h2" intent="body" weight="medium">
            {post.title}
          </Text>
          {post.thumbnailLink && !isExternal ? (
            <ArrowTopRightIcon className={cx(postIconStyle)} />
          ) : null}
        </PostLinkHeadingWrapper>
        <Text dim intent="meta" className="group-hover:!text-fill-light">
          {post.summary}
          {/* <span className={cx("Text-subheading text-solid")}>
              {date ? format(parseISO(date), "yyyy") : "HEY"}
            </span> */}
        </Text>
        {/* {theme === "home" && <CardTitleMeta post={post} />} */}
      </div>
    </div>
  );
};
