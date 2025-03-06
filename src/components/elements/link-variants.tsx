import { ArrowRightIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { cx } from "cva";
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
      className={cx(
        "inline-flex items-center gap-[2px]",
        shouldReverse && "flex-row-reverse !gap-1.5",
        className
      )}
      href={href}
    >
      <span className="flex-grow">{children}</span>
      <span
        className={cx(
          isExternal && theme !== "feature" && "relative flex w-[0.35em]"
        )}
      >
        {isExternal && theme !== "feature" ? (
          <ChevronRightIcon
            className={cx(
              "absolute top-[0.05em] right-[-0.2em] size-[0.7em]",
              "size-[0.7em] -rotate-45 transform",
              "!no-underline",
              iconClassName
            )}
          />
        ) : (
          <ArrowRightIcon
            className={cx("translate-y-[0.05em] transform", iconClassName)}
          />
        )}
      </span>
    </Link>
  );
};
