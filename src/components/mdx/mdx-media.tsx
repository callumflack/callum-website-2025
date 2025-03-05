import {
  MediaFigure,
  mediaWrapperVariants,
  Video,
  Zoomable,
  type MediaFigureProps,
  type MediaWrapperProps,
  type VideoProps,
  type ZoomableProps,
} from "@/components/media";
import { cx } from "cva";
import NextImage, { type ImageProps } from "next/image";

export type MdxImageProps = Partial<ZoomableProps> &
  Partial<Omit<MediaFigureProps, "children">> &
  Partial<MediaWrapperProps> &
  ImageProps & {
    caption?: React.ReactNode;
    aspect?: number | string;
  };

export type ZoomableVideoProps = Omit<VideoProps, "className"> &
  Partial<Omit<MediaFigureProps, "children">> &
  Partial<MediaWrapperProps> & {
    caption?: React.ReactNode;
  };

function processMediaProps(
  src: ImageProps["src"] | string | undefined,
  alt: string = "",
  width: string | number | undefined,
  height: string | number | undefined,
  aspect: string | number | undefined,
  caption: React.ReactNode | undefined
) {
  // Process caption
  let extractedCaption = caption;
  let cleanAlt = alt;

  const captionMatch = alt.match(/\[caption:\s*(.*?)\]/);
  if (captionMatch) {
    extractedCaption = captionMatch[1];
    cleanAlt = alt.replace(captionMatch[0], "").trim();
  }

  // Calculate dimensions
  const aspectRatio = aspect
    ? typeof aspect === "number"
      ? aspect
      : eval(aspect.toString())
    : 16 / 9;

  let calculatedWidth = width ? Number(width) : undefined;
  let calculatedHeight = height ? Number(height) : undefined;

  if (!calculatedWidth && calculatedHeight) {
    calculatedWidth = Math.round(Number(calculatedHeight) * aspectRatio);
  } else if (calculatedWidth && !calculatedHeight) {
    calculatedHeight = Math.round(Number(calculatedWidth) / aspectRatio);
  } else if (!calculatedWidth && !calculatedHeight) {
    calculatedWidth = 900;
    calculatedHeight = Math.round(calculatedWidth / aspectRatio);
  }

  const isPortrait = Boolean(
    calculatedHeight && calculatedWidth && calculatedHeight > calculatedWidth
  );

  return {
    src,
    cleanAlt,
    extractedCaption,
    width: calculatedWidth ?? 0,
    height: calculatedHeight ?? 0,
    isPortrait,
  };
}

export function ZoomableImage(props: MdxImageProps) {
  const {
    src,
    alt = "",
    width,
    height,
    aspect,
    priority = false,
    caption,
    border,
    background,
    rounded,
  } = props;

  const {
    cleanAlt,
    extractedCaption,
    width: calculatedWidth,
    height: calculatedHeight,
    isPortrait,
  } = processMediaProps(src, alt, width, height, aspect, caption);

  return (
    <Zoomable className="py-w4 first:pt-0">
      <MediaFigure caption={extractedCaption} isPortrait={isPortrait}>
        <NextImage
          src={src}
          alt={cleanAlt}
          width={calculatedWidth}
          height={calculatedHeight}
          priority={priority}
          sizes="(min-width: 660px) 620px, 100vw"
          draggable={false}
          className={cx(mediaWrapperVariants({ border, background, rounded }))}
        />
      </MediaFigure>
    </Zoomable>
  );
}

export function ZoomableVideo(props: ZoomableVideoProps) {
  const {
    src,
    poster,
    width,
    height,
    caption,
    aspect,
    border,
    background,
    rounded,
    allowSound,
    ...rest
  } = props;

  const altText = "";
  const { extractedCaption, isPortrait } = processMediaProps(
    src,
    altText,
    width,
    height,
    aspect,
    caption
  );

  // Handle aspect ratio conversion for Video component
  // Video component expects format like "16-9" or "1728-1080"
  // but we're standardizing on numeric values like 16/9 or 1728/1080
  let formattedAspect: string;

  if (typeof aspect === "number") {
    // For numeric aspect ratios (e.g. 1.6), convert to closest standard ratio (e.g. "16-10")
    // or if it's not a standard ratio, use the original number with high precision
    const standardRatios = {
      // common aspect ratios and their string equivalents
      [16 / 9]: "16-9",
      [4 / 3]: "4-3",
      [1]: "1-1",
      [21 / 9]: "21-9",
      [1728 / 1080]: "1728-1080", // example from the MDX
    };

    // Check if it's a standard ratio first
    formattedAspect =
      standardRatios[aspect] ||
      // If not, convert to string with format like "1.6" → "16-10"
      `${Math.round(aspect * 1000)}`.replace(/(\d+)(\d{3})/, "$1-$2");
  } else if (typeof aspect === "string" && aspect.includes("/")) {
    // Handle string division format like "16/9"
    const [width, height] = aspect
      .split("/")
      .map((num) => parseInt(num.trim(), 10));
    formattedAspect = `${width}-${height}`;
  } else {
    // Fallback to the string as-is
    formattedAspect = aspect?.toString() || "16-9";
  }

  return (
    <Zoomable className="py-w4 first:pt-0">
      <MediaFigure caption={extractedCaption} isPortrait={isPortrait}>
        <Video
          src={typeof src === "string" ? src : ""}
          poster={poster || ""}
          aspect={formattedAspect}
          allowSound={allowSound}
          className={cx(mediaWrapperVariants({ border, background, rounded }))}
          {...rest}
        />
      </MediaFigure>
    </Zoomable>
  );
}
