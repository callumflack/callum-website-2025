import {
  EyeOpenIcon,
  InfoCircledIcon,
  QuoteIcon,
  StackIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export const categoryIconStyle = [
  "size-[1.2em]",
  "transform translate-y-[-0.1em]",
];

export const PostCategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case "projects":
      return <EyeOpenIcon className={cn(categoryIconStyle)} />;
    case "writing":
      return <QuoteIcon className={cn(categoryIconStyle)} />;
    case "library":
      return <StackIcon className={cn(categoryIconStyle)} />;
    case "about":
      return <InfoCircledIcon className={cn(categoryIconStyle)} />;
    default:
      return null;
  }
};
