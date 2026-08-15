import { ArrowRightIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import type { AnchorHTMLAttributes } from "react";
import { Link } from "@/components/atoms";
import { cn } from "@/lib/utils";

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
        "relative inline-flex w-fit items-center gap-[0.25em]",
        shouldReverse && "flex-row-reverse gap-1.5!",
        className
      )}
      href={href}
      data-slot="link-with-arrow"
    >
      <span className="grow">{children}</span>
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
              "no-underline!",
              iconClassName
            )}
          />
        ) : (
          <ArrowRightIcon
            className={cn(
              "size-[1em] shrink-0 translate-y-[0.05em]",
              iconClassName
            )}
          />
        )}
      </span>
    </Link>
  );
};
