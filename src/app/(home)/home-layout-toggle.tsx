import { Link, textVariants } from "@/components/atoms";
import { cn } from "@/lib/utils";

interface HomeLayoutToggleProps {
  layout: "default" | "grid";
}

const linkStyle = [
  "h-tab flex items-center gap-0 relative hover:text-accent",
  "before:absolute before:left-[-2px] before:right-[-2px] before:bottom-[-1px] before:border-b",
];

export function HomeLayoutToggle({ layout }: HomeLayoutToggleProps) {
  const isGridMode = layout === "grid";
  const href = isGridMode ? "/" : "/?layout=grid";
  const label = isGridMode ? "Show default" : "Show grid";

  return (
    <div className="fixed top-2.5 right-3 z-300 sm:top-3 sm:right-4">
      <Link
        href={href}
        className={cn(
          textVariants({ intent: "meta", weight: "medium" }),
          linkStyle,
          "before:border-fill hover:before:border-accent"
        )}
      >
        {label}
      </Link>
    </div>
  );
}
