import { Video } from "@/components/media";
import { isVideoFile } from "@/lib/utils";
import { DEFAULT_ASPECT, getDimensions } from "@/lib/media-utils";
import NextImage from "next/image";
import { cx } from "cva";
import { Post } from "content-collections";

export interface CardImageProps {
  asset: NonNullable<Post["assets"]>[number];
  sizes?: string;
  priority?: boolean;
  className: string;
}

// NB! CardImage aspects must always be 16:10
export const CardImage = ({
  asset,
  sizes = "(min-width: 1000px) 1080px, 100vw",
  priority,
  className,
}: CardImageProps) => {
  const isVideo = isVideoFile(asset.src);

  // Set aspect to 16:10
  const aspect = DEFAULT_ASPECT; // use constant from media-utils
  const { width, height } = getDimensions(aspect);

  return (
    <>
      {isVideo ? (
        // videos use aspect ratio directly
        <Video
          key={asset.src}
          aspect={aspect}
          className={cx("CardImageVideo", className)}
          poster={asset.poster || ""}
          src={asset.src}
        />
      ) : (
        // but images use extracted dimensions
        <NextImage
          key={asset.src}
          alt={asset.alt}
          className={cx("CardImageImage", className)}
          priority={priority}
          sizes={sizes}
          src={asset.src}
          height={height}
          width={width}
        />
      )}
    </>
  );
};
