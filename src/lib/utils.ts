import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getYear = (dateString: string) =>
  format(parseISO(dateString), "yyyy");

export const formatPostDate = (dateString: string): string => {
  return format(parseISO(dateString), "MMMM d, yyyy");
};

export const isVideoFile = (url: string) => url.toLowerCase().endsWith(".mp4");

export const splitAspect = (
  aspect: number | undefined
): { width: number; height: number } => {
  // Default fallback values if no aspect is provided
  if (!aspect) return { width: 1600, height: 1000 };

  // For common aspect ratios, use predefined dimensions
  const commonRatios: Record<number, { width: number; height: number }> = {
    [16 / 9]: { width: 1600, height: 900 },
    [4 / 3]: { width: 1600, height: 1200 },
    [1]: { width: 1200, height: 1200 },
    [9 / 16]: { width: 900, height: 1600 },
    [1728 / 1080]: { width: 1728, height: 1080 },
  };

  // Check if it's close to a common ratio with small tolerance
  const epsilon = 0.01;
  for (const [ratio, dimensions] of Object.entries(commonRatios)) {
    if (Math.abs(Number(ratio) - aspect) < epsilon) {
      return dimensions;
    }
  }

  // If not a common ratio, generate dimensions based on standard width
  const width = 1600;
  const height = Math.round(width / aspect);
  return { width, height };
};

export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      // Replace & with 'and'
      .replace(/&/g, "and")
      // Replace spaces and commas with hyphens
      .replace(/[\s,]+/g, "-")
      // Remove all non-word characters except hyphens
      .replace(/[^\w-]+/g, "")
      // Replace multiple hyphens with a single hyphen
      .replace(/--+/g, "-")
  );
}
