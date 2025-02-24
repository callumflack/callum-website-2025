import { cx, type VariantProps } from "cva";
import type { VideoProps, MediaFigureProps } from "../media";
import { Video, MediaFigure, mediaWrapperVariants } from "../media";

export interface MdxVideoProps
  extends VariantProps<typeof mediaWrapperVariants>,
    Pick<MediaFigureProps, "caption" | "isPortrait">,
    VideoProps {
  aspect: string; // always <width>-<height>
}

export const MdxVideo = ({
  src,
  poster,
  aspect,
  allowSound,
  caption,
  isPortrait,
  border,
  background = true,
  rounded = true,
}: MdxVideoProps) => {
  return (
    <MediaFigure caption={caption} figureIntent="inMdx" isPortrait={isPortrait}>
      <Video
        allowSound={allowSound}
        aspect={aspect}
        className={cx(
          mediaWrapperVariants({
            background,
            border,
            rounded,
          })
        )}
        poster={poster}
        src={src}
      />
    </MediaFigure>
  );
};
