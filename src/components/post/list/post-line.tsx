"use client";

import { cx } from "cva";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { format, parseISO } from "date-fns";
import { Text } from "@/components/atoms";
import { type Post } from "content-collections";
import { PostCategoryIcon } from "../post-category-icon";
import { postIconStyle } from "../post.styles";
import { PostLinkHeadingWrapper } from "../post-link-heading-wrapper";

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
    <div className="PostLine group flex h-[2.25rem] items-end justify-between gap-2 py-1.5 leading-[2.25rem]">
      {/* TITLE */}
      <PostLinkHeadingWrapper>
        {isFeatured ? (
          <div className="absolute top-[0.55em] left-[-0.7em] flex items-center justify-center sm:left-[-1em]">
            {/* animate-pulse2 h-[0.35em] w-[0.35em] */}
            <div className="bg-accent2 group-hover:bg-accent size-[0.25em] rounded-full opacity-50 group-hover:opacity-100" />
          </div>
        ) : null}

        {/* purposefully not using Text here so we can hoist type styles */}
        <h2 className="leading-[1.25]">{post.linkTitle || post.title}</h2>
        {post.thumbnailLink && !isComingSoon ? (
          <ArrowTopRightIcon className={cx(postIconStyle)} />
        ) : null}
      </PostLinkHeadingWrapper>

      {/* DOTDOTDOT */}
      <DotDotDot />

      {/* END */}
      <Text
        as="div"
        className={cx(
          "group-hover:!text-accent relative",
          "flex items-center gap-3.5",
          "ease transition-colors duration-300",
          // shift everything down a bit
          // "translate-y-[0.35em] transform",
          // cover the last dot
          "pl-2"
        )}
        dim
        inline
        intent="fineHeading"
      >
        {/* END HOVER LABEL */}
        <div
          className={cx(
            "absolute opacity-0 group-hover:opacity-100",
            isComingSoon ? "-left-[11.2em]" : "-left-[4.2em]"
          )}
        >
          <span className="bg-canvas z-10 px-1">{hoverLabel()}</span>
        </div>

        {/* END META */}
        <PostCategoryIcon category={post.category} />
        <hr
          className={cx(
            "hr-vertical h-[12px] translate-y-[-0.1em]",
            "group-hover:border-accent",
            "ease transition-colors duration-300"
          )}
        />
        <div className="md:min-w-[33px]">
          {post.date ? format(parseISO(post.date), "yyyy") : "HEY"}
        </div>
      </Text>
    </div>
  );
};

export const DotDotDot = () => (
  <div
    className={cx(
      "dotdotdot h-[1px] flex-1 translate-y-[-0.2em] opacity-40",
      "group-hover:text-accent group-hover:opacity-100",
      "ease transition-colors duration-300"
    )}
  />
);
