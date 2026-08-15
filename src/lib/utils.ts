import { format, parseISO } from "date-fns";

// cn with custom tailwind merge recipe
export { cn } from "./classes";

export const formatYear = (dateString: string) =>
  format(parseISO(dateString), "yyyy");

type PostYearFields = {
  date: string;
  dateLabel?: string;
  endDate?: string;
};

/** Year span for project cards: explicit labels override derived closed-project spans. */
export function formatPostYearSpan(post: PostYearFields): string {
  if (post.dateLabel) {
    return post.dateLabel;
  }
  if (post.endDate) {
    return `${formatYear(post.date)}–${formatYear(post.endDate)}`;
  }
  return formatYear(post.date);
}

export const formatPostDate = (dateString: string): string => {
  return format(parseISO(dateString), "MMM d, yyyy");
};

export const formatPostMonthYear = (dateString: string): string => {
  return format(parseISO(dateString), "MMMM yyyy");
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
