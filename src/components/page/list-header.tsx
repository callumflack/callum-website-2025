import { cn } from "@/lib/utils";

export const ListHeader = ({
  children,
  rhsNode,
  showContained,
  className,
  ariaLabel,
}: {
  children?: React.ReactNode;
  rhsNode?: React.ReactNode;
  showContained?: boolean;
  className?: string;
  ariaLabel?: string;
}) => (
  <div
    data-component="ListHeader"
    className={cn(
      "bg-canvas sticky top-0 z-10",
      // "translate-y-px transform",
      className
    )}
  >
    {/*
     * The ::before here is LOAD-BEARING — do not remove.
     *
     * JOB: masks scrolling content that sits BELOW the sticky header when
     * it has a background wider than the text container (e.g. post-line
     * hover states that paint a gray fill extending past the container
     * edges). The outer <div>'s bg-canvas covers the full viewport, but
     * children inside the nav at z-1 need a dedicated bg-canvas layer at
     * z-0 INSIDE the nav's own stacking context so wide hover backgrounds
     * scrolling up underneath get properly masked at the sticky boundary.
     *
     * - contained: pseudo matches the container width exactly (inset-x-0)
     * - uncontained: pseudo extends horizontally by spacing-inset so it
     *   covers the viewport edges where wide hover bgs can bleed in
     *
     * The uncontained mask must match lineHoverStyle's full spacing-inset.
     * Do not subtract 1px to leave room for gutter-rules: when enabled,
     * data-gutter-align redraws those rules above opaque sticky surfaces.
     * Shrinking this mask instead exposes the scrolling hover wash as a 1px
     * vertical rail beneath the sticky header.
     *
     * Removing this causes visible bleed-through of hovered list rows
     * scrolling past the sticky header. Verified by turning it off.
     */}
    <nav
      aria-label={ariaLabel}
      {...(showContained ? { "data-gutter-align": "" } : {})}
      className={cn(
        "relative",
        showContained ? "container" : "",
        "before:bg-canvas before:absolute before:inset-y-0 before:z-0 before:content-['']",
        showContained
          ? "before:inset-x-0"
          : "before:-inset-x-inset"
      )}
    >
      <div className="relative z-1 flex justify-between">
        <div className="flex items-center justify-start gap-2.5">
          {children}
        </div>
        {rhsNode}
      </div>
      <hr className="relative -mt-px" />
    </nav>
  </div>
);
