import type { ComponentPropsWithoutRef } from "react";

interface SvgStyleProps {
  boxSize?: string;
  useBoxSize?: boolean;
  viewbox?: string;
}

export type SvgIconProps = ComponentPropsWithoutRef<"svg"> & SvgStyleProps;

export const Svg = ({
  useBoxSize = true,
  boxSize = "1em",
  viewbox = "0 0 32 32",
  className,
  style,
  ...props
}: SvgIconProps) => (
  <svg
    className={className}
    fill="none"
    style={{
      ...(useBoxSize ? { width: boxSize, height: boxSize } : {}),
      ...style,
    }}
    viewBox={viewbox}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  />
);
