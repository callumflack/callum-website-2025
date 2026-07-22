import { ArrowTopRightIcon, StarFilledIcon } from "@radix-ui/react-icons";
import type { Post } from "content-collections";
import { format, parseISO } from "date-fns";
import { buttonVariants, Text } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { lineHoverStyle } from "../post.styles";
import { PostLinkHeadingWrapper } from "../post-link-heading-wrapper";

interface PostLineProps {
  post: Post;
  isFeed?: boolean;
  isFeatured?: boolean;
  categoryStyle?: "pill" | "plain";
  dateFormat?: "date" | "year";
}

export const PostLine = ({
  post,
  isFeed,
  isFeatured,
  categoryStyle = "pill",
  dateFormat = isFeed ? "date" : "year",
}: PostLineProps) => {
  // const hoverLabel = () => {
  //   if (isFeed) return "View";
  //   if (post.thumbnailLink) return "Open";
  //   if (post.category === "projects") return "View";
  //   return "Read";
  // };

  return (
    <div
      data-component="PostLine"
      className={cn(
        // h-[40px]
        "group flex items-end justify-between gap-2 leading-none",
        isFeed ? "pt-2.5 pb-2.5" : "pt-3.5 pb-3",
        lineHoverStyle
      )}
    >
      <PostLinkHeadingWrapper className="group-hover:text-fill!">
        {isFeatured && isFeed ? (
          <div className="absolute top-1/2 left-[-0.6em] -translate-y-1/2 sm:left-[-1.25em]">
            <StarFilledIcon className="text-accent group-hover:text-fill size-[0.6em]" />
          </div>
        ) : null}

        {/* purposefully not using Text here so we can hoist type styles */}
        <h2 className="leading-[1.25]">{post.linkTitle || post.title}</h2>
        {post.thumbnailLink ? <ArrowTopRightIcon className="size-em" /> : null}
      </PostLinkHeadingWrapper>

      {/* DOTDOTDOT (utils) */}
      <div
        className={cn(
          "dotdotdot h-px flex-1 translate-y-[-0.2em] opacity-40",
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
        className={cn(
          "group-hover:text-fill! relative",
          "flex items-center gap-3.5",
          // "ease transition-colors duration-300",
          // shift everything down a bit
          // "translate-y-[0.35em] transform",
          // cover the last dot
          "pb-[0.15em] pl-1.5"
        )}
      >
        {/* END HOVER LABEL */}
        {/* <div className="absolute -left-[4.2em] opacity-0 group-hover:opacity-100">
          <span className="bg-background-hover z-10 px-1">{hoverLabel()}</span>
        </div> */}

        {/* END META */}
        {/* <PostCategoryIcon category={post.category} />
        <hr
          className={cn(
            "hr-vertical h-[12px] translate-y-[-0.1em]",
            "group-hover:border-fill"
            // "ease transition-colors duration-300"
          )}
        /> */}

        {isFeed && (
          <span
            className={cn(
              categoryStyle === "pill" &&
                buttonVariants({
                  variant: "pill",
                }),
              categoryStyle === "pill" && "group-hover:border-fill"
            )}
          >
            {post.category === "projects" ? "Project" : post.category}
          </span>
        )}

        <div className={cn(dateFormat === "date" ? "md:min-w-[91px]" : "")}>
          {dateFormat === "date"
            ? format(parseISO(post.date), "MMM dd, yyyy")
            : (post.dateLabel ?? format(parseISO(post.date), "yyyy"))}
        </div>
      </Text>
    </div>
  );
};
