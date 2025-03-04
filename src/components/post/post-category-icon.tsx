import {
  EyeOpenIcon,
  InfoCircledIcon,
  QuoteIcon,
  StackIcon,
} from "@radix-ui/react-icons";
import { cx } from "cva";

export const categoryIconStyle = [
  "size-[1.2em]",
  "transform translate-y-[-0.1em]",
];

export const PostCategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case "projects":
      return <EyeOpenIcon className={cx(categoryIconStyle)} />;
    case "writing":
      return <QuoteIcon className={cx(categoryIconStyle)} />;
    case "library":
      return <StackIcon className={cx(categoryIconStyle)} />;
    case "about":
      return <InfoCircledIcon className={cx(categoryIconStyle)} />;
    default:
      return null;
  }
};
