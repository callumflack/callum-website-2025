/*
  Rule of least permission!
  1. Only export what is needed for the apps/web directory
  2. Do not export if it's only used within this directory
 */

export {
  MediaWrapper,
  mediaWrapperVariants,
  type MediaWrapperProps,
} from "./media-wrapper";
export {
  MediaFigure,
  mediaFigureVariants,
  type MediaFigureProps,
} from "./media-figure";
// NOTE: Legacy zoomable variants are archived in ./legacy
// Only supported implementation: zoomable-02.tsx (imported directly where needed)
export { Video, type VideoProps } from "./video";
export { Caption, type CaptionProps } from "./caption";
export * from "./media-utils";
