import {
  Video,
  DEFAULT_ASPECT,
  getDimensions,
  isVideoFile,
  getAspectRatioCSS,
} from "@/components/media";
import { MediaErrorBoundary } from "@/components/utils";
import NextImage from "next/image";
import { cx } from "cva";
import { Post } from "content-collections";

export interface CardImageProps {
  asset: NonNullable<Post["assets"]>[number]; // or content.ts Asset type?
  sizes?: string;
  priority?: boolean;
  className: string;
}

export const CardImage = ({
  asset,
  sizes = "(min-width: 1000px) 1080px, 100vw",
  priority,
  className,
}: CardImageProps) => {
  const isVideo = isVideoFile(asset.src);

  // NB! CardImage aspects must always be "1600-1000"
  const aspect = DEFAULT_ASPECT;
  const { width, height } = getDimensions(aspect);

  return (
    <MediaErrorBoundary>
      {isVideo ? (
        // videos use aspect ratio only
        <Video
          key={asset.src}
          aspect={aspect}
          className={cx("CardImage-Video", className)}
          poster={asset.poster || ""}
          src={asset.src}
        />
      ) : (
        // but images use extracted dimensions
        <NextImage
          key={asset.src}
          alt={asset.alt}
          className={cx("CardImage-Image", className)}
          priority={priority}
          sizes={sizes}
          src={asset.src}
          height={height}
          width={width}
          style={{
            aspectRatio: getAspectRatioCSS(aspect),
          }}
        />
      )}
    </MediaErrorBoundary>
  );
};
