"use client";

import { useWindowScroll } from "react-use";
import { Link, Text } from "@/components/atoms";
import { sortButtonStyle } from "@/components/page/sort-button";
import { cn } from "@/lib/utils";

export const ListHeading = ({ title }: { title: string }) => {
  const { y } = useWindowScroll();
  // same as in Nav.tsx
  const isScrolled = y > 150;

  return (
    <Text
      as="h1"
      intent="body"
      className={cn(
        sortButtonStyle,
        // "!gap-0",
        "hover:text-solid hover:cursor-default!",
        isScrolled ? "text-solid" : "text-transparent!"
      )}
    >
      <Link href="/topic" className="hover:text-fill">
        Topic
      </Link>
      <span>/</span>
      <span>{title}</span>
    </Text>
  );
};
