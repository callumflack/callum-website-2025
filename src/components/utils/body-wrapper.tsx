"use client";

import { usePathname } from "next/navigation";
import { cx } from "cva";

export function BodyWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const pathname = usePathname();
  return (
    <body
      className={cx(
        pathname === "/" ? "bg-background-body" : "",
        pathname.startsWith("/graphics/") ? "bg-background-active" : "",
        className
      )}
    >
      {children}
    </body>
  );
}
