import { cn } from "@/lib/utils";

export function MetadataSeparator({ className }: { className?: string }) {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      data-slot="metadata-separator"
      className={cn(
        "hr-vertical border-border-hover inline-block h-[12px]",
        className
      )}
    />
  );
}
