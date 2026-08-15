import type { ReactNode } from "react";
import { focusVisibleOutlineStyle } from "@/components/atoms";
import { LinkWithArrow } from "@/components/elements";
import { cn } from "@/lib/utils";
import { sortButtonStyle } from "./sort-button";

export function ViewAll({
  children = "View all",
  className,
  href,
}: {
  children?: ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <div className="flex justify-end" data-component="ViewAll">
      <LinkWithArrow
        className={cn(
          sortButtonStyle,
          "text-solid gap-1! no-underline!",
          focusVisibleOutlineStyle,
          className
        )}
        href={href}
      >
        {children}
      </LinkWithArrow>
    </div>
  );
}
