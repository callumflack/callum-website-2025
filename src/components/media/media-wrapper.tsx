import { cn } from "@/lib/classes";
import { cva, type VariantProps } from "cva";
import type { ComponentProps } from "react";
import { getAspectRatioCSS, type AspectRatio } from "./media-utils";

export const mediaWrapperVariants = cva({
  base: [
    // do NOT add w-full! This breaks the outset styles
    "relative overflow-hidden",
    // This provides leeway if any aspect code is "off by one"
    "object-cover",
  ],
  variants: {
    border: {
      true: "border border-ring",
    },
    background: {
      true: "bg-background-hover",
    },
    rounded: {
      true: "sm:rounded-button",
    },
    darkSchemeInvert: {
      true: "dark-scheme-invert",
    },
  },
  defaultVariants: {
    border: true,
    background: true,
    rounded: true,
  },
});

export interface MediaWrapperProps
  extends ComponentProps<"div">,
    VariantProps<typeof mediaWrapperVariants> {
  aspect: AspectRatio;
}

export const MediaWrapper = ({
  border,
  background,
  rounded,
  darkSchemeInvert,
  className,
  aspect,
  children,
  ...props
}: MediaWrapperProps) => {
  return (
    <div
      data-component="MediaWrapper"
      {...props}
      className={cn(
        mediaWrapperVariants({
          border,
          background,
          rounded,
          darkSchemeInvert,
          className,
        })
      )}
      style={{
        aspectRatio: getAspectRatioCSS(aspect),
      }}
    >
      {children}
    </div>
  );
};
