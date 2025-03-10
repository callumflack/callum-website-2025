"use client";

import { buttonVariants, Text } from "@/components/atoms";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { type Post } from "content-collections";
import { cx } from "cva";
import { format, parseISO } from "date-fns";
// import { PostCategoryIcon } from "../post-category-icon";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { PostLinkHeadingWrapper } from "../post-link-heading-wrapper";
import { postIconStyle } from "../post.styles";

export const lineHoverStyle = [
  "hover:relative hover:z-0",
  "hover:before:-inset-x-inset hover:before:bg-background-hover hover:before:absolute hover:before:inset-y-0 hover:before:-z-[1] hover:before:content-['']",
  // "hover:before:rounded-squish"
];

interface PostLineProps {
  post: Post;
  isFeed?: boolean;
  isFeatured?: boolean;
}

export const PostLine = ({ post, isFeed, isFeatured }: PostLineProps) => {
  // const hoverLabel = () => {
  //   if (isFeed) return "View";
  //   if (post.thumbnailLink) return "Open";
  //   if (post.category === "projects") return "View";
  //   return "Read";
  // };

  return (
    <div
      data-component="PostLine"
      className={cx(
        // h-[40px]
        "group flex items-end justify-between gap-2 pt-3.5 pb-3 leading-none",
        lineHoverStyle
      )}
    >
      <PostLinkHeadingWrapper className="group-hover:!text-fill">
        {isFeatured && isFeed ? (
          <div className="absolute top-1/2 left-[-0.6em] -translate-y-1/2 sm:left-[-1.25em]">
            <StarFilledIcon className="text-accent group-hover:text-fill size-[0.6em]" />
          </div>
        ) : null}

        {/* purposefully not using Text here so we can hoist type styles */}
        <h2 className="leading-[1.25]">{post.linkTitle || post.title}</h2>
        {post.thumbnailLink ? (
          <ArrowTopRightIcon className={cx(postIconStyle)} />
        ) : null}
      </PostLinkHeadingWrapper>

      {/* DOTDOTDOT (utils) */}
      <div
        className={cx(
          "dotdotdot h-[1px] flex-1 translate-y-[-0.2em] opacity-40",
          "group-hover:text-fill group-hover:opacity-100"
          // "ease transition-colors duration-300"
        )}
      />

      {/* END */}
      <Text
        as="div"
        inline
        intent="pill"
        dim
        className={cx(
          "group-hover:!text-fill relative",
          "flex items-center gap-3.5",
          // "ease transition-colors duration-300",
          // shift everything down a bit
          // "translate-y-[0.35em] transform",
          // cover the last dot
          "pl-1.5"
        )}
      >
        {/* END HOVER LABEL */}
        {/* <div className="absolute -left-[4.2em] opacity-0 group-hover:opacity-100">
          <span className="bg-background-hover z-10 px-1">{hoverLabel()}</span>
        </div> */}

        {/* END META */}
        {/* <PostCategoryIcon category={post.category} />
        <hr
          className={cx(
            "hr-vertical h-[12px] translate-y-[-0.1em]",
            "group-hover:border-fill"
            // "ease transition-colors duration-300"
          )}
        /> */}

        {isFeed && (
          <div
            className={cx(
              buttonVariants({
                variant: "pill",
              }),
              "group-hover:border-fill"
            )}
          >
            <span>
              {post.category === "projects" ? "Project" : post.category}
            </span>
          </div>
        )}

        <div className={cx(isFeed ? "md:min-w-[91px]" : "")}>
          {isFeed
            ? format(parseISO(post.date), "MMM dd, yyyy")
            : format(parseISO(post.date), "yyyy")}
        </div>
      </Text>
    </div>
  );
};
