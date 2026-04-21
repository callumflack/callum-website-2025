import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * Teach tailwind-merge about project-specific token names so it can dedupe
 * conflicting utilities (e.g. cn("text-heading", "text-title") → "text-title").
 * twMerge can't read the CSS @theme, so custom names in namespaces whose
 * defaults reject non-stock values (text/radius/spacing/container all default
 * to t-shirt sizes or numbers) must be listed here.
 *
 * Colors are NOT listed: twMerge's default `color: [isAny]` already accepts
 * any token, so bg-*, text-*, border-*, etc. dedupe correctly without help.
 */
const customTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      // Custom font sizes (text-*)
      text: ["fine", "pill", "meta", "body", "heading", "title"],
      // Custom radius (rounded-*)
      radius: ["soft", "button", "card", "squish"],
      // Custom spacing (p-*, m-*, gap-*, px-*, etc.)
      spacing: [
        "inset",
        "inset-text",
        "nav",
        "tab",
        "em",
        "bullet",
        "gap",
        "small",
        "minor",
        "submajor",
        "major",
        "w4",
        "w5",
        "w6",
        "w8",
        "w10",
        "w12",
        "w16",
        "w20",
        "w24",
        "w28",
        "w32",
        "w36",
        "w42",
        "w48",
        "w64",
        "w72",
        "w96",
      ],
      // Custom container widths (max-w-*)
      container: ["text", "hero", "text-inset"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
