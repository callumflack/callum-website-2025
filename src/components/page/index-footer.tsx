import type { ReactNode } from "react";
import {
  focusVisibleOutlineStyle,
  textVariants,
} from "@/components/atoms";
import { LinkWithArrow } from "@/components/elements";
import { cn } from "@/lib/utils";

export function IndexFooter({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <div className="pt-gap flex justify-end" data-component="IndexFooter">
      <LinkWithArrow
        className={cn(
          textVariants({ intent: "meta", weight: "normal", color: "solid" }),
          "hover:text-fill inline-flex min-h-10 items-center gap-1",
          focusVisibleOutlineStyle
        )}
        href={href}
      >
        {children}
      </LinkWithArrow>
    </div>
  );
}
