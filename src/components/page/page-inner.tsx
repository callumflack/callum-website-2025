import { cva, type VariantProps } from "cva";
import { cn } from "@/lib/utils";

export const pageInnerVariants = cva({
  base: "",
  variants: {
    variant: {
      post: "pt-w20 space-y-w8",
      index: "pt-w20 space-y-2.5",
      indexSticky: [
        // Single-line TitleHeader contract.
        "pt-[calc(var(--spacing-w20)-(var(--spacing)*2.5))]",
        "[--height-index-title-header:calc((var(--spacing)*5)+(var(--text-title)*var(--text-title--line-height)))]",
        // Sticky title and list controls.
        "*:data-[component=TitleHeader]:sticky *:data-[component=TitleHeader]:top-0 *:data-[component=TitleHeader]:z-11 *:data-[component=TitleHeader]:bg-canvas *:data-[component=TitleHeader]:py-2.5",
        "**:data-[component=ListHeader]:top-[length:var(--height-index-title-header)]",
      ],
      log: "",
      home: "pt-w8 space-y-2.5",
    },
  },
  defaultVariants: {
    variant: "post",
  },
});

interface PageInnerProps
  extends React.ComponentProps<"div">, VariantProps<typeof pageInnerVariants> {}

export const PageInner = ({ className, variant, ...props }: PageInnerProps) => {
  return (
    <div
      data-component="PageInner"
      className={cn(pageInnerVariants({ variant }), className)}
      {...props}
    >
      {props.children}
    </div>
  );
};
