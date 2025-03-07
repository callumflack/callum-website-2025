import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx, cva, type VariantProps } from "cva";

const squishStyle = "rounded-squish hover:bg-background-hover hover:text-fill";

export const buttonVariants = cva({
  base: [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
    "transition-colors hover:cursor-pointer",
    // no leading! helps alignment
    "leading-none",
    // reset form states
    // 'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    "outline-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-fill",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  variants: {
    variant: {
      // default: "bg-fill-tint hover:bg-fill text-canvas",
      // accent: "bg-accent hover:bg-fill text-canvas",
      // reverse: "bg-background hover:bg-background text-fill",
      // link: "text-fill underline-offset-4 hover:underline link",
      outline: "border border-line hover:border-solid-hover text-fill",
      ghost: squishStyle,
      icon: [squishStyle, "[&_svg]:size-[1.125em]"],
    },
    size: {
      default: "h-[44px] px-w6 text-body",
      sm: "h-[36px] px-w4 text-meta",
      xs: "h-[27px] px-3 text-meta",
    },
    caps: {
      true: "uppercase tracking-meta",
    },
    full: {
      true: "w-full",
    },
    align: {
      // Align the label within the button
      true: "[&>.Button-children]:translate-y-[-0.03em] transform",
    },
  },
  compoundVariants: [
    {
      // handle icon size
      variant: "icon",
      class: "!size-[44px] !px-0",
    },
  ],
  defaultVariants: {
    variant: "outline",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  PrefixIcon?: React.ReactNode;
  SuffixIcon?: React.ReactNode;
}

export const Button = ({
  className,
  variant,
  size,
  caps,
  full,
  align,
  PrefixIcon,
  SuffixIcon,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cx(
        buttonVariants({ variant, size, caps, full, align, className })
      )}
      {...props}
    >
      {PrefixIcon}
      {/* Button-children is used to align the label within the button */}
      <span className="Button-children inline-flex">{props.children}</span>
      {SuffixIcon}
    </Comp>
  );
};
