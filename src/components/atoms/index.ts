/*
  Atoms are the smallest indivisible units of UI.

  Rule of least permission!
  1. Only export what is needed for the apps/web directory
  2. Do not export if it's only used within this directory
 */

export {
  type PolymorphicProps,
  PolymorphicElement,
} from "./polymorphic-element";
export { Text, textVariants, type TextProps } from "./text";
export { Link, type LinkProps } from "./next-link";
export { Button, buttonVariants, type ButtonProps } from "./button";
export { Svg, type SvgIconProps } from "./svg";
