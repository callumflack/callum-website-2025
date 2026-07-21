"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import Link from "next/link";
import type { SVGProps } from "react";
import { buttonVariants } from "@/components/atoms";
import { ClickConfirmationSurface } from "@/components/elements/copy-button";
import { cn } from "@/lib/utils";

export const HomeButton = () => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <Link
        href="/"
        aria-label="Return home"
        className={cn(
          buttonVariants({ variant: "icon", size: "sm" }),
          "text-heading -mt-[0.3em]",
          "text-fill hover:text-fill",
          "pointer-events-auto absolute left-0 lg:right-[calc(100%+12px)] lg:left-auto"
        )}
      >
        <LucideCornerUpLeft aria-hidden className="size-em" />
      </Link>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content asChild side="top" sideOffset={8}>
        <ClickConfirmationSurface hasError={false} className="z-50 min-w-max">
          Home
        </ClickConfirmationSurface>
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
);

function LucideCornerUpLeft(props: SVGProps<SVGSVGElement>) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: we do NOT want an html title appearing for this icon
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      aria-hidden
    >
      <title />
      {/* Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE */}
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
        <path d="M9 14L4 9l5-5" />
      </g>
    </svg>
  );
}
