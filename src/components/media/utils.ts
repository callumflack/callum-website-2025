/**
 * Media Utilities for Aspect Ratio Handling
 *
 * This file centralizes aspect ratios and dimensions for images and videos:
 *
 * # Aspect Ratio Implementation
 * - Videos: Apply aspect ratio directly via CSS `aspect-ratio` property
 *   Video.tsx: style={{aspectRatio: String(aspect)}}
 *
 * - Images: Calculate explicit width/height props based on aspect ratio
 *   width and height are derived from aspect using getDimensions()
 *
 * # Benefits
 * - Consistent handling across components
 * - Proper cumulative layout shift (CLS) prevention
 * - Type-safe numeric aspect ratio values (16/9 instead of "16/9" strings)
 *
 * # Usage in components
 * - Video: aspect={16/9} → translated to style.aspectRatio
 * - NextImage: width/height calculated from aspect, preventing NaN errors
 */

// When we set aspect in front-matter, it must be a string
// When we set aspect in a component, it's nicer as a number
type AspectRatio = number | string;

export const DEFAULT_WIDTH = 1600;
export const DEFAULT_HEIGHT = 1000;
export const DEFAULT_ASPECT = 16 / 10; // 1.6

/**
 * Parse any aspect ratio format into width/height dimensions
 */
export function getDimensions(aspect?: AspectRatio): {
  width: number;
  height: number;
} {
  // Default fallback
  if (!aspect) return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };

  // Handle numeric aspect ratio (preferred)
  if (typeof aspect === "number") {
    // Common ratios lookup for exact match
    const commonRatios: Record<number, { width: number; height: number }> = {
      [16 / 9]: { width: 1600, height: 900 },
      [4 / 3]: { width: 1600, height: 1200 },
      [1]: { width: 1200, height: 1200 },
      [9 / 16]: { width: 900, height: 1600 },
      [16 / 10]: { width: 1600, height: 1000 },
      [1728 / 1080]: { width: 1728, height: 1080 },
    };

    // Check for exact match with small tolerance
    const epsilon = 0.01;
    for (const [ratio, dimensions] of Object.entries(commonRatios)) {
      if (Math.abs(Number(ratio) - aspect) < epsilon) {
        return dimensions;
      }
    }

    // Generate dimensions from ratio
    return { width: DEFAULT_WIDTH, height: Math.round(DEFAULT_WIDTH / aspect) };
  }

  // Legacy string format support
  if (typeof aspect === "string") {
    if (aspect.includes("-")) {
      const [width, height] = aspect.split("-").map(Number);
      if (!isNaN(width) && !isNaN(height) && height > 0) {
        return { width, height };
      }
    }

    if (aspect.includes("/")) {
      const [width, height] = aspect.split("/").map(Number);
      if (!isNaN(width) && !isNaN(height) && height > 0) {
        return { width, height };
      }
    }
  }

  // Fallback for any failures
  return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
}

/**
 * Format aspect ratio for CSS
 */
export function formatAspectForCSS(aspect: AspectRatio): string {
  if (typeof aspect === "number") {
    return String(aspect);
  }

  if (typeof aspect === "string") {
    if (aspect.includes("-")) {
      return aspect.replace("-", "/");
    }
  }

  return String(aspect);
}

/**
 * Calculate dimensions based on aspect ratio and one dimension
 */
export function calculateMissingDimension(
  width: number | undefined,
  height: number | undefined,
  aspect: AspectRatio | undefined
): { width: number; height: number } {
  // Get base dimensions from aspect ratio
  const { width: aspectWidth, height: aspectHeight } = getDimensions(aspect);

  // Start with dimensions from aspect ratio
  let calculatedWidth = width || aspectWidth;
  let calculatedHeight = height || aspectHeight;

  // If one dimension is missing, calculate it from the other
  if (!width && height) {
    calculatedWidth = Math.round(Number(height) * (aspectWidth / aspectHeight));
  } else if (width && !height) {
    calculatedHeight = Math.round(Number(width) / (aspectWidth / aspectHeight));
  }

  // Final safety check to ensure we never return NaN
  if (isNaN(calculatedWidth) || calculatedWidth <= 0)
    calculatedWidth = DEFAULT_WIDTH;
  if (isNaN(calculatedHeight) || calculatedHeight <= 0)
    calculatedHeight = DEFAULT_HEIGHT;

  return { width: calculatedWidth, height: calculatedHeight };
}

export const isVideoFile = (url: string) => url.toLowerCase().endsWith(".mp4");
