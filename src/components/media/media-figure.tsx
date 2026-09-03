import { cva, type VariantProps } from "cva";
import type { ComponentProps } from "react";
import { cn } from "@/lib/classes";
import { Caption } from "./caption";

export const mediaFigureVariants = cva({
  base: [
    "relative overflow-hidden space-y-2.5",
    // "[&_img]:max-h-[70vh] [&_video]:max-h-[70vh]",
  ],
  variants: {
    figureIntent: {
      inGrid: "",
      inDialogTrigger: "hover:cursor-zoom-in",
      inMdx: "py-w4 first:pt-0",
      inMdxDialog: "py-w4 hover:cursor-zoom-in",
      mobileInset: "mx-auto max-w-[280px]",
      outset: "-mx-inset md:mx-[-3vw]",
      superOutset: [
        // "-mx-inset",
        "lg:mx-[calc((var(--container-hero)-var(--container-text)-var(--spacing-inset))/2*-1)]",
        // lg:w-hero
      ],
    },
    /*
     * Portrait is a ceiling. Tighter of height×aspect vs width×aspect wins.
     *
     * Change height → max-h on this variant.
     * Change width → max-w on the matching compound (inGrid / inMdxDialog /
     * superOutset).
     * fill-available: leave it; only does work if the parent has a height.
     * Landscape: last compound, w-full, no height cap — don't put max-h on base.
     */
    isPortrait: {
      true: [
        "isPortrait flex flex-col justify-center",
        "[&_img]:mx-auto [&_video]:mx-auto",
        "[&_img]:max-h-[62.5vh] [&_video]:max-h-[62.5vh]",
        "[&_img]:h-[-webkit-fill-available] [&_video]:h-[-webkit-fill-available]",
      ],
    },
  },
  compoundVariants: [
    {
      isPortrait: true,
      figureIntent: "inGrid",
      className: "[&_img]:max-w-full [&_video]:max-w-full",
    },
    {
      isPortrait: true,
      figureIntent: "inMdxDialog",
      // dialog portrait width
      className: "[&_img]:max-w-[280px] [&_video]:max-w-[280px]",
    },
    {
      isPortrait: true,
      figureIntent: "superOutset",
      className: "[&_img]:sm:max-w-fit [&_video]:sm:max-w-fit",
    },
    {
      isPortrait: false,
      className: "[&_img]:w-full [&_video]:w-full",
    },
  ],
});

export interface MediaFigureProps
  extends ComponentProps<"figure">, VariantProps<typeof mediaFigureVariants> {
  caption?: React.ReactNode | string;
  captionClassName?: string;
  // captionIntent?: VariantProps<typeof mediaFigureVariants>["figureIntent"];
}

export const MediaFigure = ({
  caption,
  children,
  captionClassName,
  ...props
}: MediaFigureProps) => (
  <figure
    data-component="MediaFigure"
    className={cn(mediaFigureVariants(props))}
  >
    {children}
    {caption ? (
      <Caption className={cn(captionClassName)}>{caption}</Caption>
    ) : null}
  </figure>
);
