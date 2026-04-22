import { ArrowRightIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes } from "react";
import { Link } from "@/components/atoms";

interface LinkWithArrowProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  iconClassName?: string;
  theme?: "feature" | "default";
}

export const LinkWithArrow = ({
  href,
  children,
  className,
  iconClassName,
  theme = "default",
}: LinkWithArrowProps) => {
  const isExternal = href.startsWith("http");
  const shouldReverse = theme === "feature";

  return (
    <Link
      className={cn(
        "relative inline-flex items-center gap-[2px]",
        shouldReverse && "flex-row-reverse !gap-1.5",
        className
      )}
      href={href}
    >
      <span className="flex-grow">{children}</span>
      <span
        className={cn(
          isExternal && theme !== "feature" && "relative flex w-[0.2em]"
        )}
      >
        {isExternal && theme !== "feature" ? (
          <ChevronRightIcon
            className={cn(
              "absolute top-[-0.65em] right-[-0.1em]",
              "size-[0.6em] -rotate-45 transform",
              "!no-underline",
              iconClassName
            )}
          />
        ) : (
          <ArrowRightIcon
            className={cn("translate-y-[0.05em] transform", iconClassName)}
          />
        )}
      </span>
    </Link>
  );
};
