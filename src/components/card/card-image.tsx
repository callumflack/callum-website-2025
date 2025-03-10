import {
  Video,
  DEFAULT_ASPECT,
  getDimensions,
  isVideoFile,
} from "@/components/media";
import NextImage from "next/image";
import { cx } from "cva";
import { Post } from "content-collections";

export interface CardImageProps {
  asset: NonNullable<Post["assets"]>[number];
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

  // NB! CardImage aspects must always be 16:10
  const aspect = DEFAULT_ASPECT;
  const { width, height } = getDimensions(aspect);

  return (
    <>
      {isVideo ? (
        // videos use aspect ratio directly
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
            aspectRatio: `${width}/${height}`,
          }}
        />
      )}
    </>
  );
};
