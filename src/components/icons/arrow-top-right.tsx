import type { SvgIconProps } from "@/components/atoms";
import { Svg as SvgComponent } from "@/components/atoms";

// material-symbols:arrow-top-right
export const ArrowTopRight = (props: SvgIconProps) => (
  <SvgComponent viewbox="0 0 24 24" {...props}>
    <path
      d="M5 20V8h11.175l-3.6-3.575L14 3l6 6l-6.025 6.025l-1.4-1.425l3.6-3.6H7v10z"
      fill="currentColor"
    />
  </SvgComponent>
);
