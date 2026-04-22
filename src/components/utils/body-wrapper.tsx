"use client";

// Currently unused.

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
      className={cn(
        pathname === "/" ? "bg-background-active" : "",
        pathname.startsWith("/graphics/") ? "bg-background-active" : "",
        className
      )}
    >
      {children}
    </body>
  );
}
