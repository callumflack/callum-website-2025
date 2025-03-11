"use client";

import { Link, Text } from "@/components/atoms";
import { useState } from "react";
import { useEffect } from "react";
import { useWindowScroll } from "react-use";
import { sortButtonStyle } from "@/components/post/sort/sort-button";
import { cx } from "cva";

export const ListHeading = ({ title }: { title: string }) => {
  const { y } = useWindowScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // same as in Nav.tsx
    setIsScrolled(y > 150);
  }, [y]);

  return (
    <Text
      as="h1"
      intent="body"
      className={cx(
        sortButtonStyle,
        // "!gap-0",
        "hover:text-solid hover:!cursor-default",
        isScrolled ? "text-solid" : "!text-transparent"
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
