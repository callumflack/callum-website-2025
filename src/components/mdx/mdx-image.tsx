import { cx, type VariantProps } from "cva";
import type { ImageProps as NextImageProps } from "next/image";
import NextImage from "next/image";
import { splitAspect } from "../../lib/utils";
import type { MediaFigureProps } from "../media";
import { MediaFigure, mediaWrapperVariants } from "../media";

export interface MdxImageProps
  extends VariantProps<typeof mediaWrapperVariants>,
    Pick<MediaFigureProps, "caption" | "isPortrait">,
    NextImageProps {
  aspect: string; // always <width>-<height>
}

export const MdxImage = ({
  src,
  alt,
  aspect,
  caption,
  isPortrait,
  sizes = "(min-width: 660px) 620px, 100vw",
  border,
  background = true,
  rounded = true,
  darkSchemeInvert,
  ...props
}: MdxImageProps) => {
  const { width, height } = splitAspect(aspect);

  return (
    <MediaFigure caption={caption} figureIntent="inMdx" isPortrait={isPortrait}>
      <NextImage
        alt={alt || ""}
        className={cx(
          mediaWrapperVariants({
            background,
            border,
            darkSchemeInvert,
            rounded,
          })
        )}
        height={height}
        sizes={sizes}
        src={src}
        style={{
          aspectRatio: aspect.replace("-", " / "),
        }}
        width={width}
        {...props}
      />
    </MediaFigure>
  );
};
