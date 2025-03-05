import NextImage from "next/image";
import { cx } from "cva";
import { splitAspect } from "@/lib/utils";
import { Spinner } from "@/components/elements/spinner";
import { mediaWrapperVariants } from "./media-wrapper";

interface VideoLoaderProps {
  poster: string;
  aspect: number;
  className?: string;
}

// Helper to normalize aspect ratio for CSS
function normalizeAspectRatio(aspect: number): string {
  return String(aspect);
}

export const VideoLoader = ({
  poster,
  aspect,
  className,
}: VideoLoaderProps) => {
  const { width, height } = splitAspect(aspect);
  const aspectRatio = normalizeAspectRatio(aspect);

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
          aspectRatio: aspectRatio.includes("/")
            ? aspectRatio
            : aspectRatio.replace("-", " / "),
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
