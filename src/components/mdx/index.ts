/*
  Rule of least permission!
  Do not export if it's only used within this directory
 */

export * from "./mdx";
export { Prose, proseVariants, type ProseProps } from "./prose";
