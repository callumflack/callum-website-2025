import {
  ArrowTopRightIcon,
  EyeOpenIcon,
  QuoteIcon,
} from "@radix-ui/react-icons";
import { Text } from "@/components/atoms";
import { cn, formatYear } from "@/lib/utils";
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
  const endYear = post.endDate ? formatYear(post.endDate) : null;

  return (
    <Text
      className={cn("flex shrink-0 items-center gap-2", className)}
      dim
      intent="meta"
    >
      <CardIcon category={post.category as "writing" | "projects"} />
      <span>
        <span>{formatYear(post.date)}</span>
        {endYear ? (
          <>
            &ndash;<span>{endYear}</span>
          </>
        ) : null}
      </span>
      {thumbnailLink ? (
        <ArrowTopRightIcon className={cn(iconStyle, transformStyle)} />
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
    return <QuoteIcon className={cn(iconStyle, transformStyle, className)} />;
  }
  return <EyeOpenIcon className={cn(iconStyle, transformStyle, className)} />;
};
