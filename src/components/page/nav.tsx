"use client";

import { cx } from "cva";
import { usePathname } from "next/navigation";
import { useWindowScroll } from "react-use";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Link } from "../atoms/next-link";
import { OutsetRule } from "../elements/outset-rule";
import { textVariants } from "../atoms/text";

const linkStyle = [
  "h-tab flex items-center gap-0 relative hover:text-accent",
  "before:absolute before:left-[-2px] before:right-[-2px] before:bottom-[-1px] before:border-b",
  // "hover:before:border-accent",
];

interface NavProps {
  anchorName: string;
  navItems: NavLinkProps[];
  activeNav?: string;
  showRootActive?: boolean;
  className?: string;
  ruleClassName?: string;
  componentName?: string;
}

export const Nav = ({
  anchorName,
  navItems,
  activeNav,
  showRootActive = false,
  className,
  ruleClassName,
  componentName = "Nav",
}: NavProps) => {
  const pathname = usePathname();
  const { y } = useWindowScroll();
  const isScrolled = y > 150;

  return (
    // Want id="top"? Move it to a parent element without sticky positioning
    <div
      data-component={componentName}
      className={cx(
        "bg-canvas sticky top-0 z-200",
        // "bg-canvas border-b"
        // "bg-canvas-[0.99] backdrop-blur-xl"
        className
      )}
    >
      <nav
        className={cx(
          "container flex items-center gap-2.5",
          "pt-[calc(var(--spacing-nav)-var(--spacing-tab))]",
          "border-x"
        )}
      >
        <NavLink
          className={cx("pl-0 before:left-0")}
          isActive={pathname === "/" || showRootActive}
          href="/"
          label={anchorName}
        />
        <span className="px-1">/</span>
        <div className="flex items-center gap-4">
          {navItems.map(({ href, label }) => (
            <NavLink
              href={href}
              isActive={
                pathname === href ||
                (activeNav && href.startsWith(`/${activeNav}`)) ||
                pathname.startsWith(href)
              }
              key={href}
              label={label}
            />
          ))}
        </div>
      </nav>

      <OutsetRule
        ruleClassName={cx(
          isScrolled ? "border-border" : "border-transparent",
          ruleClassName
        )}
      />
    </div>
  );
};

interface NavLinkProps {
  href: string;
  className?: string;
  label: string;
  isActive?: boolean;
}

const NavLink = ({ href, isActive, label, className }: NavLinkProps) => (
  <Link
    className={cx(
      textVariants({ intent: "meta", weight: "medium" }),
      linkStyle,
      isActive
        ? "before:border-fill hover:before:border-accent"
        : "before:border-transparent",
      className
    )}
    href={href}
  >
    {label}
    {href.includes("https://") && (
      <ArrowTopRightIcon className="mt-[-0.25em] size-[1.25em]" />
    )}
  </Link>
);
