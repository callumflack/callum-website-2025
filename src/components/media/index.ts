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
export { Video, type VideoProps } from "./video";
