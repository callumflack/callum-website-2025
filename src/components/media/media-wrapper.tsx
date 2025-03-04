import { cva, cx, type VariantProps } from "cva";
import type { ComponentProps } from "react";

const mediaWrapperVariants = cva({
  base: [
    // do NOT add w-full! This breaks the outset styles
    "MediaWrapper relative overflow-hidden",
    // This provides leeway if any aspect code is "off by one"
    "object-cover",
  ],
  variants: {
    border: {
      true: "border",
    },
    background: {
      true: "bg-background-active",
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

interface MediaWrapperProps
  extends ComponentProps<"div">,
    VariantProps<typeof mediaWrapperVariants> {
  aspect: string; // always <width>-<height>
}

const MediaWrapper = ({
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
      {...props}
      className={cx(
        mediaWrapperVariants({
          border,
          background,
          rounded,
          darkSchemeInvert,
          className,
        })
      )}
      style={{
        aspectRatio: aspect.replace("-", " / "),
      }}
    >
      {children}
    </div>
  );
};

export { MediaWrapper, mediaWrapperVariants, type MediaWrapperProps };
