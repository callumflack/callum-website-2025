"use client";

import React, { useEffect, useState } from "react";
import { cx } from "cva";
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showCopied) {
      setIsVisible(true);
      timeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShowCopied(false), 300); // Remove from DOM after transition
      }, successDuration);
    }
    return () => clearTimeout(timeout);
  }, [showCopied, successDuration]);

  const handleCopy = async (e: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      onClick(e);
    }

    if (e.defaultPrevented) return;
    e.preventDefault();

    if (!valueToCopy) return;

    try {
      await navigator.clipboard.writeText(valueToCopy);
      setShowCopied(true);
      if (onSuccessCopy) onSuccessCopy();
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <span className={cx("relative", className)}>
      {showCopied && (
        <ClickConfirmation
          isVisible={isVisible}
          hasError={false}
          message={confirmationMessage}
        />
      )}
      {React.cloneElement(children, {
        onClick: handleCopy,
      })}
    </span>
  );
};

type ClickConfirmationProps = {
  isVisible: boolean;
  hasError: boolean;
  message: string;
};

export const ClickConfirmation = ({
  isVisible,
  hasError,
  message,
}: ClickConfirmationProps) => {
  return (
    <span
      className={cx(
        "absolute -top-[3.5em] left-1/2 z-50 min-w-max",
        "-translate-x-1/2 transform",
        "text-canvas rounded-button px-w4 pt-2 pb-2.5 shadow-md",
        "transition-all duration-200 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-[1em] opacity-0",
        hasError ? "bg-red-500" : "bg-fill",
        textVariants({ intent: "pill" })
      )}
    >
      {message}
    </span>
  );
};
