"use client";

import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";

export function CodeCopyButton() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
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
      className="CodeCopyButton"
      onClick={handleCopy}
      type="button"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}
