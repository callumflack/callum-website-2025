import type {
  ComponentPropsWithoutRef,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
} from "react";
import { cloneElement, forwardRef, useEffect, useRef, useState } from "react";
import { textVariants } from "@/components/atoms";
import { cn } from "@/lib/utils";

export type CopyButtonProps = {
  valueToCopy: string;
  children: ReactElement<{
    onClick?: MouseEventHandler<HTMLElement>;
  }>;
  confirmationMessage?: string;
  successDuration?: number;
  onSuccessCopy?: () => void;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
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

  const handleCopy = async (e: MouseEvent<HTMLElement>) => {
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

  // cloneElement merges onClick onto the child so currentTarget stays the interactive node.
  // eslint-disable-next-line react-hooks/refs -- prop merge via cloneElement, not a render-time ref read
  const trigger = cloneElement(children, {
    onClick: handleCopy,
  });

  return (
    <span className={cn("relative", className)}>
      {showCopied && (
        <ClickConfirmation hasError={false} message={confirmationMessage} />
      )}
      {trigger}
    </span>
  );
};

type ClickConfirmationProps = {
  hasError: boolean;
  message: string;
};

type ClickConfirmationSurfaceProps = ComponentPropsWithoutRef<"span"> & {
  hasError: boolean;
};

export const ClickConfirmationSurface = forwardRef<
  HTMLSpanElement,
  ClickConfirmationSurfaceProps
>(({ hasError, className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "rounded-button px-3 pt-2 pb-2.25 shadow-md",
      textVariants({ intent: "pill" }),
      // inverted toast: same pairing as globals selection (`bg-fill text-canvas`)
      "text-canvas",
      hasError ? "bg-destructive" : "bg-fill",
      className
    )}
    {...props}
  />
));

ClickConfirmationSurface.displayName = "ClickConfirmationSurface";

export const ClickConfirmation = ({
  hasError,
  message,
}: ClickConfirmationProps) => {
  return (
    <ClickConfirmationSurface
      hasError={hasError}
      className={cn(
        "absolute -top-[3.25em] left-1/2 z-50 min-w-max",
        "-translate-x-1/2 transform"
      )}
    >
      {message}
    </ClickConfirmationSurface>
  );
};
