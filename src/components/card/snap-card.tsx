import { ArrowRightIcon } from "@radix-ui/react-icons";
import { mediaWrapperVariants } from "@/components/media";
import { cx } from "cva";
import { Text } from "@/components/atoms";
import { type Post } from "content-collections";
import { LinkOrDiv } from "../utils";
import { CardImage } from "./card-image";
import { CardTitleMeta } from "./card-title-meta";

interface SnapCardProps {
  post: Post;
  className?: string;
  captionClassName?: string;
  children?: React.ReactNode;
}

export const SnapCard = ({
  post,
  className,
  captionClassName,
  children,
}: SnapCardProps) => {
  const isViewAllWork = post.slug === "view-all-work";

  return (
    <LinkOrDiv
      className={cx(
        "group rounded-card relative h-full w-full overflow-hidden",
        "bg-canvas dark:bg-background-subtle",
        "block border",
        className
      )}
      href={(() => {
        if (isViewAllWork) return "/work";
        if (post.category === "writing") return `/${post.slug}`;
        return undefined;
      })()}
    >
      {post.assets && post.assets.length > 0 ? (
        <CardImage
          asset={post.assets[0]}
          className={cx(
            mediaWrapperVariants({
              border: false,
              rounded: false,
            })
          )}
          priority
          sizes="(min-width: 620px) 100vw, 380px"
        />
      ) : null}

      <hr />
      <div className={cx("pb-w6 space-y-[2px] px-4 py-2.5", captionClassName)}>
        <Text
          align="left"
          as="h2"
          className="flex items-center gap-1"
          weight="medium"
        >
          {post.title}
          {isViewAllWork ? <ArrowRightIcon className="size-em" /> : null}
        </Text>
        <CardTitleMeta post={post} />
      </div>

      {/* CUSTOMISATION SLOT */}
      {children}
    </LinkOrDiv>
  );
};
