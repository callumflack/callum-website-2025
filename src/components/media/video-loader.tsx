import NextImage from "next/image";
import { cx } from "cva";
import { splitAspect } from "../../lib/utils";
import { Spinner } from "../elements/spinner";
import { mediaWrapperVariants } from "./media-wrapper";

interface VideoLoaderProps {
  poster: string;
  aspect: string;
  className?: string;
}

export const VideoLoader = ({
  poster,
  aspect,
  className,
}: VideoLoaderProps) => {
  const { width, height } = splitAspect(aspect);

  return (
    <div className="relative">
      {/* NB! using w-full here means it does NOT fill the parent's max-w-* */}
      <NextImage
        alt="video poster"
        className={cx("VideoPoster", className)}
        height={height}
        priority
        quality={10}
        sizes="(min-width: 1000px) 960px, (min-width: 660px) 620px, 100vw"
        src={poster}
        style={{
          aspectRatio: aspect.replace("-", " / "),
        }}
        width={width}
      />
      <div
        className={cx(
          "VideoLoader !absolute inset-0 flex items-center justify-center bg-black-a5 text-canvas",
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
