"use client";

import { cx } from "cva";

export const ListHeader = ({
  children,
  rhsNode,
  showContained,
  className,
}: {
  children: React.ReactNode;
  rhsNode?: React.ReactNode;
  showContained?: boolean;
  className?: string;
}) => (
  <div
    data-component="ListHeader"
    className={cx(
      "bg-canvas top-nav sticky z-10",
      "translate-y-px transform",
      className
    )}
  >
    <nav
      className={cx(
        "relative",
        showContained ? "container border-x" : "",
        "before:bg-canvas before:absolute before:inset-y-0 before:z-0 before:content-['']",
        showContained
          ? "before:-inset-x-0"
          : "before:-inset-x-[calc(var(--spacing-inset)-1px)]"
      )}
    >
      <div className="relative z-1 flex justify-between">
        <div className="flex items-center justify-start gap-2.5">
          {children}
        </div>
        {rhsNode}
      </div>
      <hr className="relative -mt-px" />
    </nav>
  </div>
);
