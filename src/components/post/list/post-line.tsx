"use client";

import { cx } from "cva";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { format, parseISO } from "date-fns";
import { Text } from "@/components/atoms";
import { type Post } from "content-collections";
import { PostCategoryIcon } from "../post-category-icon";
import { postIconStyle } from "../post.styles";
import { PostLinkHeadingWrapper } from "../post-link-heading-wrapper";
import { StarFilledIcon } from "@radix-ui/react-icons";

interface PostLineProps {
  post: Post;
  isLibrary?: boolean;
  isComingSoon?: boolean;
  isFeatured?: boolean;
}

export const PostLine = ({
  post,
  isLibrary,
  isComingSoon,
  isFeatured,
}: PostLineProps) => {
  const hoverLabel = () => {
    if (isLibrary) return "View";
    if (isComingSoon) return "Coming soon";
    if (post.thumbnailLink) return "Open";
    if (post.category === "projects") return "View";
    return "Read";
  };

  return (
    <div
      data-component="PostLine"
      className={cx(
        // h-[40px]
        "group flex items-end justify-between gap-2 py-2.5 leading-none",
        "hover:relative hover:z-0",
        "hover:before:-inset-x-inset hover:before:bg-background-hover hover:before:absolute hover:before:inset-y-[-3px] hover:before:-z-[1] hover:before:content-['']",
        "hover:before:rounded-squish"
      )}
    >
      <PostLinkHeadingWrapper className="group-hover:!text-fill">
        {isFeatured ? (
          <div className="absolute top-1/2 left-[-0.6em] -translate-y-1/2 sm:left-[-0.9em]">
            <StarFilledIcon className="text-accent2 group-hover:text-fill size-[0.666em]" />
          </div>
        ) : null}

        {/* purposefully not using Text here so we can hoist type styles */}
        <h2 className="leading-[1.25]">{post.linkTitle || post.title}</h2>
        {post.thumbnailLink && !isComingSoon ? (
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
        intent="meta"
        dim
        className={cx(
          "group-hover:!text-fill relative",
          "flex items-center gap-3.5",
          "ease transition-colors duration-300",
          // shift everything down a bit
          // "translate-y-[0.35em] transform",
          // cover the last dot
          "pl-2"
        )}
      >
        {/* END HOVER LABEL */}
        <div
          className={cx(
            "absolute opacity-0 group-hover:opacity-100",
            isComingSoon ? "-left-[11.2em]" : "-left-[4.2em]"
          )}
        >
          <span className="bg-background-hover z-10 px-1">{hoverLabel()}</span>
        </div>

        {/* END META */}
        <PostCategoryIcon category={post.category} />
        <hr
          className={cx(
            "hr-vertical h-[12px] translate-y-[-0.1em]",
            "group-hover:border-fill"
            // "ease transition-colors duration-300"
          )}
        />
        <div className="md:min-w-[33px]">
          {post.date ? format(parseISO(post.date), "yyyy") : "HEY"}
        </div>
      </Text>
    </div>
  );
};
