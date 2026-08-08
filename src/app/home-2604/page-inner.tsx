import { cva, type VariantProps } from "cva";
import { cn } from "@/lib/utils";

export const pageInnerVariants = cva({
  base: "",
  variants: {
    variant: {
      post: "pt-w12 space-y-w8",
      index: "pt-w12 space-y-2.5",
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
