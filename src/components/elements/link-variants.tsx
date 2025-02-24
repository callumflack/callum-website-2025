import { ArrowRightIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { cx } from "cva";
import type { AnchorHTMLAttributes } from "react";
import { Link } from "../atoms/next-link";

interface LinkWithArrowProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  iconClassName?: string;
}

export const LinkWithArrow = ({
  href,
  children,
  className,
  iconClassName,
}: LinkWithArrowProps) => {
  const isExternal = href.startsWith("http");

  return (
    <Link
      className={cx(
        "inline-flex",
        isExternal ? "" : "items-center gap-[2px]",
        className
      )}
      href={href}
    >
      <span className="flex-grow">{children}</span>
      <span className={cx(isExternal && "relative flex w-[0.35em]")}>
        {isExternal ? (
          <ChevronRightIcon
            className={cx(
              "absolute right-[-0.2em] top-[0.05em] size-[0.7em]",
              "size-[0.7em] transform -rotate-45",
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
