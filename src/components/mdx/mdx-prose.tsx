import { cn } from "@/lib/classes";
import type { HTMLAttributes } from "react";

/*
  mdx-prose is intentionally thin.
  Styling source of truth lives in: src/components/mdx/mdx.css
*/

export type ProseProps = HTMLAttributes<HTMLDivElement>;

export const MdxProse = ({ className, ...props }: ProseProps) => {
  return <main className={cn("Prose", className)} {...props} />;
};
