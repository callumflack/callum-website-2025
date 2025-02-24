import type { HTMLAttributes } from "react";
import type { VariantProps } from "cva";
import { cx, cva } from "cva";

/* 
  Prose applies parent styles to Markdown blocks.
  The markdown styles are set in mdx-components using Text,
  except for these below, which require targeting from the parent.
 */

export const proseVariants = cva({
  base: [
    "Prose space-y-2.5 group",
    "[&_strong]:font-medium",
    "[&_em]:not-italic",
    // button > media overrides
    "[&_button:first-child>.MediaFigure]:pt-0",
    "[&_button+button]:!mt-0",
    // specifically highlight within a paragraph
    // "[&_p>span]:bg-accent3-background",
    "[&_p>span]:text-fil [&_p>span]:font-medium",
    // Code styles that can't be set in mdx-components due highlight() function
    // or when <code> is used without being wrapped by <pre>
    "[&_code]:text-[0.825em] [&_code]:bg-background-active [&_code]:font-mono",
    "[&_code]:px-[2px] [&_code]:rounded-soft",
    // Hide the footnotes h2
    "[&_#footnotes]:hidden",
    // / Apply `noteStyle` styles to footnotes
    "[&_.footnotes]:text-solid [&_.footnotes]:link-block",
    "[&_.footnotes_p]:text-meta [&_.footnotes_::marker]:text-meta",
    "[&_.footnotes_::marker]:w-4",
    "[&_.footnotes]:scroll-mt-[calc(theme(spacing.nav)+theme(spacing.inset))]",
    "[&_[id*='user-content-fnref']]:scroll-mt-[calc(theme(spacing.nav)+theme(spacing.inset))]",
    // Note spacings
    "[&_.footnotes]:!mt-w12",
    "[&_.Note+.Note]:!mt-2",
    // "[&_.footnotes+.Note]:!mt-2",
    "[&_.footnotes_ol]:pl-3.5",
    // Hide the text content of the footnotes backref link
    "[&_.footnotes_.data-footnote-backref]:indent-[-9999px]",
    "[&_.footnotes_.data-footnote-backref]:inline-flex",
    "[&_.footnotes_.data-footnote-backref]:text-solid",
    // Position new footnotes backref SVG icon using :after
    "[&_.footnotes_.data-footnote-backref]:after:absolute",
    "[&_.footnotes_.data-footnote-backref]:after:top-[0.2em]",
    "[&_.footnotes_.data-footnote-backref]:after:left-[0.3em]",
    "[&_.footnotes_.data-footnote-backref]:after:size-em",
    "[&_.footnotes_.data-footnote-backref]:after:bg-solid",
    // Add new footnotes backref SVG icon via mask so we can colour it
    "[&_.footnotes_.data-footnote-backref]:after:[mask-size:contain]",
    "[&_.footnotes_.data-footnote-backref]:after:[mask-repeat:no-repeat]",
    "[&_.footnotes_.data-footnote-backref]:after:[mask-position:center]",
    "[&_.footnotes_.data-footnote-backref]:after:[mask-image:url('data:image/svg+xml,%3Csvg%20width%3D%2715%27%20height%3D%2715%27%20viewBox%3D%270%200%2015%2015%27%20fill%3D%27none%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M4.85355%202.14645C5.04882%202.34171%205.04882%202.65829%204.85355%202.85355L3.70711%204H9C11.4853%204%2013.5%206.01472%2013.5%208.5C13.5%2010.9853%2011.4853%2013%209%2013H5C4.72386%2013%204.5%2012.7761%204.5%2012.5C4.5%2012.2239%204.72386%2012%205%2012H9C10.933%2012%2012.5%2010.433%2012.5%208.5C12.5%206.567%2010.933%205%209%205H3.70711L4.85355%206.14645C5.04882%206.34171%205.04882%206.65829%204.85355%206.85355C4.65829%207.04882%204.34171%207.04882%204.14645%206.85355L2.14645%204.85355C1.95118%204.65829%201.95118%204.34171%202.14645%204.14645L4.14645%202.14645C4.34171%201.95118%204.65829%201.95118%204.85355%202.14645Z%27%20fill%3D%27black%27%20fill-rule%3D%27evenodd%27%20clip-rule%3D%27evenodd%27%2F%3E%3C%2Fsvg%3E')]",
  ],
});

export interface ProseProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof proseVariants> {}

export const Prose = ({ className, ...props }: ProseProps) => {
  return <div className={cx(proseVariants({ className }))} {...props} />;
};
