import NextImage from "next/image";
import { cx } from "cva";
import {
  getDimensions,
  getAspectRatioCSS,
  type AspectRatio,
} from "@/components/media/media-utils";
import { Spinner } from "@/components/elements/spinner";
import { mediaWrapperVariants } from "./media-wrapper";

interface VideoLoaderProps {
  poster: string;
  aspect: AspectRatio;
  className?: string;
}

export const VideoLoader = ({
  poster,
  aspect,
  className,
}: VideoLoaderProps) => {
  const { width, height } = getDimensions(aspect);
  const aspectRatioCSS = getAspectRatioCSS(aspect);

  return (
    <div className="relative">
      {/* NB! using w-full here means it does NOT fill the parent's max-w-* */}
      <NextImage
        alt="video poster"
        className={cx("VideoPoster", className)}
        height={height}
        priority
        quality={10}
        sizes="(min-width: 660px) 600px, 400px"
        src={poster}
        style={{
          aspectRatio: aspectRatioCSS,
        }}
        width={width}
      />
      <div
        className={cx(
          "VideoLoader bg-black-a5 text-canvas !absolute inset-0 flex items-center justify-center",
          mediaWrapperVariants({
            border: false,
            rounded: true,
          })
        )}
      >
        <Spinner />
      </div>
    </div>
  );
};
