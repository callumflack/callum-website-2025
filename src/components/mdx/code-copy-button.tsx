"use client";

import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { focusVisibleOutlineStyle } from "@/components/atoms";
import { cn } from "@/lib/utils";

export function CodeCopyButton() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    const container = event.currentTarget.closest('[data-component="pre"]');
    const code = container?.querySelector("code")?.textContent;

    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy code block:", error);
    }
  };

  return (
    <button
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn(
        "text-solid/50 hover:text-fill focus-visible:text-fill",
        "inline-flex items-center justify-center",
        "rounded-soft size-12",
        "[&_svg]:size-4",
        focusVisibleOutlineStyle
      )}
      onClick={handleCopy}
      type="button"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}
