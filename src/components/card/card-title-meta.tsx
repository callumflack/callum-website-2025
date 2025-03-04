import {
  ArrowTopRightIcon,
  EyeOpenIcon,
  QuoteIcon,
} from "@radix-ui/react-icons";
import { cx } from "cva";
import { Text } from "@/components/atoms";
import { getYear } from "@/lib/utils";
import { type Post } from "content-collections";
import { iconStyle, transformStyle } from "./card-styles";

interface CardTitleMetaProps {
  post: Post;
  className?: string;
  thumbnailLink?: string | undefined;
}

export const CardTitleMeta = ({
  post,
  className,
  thumbnailLink,
}: CardTitleMetaProps) => {
  const endYear = post.endDate ? getYear(post.endDate) : null;

  return (
    <Text
      className={cx("flex shrink-0 items-center gap-2", className)}
      dim
      intent="meta"
    >
      <CardIcon category={post.category as "writing" | "projects"} />
      <span>
        <span>{getYear(post.date)}</span>
        {endYear ? (
          <>
            &ndash;<span>{endYear}</span>
          </>
        ) : null}
      </span>
      {thumbnailLink ? (
        <ArrowTopRightIcon className={cx(iconStyle, transformStyle)} />
      ) : null}
    </Text>
  );
};

export const CardIcon = ({
  category,
  className,
}: {
  category: "writing" | "projects";
  className?: string;
}) => {
  if (category === "writing") {
    return <QuoteIcon className={cx(iconStyle, transformStyle, className)} />;
  }
  return <EyeOpenIcon className={cx(iconStyle, transformStyle, className)} />;
};
