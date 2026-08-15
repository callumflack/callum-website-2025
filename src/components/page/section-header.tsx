import type { ReactNode } from "react";
import { Text } from "@/components/atoms";
import { LinkWithArrow } from "@/components/elements";
import { cn } from "@/lib/utils";

export function SectionHeader({
  as = "h2",
  children,
  className,
  href,
}: {
  as?: "h2" | "h3";
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  return (
    <header data-component="SectionHeader">
      <Text as={as} className={className} intent="title">
        {href ? (
          <LinkWithArrow
            className={cn("text-inherit no-underline! hover:text-accent")}
            href={href}
          >
            {children}
          </LinkWithArrow>
        ) : (
          children
        )}
      </Text>
    </header>
  );
}
