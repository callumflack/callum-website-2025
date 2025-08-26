import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Create a custom twMerge that recognizes all custom colors using validators
const customTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      // Custom font families (font-*)
      // Font families are handled automatically by Tailwind Merge's default configuration.
      // fontFamily: ["sans", "heading", "mono"],
      // Custom font sizes (text-*)
      text: [
        "fine",
        "pill",
        "meta",
        "small",
        "body",
        "large",
        "subheading",
        "heading",
        "title",
        "supersub",
        "super",
      ],
      // Custom colors (text-*)
      color: [
        // Shadcn colors
        "card",
        "card-foreground",
        "popover",
        "popover-foreground",
        "primary",
        "primary-foreground",
        "secondary",
        "secondary-foreground",
        "muted",
        "muted-foreground",
        "accent",
        "accent-foreground",
        "destructive",
        "destructive-foreground",
        "input",
        "chart-1",
        "chart-2",
        "chart-3",
        "chart-4",
        "chart-5",
        "success",
        // Project semantic colors
        "canvas",
        "canvas-contrast",
        "panel",
        "line",
        "border",
        "border-hover",
        "background",
        "background-hover",
        "background-active",
        "background-subtle",
        "background-body",
        "foreground",
        // Accent aliases
        "accent2",
        "accent3",
        "accent3bg",
        "accent3hover",
        // Allow color patterns via validators
        (value: string) => {
          const patterns = [
            /^(solid|fill|border|ring|background|foreground)$/, // Match exact names
            /^(solid|fill|border|ring|background|foreground)-\w+$/, // Match with suffix
            /^background-(subtle|ui|uihover|uiactive|ui-active|body)$/,
            /^border-hover$/,
            /^(black|white)-a\d{1,2}$/,
            /^a-(solid|fill|border|ring|background)(-\w+)?$/,
            /^accent-(solid|fill|border|ring|background)(-\w+)?$/,
            /^a-accent-(solid|border|background)(-\w+)?$/,
            /^purple-(solid|text|fill)(-\w+)?$/,
            /^purplegray-fill$/,
            /^g-\w+(-dark)?$/,
            /^sidebar(-\w+)?$/,
          ];
          return patterns.some((pattern) => pattern.test(value));
        },
      ],
      // Custom border radius values (rounded-*)
      radius: ["soft", "button", "card", "squish", "sm", "md", "lg", "xl"],
      // Custom spacing values (p-*, m-*, gap-*, etc.)
      spacing: [
        "inset",
        "nav",
        "header",
        "tab",
        "bar",
        "button-xs",
        "em",
        "bullet",
        "gap",
        "small",
        "minor",
        "submajor",
        "major",
        "super",
        // w* spacing values
        (value: string) => /^w\d+$/.test(value), // Matches w4, w5, w6, etc.
      ],
      // Custom container widths (max-w-*)
      container: [
        "default",
        "stream",
        "text-narrow",
        "text",
        "mid",
        "landing",
        "hero",
        "default-inset",
        "text-inset",
        "hero-inset",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
