import type { VariantProps } from "cva";
import { cx, cva } from "cva";

export const textVariants = cva({
  base: "",
  variants: {
    intent: {
      fine: "text-fine", // subpixel-antialiased?
      fineHeading: "text-fine font-bold uppercase tracking-metaHeading",
      meta: "text-meta",
      body: "text-body",
      bodyHeading: "text-meta font-bold",
      heading: "text-heading font-medium",
      title: "text-title font-medium",
    },
    color: {
      canvas: "text-canvas",
      "solid-light": "text-solid-light",
      solid: "text-solid",
      fill: "text-fill",
      "fill-tint": "text-fill-tint",
      accent: "text-accent",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    link: {
      // styles specified in theme-utils.css
      default: "link",
      accent: "link-accent",
      large: "link-large",
    },
    dim: {
      true: "!text-solid",
    },
    caps: {
      true: "uppercase",
    },
    inline: {
      true: "leading-none",
    },
    balance: {
      true: "text-balance",
    },
    bullet: {
      true: [
        // "relative before:content-['']",
        // "before:absolute before:inline-block before:bg-current",
        // "before:-left-[1.25em] before:top-[0.66em] before:h-[0.05em] before:w-[1em]",
        "list-disc",
      ],
    },
  },
  // Compound variants apply classes when multiple other variant conditions are met: https://cva.style/docs/getting-started/variants#compound-variants
  compoundVariants: [
    // {
    //   caps: true,
    //   size: ["heading"],
    //   class: "!tracking-[0.05em]",
    // },
  ],
  defaultVariants: {
    // intent: "body",
  },
});

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
  as?: React.ElementType;
  children: React.ReactNode;
}

export const Text = ({
  as: Component = "p",
  className,
  intent,
  color,
  weight,
  align,
  caps,
  inline,
  balance,
  bullet,
  dim,
  children,
  ...props
}: TextProps) => {
  const bulletProp = Component === "li" ? true : bullet;

  const formattedChildren: React.ReactNode =
    typeof children === "string" ? formatText(children) : children;

  return (
    <Component
      {...props}
      className={cx(
        textVariants({
          intent,
          color,
          weight,
          align,
          caps,
          inline,
          balance,
          bullet: bulletProp,
          dim,
          className,
        }),
        Component === "ul" ? "pl-bullet" : ""
      )}
    >
      {formattedChildren}
      {/* {children} */}
    </Component>
  );
};

// Doubles: &ldquo; &rdquo;  “ ” "Pretty"
// Singles: &lsquo; &rsquo; ’ ‘ 'Pretty'
function formatText(text: string): string {
  return text
    .replace(/'/g, "\u2019") // Left single quote (&lsquo; or '\u2019')
    .replace(/'/g, "\u2018") // Right single quote (&rsquo; or '\u2018')
    .replace(/"/g, "\u201C") // Left double quote (&ldquo; or '\u201C')
    .replace(/"/g, "\u201D"); // Right double quote (&rdquo; or '\u201D')
}
