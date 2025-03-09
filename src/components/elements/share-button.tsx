"use client";

/**
 * Client component for copying URLs to clipboard.
 *
 * NOTE: In Next.js app router, this component CANNOT be directly imported by server components.
 * Instead, it must be wrapped by a client boundary component (see share-button-wrapper.tsx).
 *
 * This is due to Next.js component model which prevents passing functions/complex objects
 * between server and client component boundaries. Even with "use client", the way components
 * import each other creates dependencies that affect serialization.
 */

import { Button } from "@/components/atoms";
import { Link1Icon, Link2Icon } from "@radix-ui/react-icons";
import { cx } from "cva";
import { useEffect, useState } from "react";
import { textVariants } from "@/components/atoms";

export type ShareButtonProps = {
  url?: string;
  theme?: "post" | "feed";
};

export const ShareButton = ({ url, theme = "post" }: ShareButtonProps) => {
  const [showCopied, setShowCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showCopied) {
      setIsVisible(true);
      timeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShowCopied(false), 300); // Remove from DOM after transition
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [showCopied]);

  const handleCopy = async () => {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <span className={cx("relative", theme === "post" && "-ml-0.5")}>
      {showCopied && (
        <ClickConfirmation
          isVisible={isVisible}
          hasError={false}
          message="URL copied!"
        />
      )}
      <Button
        variant={theme === "post" ? "outline" : "pill"}
        size={theme === "post" ? "sm" : "reset"}
        className={
          theme === "post"
            ? ""
            : "hover:text-fill hover:!border-fill !border-transparent [&_svg]:size-[1.3em] [&_svg]:translate-y-[0.05em] [&_svg]:transform"
        }
        PrefixIcon={theme === "post" ? <Link2Icon /> : <Link1Icon />}
        onClick={handleCopy}
      >
        Share
      </Button>
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
