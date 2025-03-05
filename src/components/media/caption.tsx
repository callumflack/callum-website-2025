import { ComponentPropsWithoutRef } from "react";
import { Text } from "@/components/atoms";

export type CaptionProps = ComponentPropsWithoutRef<"figcaption"> & {
  children: React.ReactNode;
  className?: string;
};

export const Caption = ({ children, className }: CaptionProps) => (
  <Text align="left" as="figcaption" className={className} dim intent="meta">
    {children}
  </Text>
);
