/**
 * Media Utilities for Aspect Ratio Handling
 *
 * This module centralizes aspect ratio processing for images and videos:
 *
 * # Canonical Format
 * - The ONLY supported format for aspect ratios is the dash format: "width-height"
 *   Example: "1728-1080" represents width=1728px, height=1080px
 *
 * # Usage in Components
 * - For CSS aspect-ratio property: style={{aspectRatio: getAspectRatioCSS(aspect)}}
 * - For Next.js Image: width and height from getImageDimensions(aspect)
 * - For orientation logic: isPortrait(aspect), isSquare(aspect)
 */

export type AspectRatio = string;

export const DEFAULT_WIDTH = 1600;
export const DEFAULT_HEIGHT = 1000;
export const DEFAULT_ASPECT = "1600-1000";

export const isVideoFile = (url: string) => url.toLowerCase().endsWith(".mp4");

/**
 * Parse aspect ratio string into a numeric ratio
 * Only supports the canonical "width-height" format
 */
export function parseAspectRatio(aspect: AspectRatio): number {
  if (!aspect.includes("-")) {
    console.error(
      `Invalid aspect ratio format: ${aspect}. Use "width-height" format.`
    );
    return DEFAULT_WIDTH / DEFAULT_HEIGHT;
  }

  const [width, height] = aspect.split("-").map(Number);
  if (isNaN(width) || isNaN(height) || height <= 0 || width <= 0) {
    console.error(
      `Invalid aspect ratio values: ${aspect}. Both width and height must be positive numbers.`
    );
    return DEFAULT_WIDTH / DEFAULT_HEIGHT;
  }

  return width / height;
}

/**
 * Get width/height dimensions from aspect ratio string
 */
export function getDimensions(aspect: AspectRatio = DEFAULT_ASPECT): {
  width: number;
  height: number;
} {
  if (!aspect.includes("-")) {
    console.error(
      `Invalid aspect ratio format: ${aspect}. Use "width-height" format.`
    );
    return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
  }

  const [width, height] = aspect.split("-").map(Number);
  if (isNaN(width) || isNaN(height) || height <= 0 || width <= 0) {
    console.error(
      `Invalid aspect ratio values: ${aspect}. Both width and height must be positive numbers.`
    );
    return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
  }

  return { width, height };
}

/**
 * Format aspect ratio for CSS
 */
export function getAspectRatioCSS(aspect: AspectRatio): string {
  if (!aspect.includes("-")) {
    console.error(
      `Invalid aspect ratio format: ${aspect}. Use "width-height" format.`
    );
    return `${DEFAULT_WIDTH} / ${DEFAULT_HEIGHT}`;
  }

  return aspect.replace("-", " / ");
}

/**
 * Get dimensions and aspect ratio from aspect string
 */
export function getImageDimensions(aspect: AspectRatio = DEFAULT_ASPECT): {
  width: number;
  height: number;
  aspectRatioNumber: number;
} {
  const { width, height } = getDimensions(aspect);
  return { width, height, aspectRatioNumber: width / height };
}

/**
 * Determines if an image has portrait orientation
 */
export function isPortrait(aspect: AspectRatio): boolean {
  const { width, height } = getDimensions(aspect);
  return height > width;
}

/**
 * Determines if an image has square orientation
 * with slight tolerance to account for nearly square images
 */
export function isSquare(aspect: AspectRatio, tolerance = 0.175): boolean {
  const { width, height } = getDimensions(aspect);
  const ratio = height / width;
  return ratio >= 1 - tolerance && ratio <= 1 + tolerance;
}

/**
 * Calculate dimensions when one dimension is provided
 */
export function calculateMissingDimension(
  width: number | undefined,
  height: number | undefined,
  aspect: AspectRatio = DEFAULT_ASPECT
): { width: number; height: number } {
  const {
    width: aspectWidth,
    height: aspectHeight,
    aspectRatioNumber,
  } = getImageDimensions(aspect);

  if (width && !height) {
    return { width, height: Math.round(width / aspectRatioNumber) };
  }

  if (!width && height) {
    return { width: Math.round(height * aspectRatioNumber), height };
  }

  if (width && height) {
    return { width, height };
  }

  return { width: aspectWidth, height: aspectHeight };
}
