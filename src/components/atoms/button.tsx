import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx, cva, type VariantProps } from "cva";

const buttonVariants = cva({
  base: [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
    // "font-medium",
    "leading-none transition-colors hover:cursor-pointer",
    // reset form states
    // 'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    "outline-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-fill",
    "disabled:pointer-events-none disabled:opacity-50",
    // 'translate-y-[-0.03em] transform',
  ],
  variants: {
    variant: {
      default: "bg-fill-tint hover:bg-fill text-canvas",
      accent: "bg-accent hover:bg-fill text-canvas",
      reverse: "bg-background hover:bg-background text-fill",
      outline: "border border-line hover:border-solid-hover text-fill", // bg-[rgba(255,255,255,0.2)]
      destructive: "bg-destructive text-canvas hover:bg-destructive/90",
      ghost: "hover:bg-background-hover hover:text-solid",
      link: "text-fill underline-offset-4 hover:underline link",
      icon: ["hover:bg-background-hover hover:text-fill", " hover:!text-fill"],
    },
    size: {
      default: "h-[44px] px-w6",
      sm: "h-[36px] px-w4 text-medium text-meta",
      lg: "h-11 rounded-md px-8",
      icon: "size-[42px]",
    },
    // These must match text.tsx
    color: {
      default: "border-current",
      fill: "text-fill",
      solid: "text-solid border-solid",
      background: "text-background border-background",
      canvas: "text-canvas border-canvas",
      accent: "text-accent border-accent",
      // other semantics, maybe?
      // subtle: "text-primary/50",
      // notice: "text-notice",
      // contrast: "text-contrast/90",
    },
    caps: {
      true: "uppercase tracking-meta",
    },
    full: {
      true: "w-full",
    },
  },
  compoundVariants: [
    // Apply classes when conditions are met
    // Applied thus `button({ size: "lead", serif })`
    {
      variant: ["icon"],
      size: "icon",
      class: "rounded-[13px] [&_svg]:size-[1.125em]",
    },
  ],
  defaultVariants: {
    // If I turn these on, these styles are rendered in EVERY use of Button. My understanding is that if overriden by another prop value, they are not applied (which is handled by cn). WTF?
    // variant: "default",
    size: "default",
    color: "default",
  },
});

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  PrefixIcon?: React.ReactNode;
  SuffixIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      color,
      caps,
      full,
      asChild = false,
      PrefixIcon,
      SuffixIcon,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cx(
          buttonVariants({ variant, size, color, caps, full, className })
        )}
        ref={ref}
        {...props}
      >
        {PrefixIcon}
        {/* transform translate-y-[-0.015em] */}
        <span className="inline-flex">{props.children}</span>
        {SuffixIcon}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
