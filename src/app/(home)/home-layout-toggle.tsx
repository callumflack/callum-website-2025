import { DashboardIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { buttonVariants, Link } from "@/components/atoms";
import { cn } from "@/lib/utils";

interface HomeLayoutToggleProps {
  layout: "default" | "grid";
}

const activeStyle = "bg-background-hover text-fill";

export function HomeLayoutToggle({ layout }: HomeLayoutToggleProps) {
  const isGridMode = layout === "grid";

  return (
    <div
      className={cn(
        "fixed z-300 flex items-center gap-[2px]",
        "top-[calc(var(--spacing-nav)-var(--spacing-tab))]",
        "right-[calc(var(--spacing-nav)-var(--spacing-tab))]"
      )}
    >
      <Link
        href="/"
        aria-label="Show default layout"
        className={cn(
          buttonVariants({ variant: "icon", size: "default" }),
          !isGridMode && activeStyle
        )}
      >
        <ListBulletIcon />
      </Link>
      <Link
        href="/?layout=grid"
        aria-label="Show grid layout"
        className={cn(
          buttonVariants({ variant: "icon", size: "default" }),
          isGridMode && activeStyle
        )}
      >
        <DashboardIcon />
      </Link>
    </div>
  );
}
