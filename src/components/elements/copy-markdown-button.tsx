"use client";

import { Button } from "@/components/atoms";
import { CopyIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { ClickConfirmation } from "./copy-button";
import { Spinner } from "./spinner";

export type CopyMarkdownButtonProps = {
  url: string;
  label?: string;
};

export const CopyMarkdownButton = ({
  url,
  label = "Copy",
}: CopyMarkdownButtonProps) => {
  const [isCopying, setIsCopying] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showConfirmation = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setShowNotification(true);

    timeoutRef.current = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  const handleCopy = async () => {
    try {
      setIsCopying(true);
      setErrorMessage(null);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to copy (${response.status})`);
      }

      const text = await response.text();
      await navigator.clipboard.writeText(text);
      showConfirmation();
    } catch (error) {
      console.error("Copy markdown error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Copy failed");
      showConfirmation();
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <span className="relative">
      {showNotification && (
        <ClickConfirmation
          hasError={!!errorMessage}
          message={errorMessage || "Markdown copied!"}
        />
      )}
      <Button
        variant="outline"
        size="sm"
        PrefixIcon={isCopying ? <Spinner boxSize={15} /> : <CopyIcon />}
        onClick={handleCopy}
        disabled={isCopying}
      >
        {isCopying ? "Copying…" : label}
      </Button>
    </span>
  );
};
