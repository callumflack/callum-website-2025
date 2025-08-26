import { format, parseISO } from "date-fns";

// cn with custom tailwind merge recipe
export { cn } from "./classes";

export const formatYear = (dateString: string) =>
  format(parseISO(dateString), "yyyy");

export const formatPostDate = (dateString: string): string => {
  return format(parseISO(dateString), "MMM d, yyyy");
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
