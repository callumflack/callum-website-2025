import { Text } from "@/components/atoms";
import { CardImage } from "@/components/card";
import { mediaWrapperVariants } from "@/components/media";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { type Post } from "content-collections";
import { cx } from "cva";
import { PostLinkHeadingWrapper } from "../post-link-heading-wrapper";
import { lineHoverStyle, postIconStyle } from "../post.styles";

interface PostBlockProps {
  post: Post;
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
      className={cx(
        "group gap-w4 grid grid-cols-20",
        lineHoverStyle,
        "hover:before:inset-y-[-12px]"
      )}
    >
      {/* IMAGE */}
      <div className={cx("relative col-span-6 sm:col-span-5")}>
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
              className={cx(mediaWrapperVariants(), "group-hover:border-fill")}
            />
          ) : null}

          {/* NEW */}
          {post.showAsNew ? (
            <div
              className={cx(
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
                className={cx(
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
        className={cx(
          "col-span-14 sm:col-span-15",
          "translate-y-[-0.25em] transform space-y-1"
        )}
      >
        <PostLinkHeadingWrapper>
          <Text as="h2" intent="body" weight="medium">
            {post.title}
          </Text>
          {post.thumbnailLink && !isExternal ? (
            <ArrowTopRightIcon className={cx(postIconStyle)} />
          ) : null}
        </PostLinkHeadingWrapper>
        <Text dim intent="meta" className="group-hover:text-fill-light!">
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
