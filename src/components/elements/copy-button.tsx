"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { textVariants } from "@/components/atoms";

export type CopyButtonProps = {
  valueToCopy: string;
  children: React.ReactElement<{
    onClick?: React.MouseEventHandler<HTMLElement>;
  }>;
  confirmationMessage?: string;
  successDuration?: number;
  onSuccessCopy?: () => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
};

export const CopyButton = ({
  valueToCopy,
  children,
  confirmationMessage = "Copied!",
  successDuration = 2000,
  onSuccessCopy,
  onClick,
  className,
}: CopyButtonProps) => {
  const [showCopied, setShowCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showConfirmation = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setShowCopied(true);

    timeoutRef.current = setTimeout(() => {
      setShowCopied(false);
    }, successDuration);
  };

  const handleCopy = async (e: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      onClick(e);
    }

    if (e.defaultPrevented) return;
    e.preventDefault();

    if (!valueToCopy) return;

    try {
      await navigator.clipboard.writeText(valueToCopy);
      showConfirmation();
      if (onSuccessCopy) onSuccessCopy();
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <span className={cn("relative", className)}>
      {showCopied && (
        <ClickConfirmation hasError={false} message={confirmationMessage} />
      )}
      {React.cloneElement(children, {
        onClick: handleCopy,
      })}
    </span>
  );
};

type ClickConfirmationProps = {
  hasError: boolean;
  message: string;
};

export const ClickConfirmation = ({
  hasError,
  message,
}: ClickConfirmationProps) => {
  return (
    <span
      className={cn(
        "absolute -top-[3.5em] left-1/2 z-50 min-w-max",
        "-translate-x-1/2 transform",
        "rounded-button px-w4 pt-2 pb-2.5 shadow-md",
        textVariants({ intent: "pill" })
      )}
      style={{
        backgroundColor: hasError ? "#ef4444" : "#202020",
        color: "#fdfdfd",
      }}
    >
      {message}
    </span>
  );
};
