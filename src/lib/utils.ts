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
