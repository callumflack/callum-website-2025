"use client";

import { DashboardIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/atoms";
import { cn } from "@/lib/utils";

const activeStyle = "bg-background-hover text-fill";

interface HomeLayoutToggleProps {
  isGrid: boolean;
  onToggle: (isGrid: boolean) => void;
}

export function HomeLayoutToggle({ isGrid, onToggle }: HomeLayoutToggleProps) {
  return (
    <div
      className={cn(
        "fixed z-300 flex items-center gap-[2px]",
        "top-[calc(var(--spacing-nav)-var(--spacing-tab))]",
        "right-[calc(var(--spacing-nav)-var(--spacing-tab))]"
      )}
    >
      <Button
        variant="icon"
        size="default"
        aria-label="Show default layout"
        aria-pressed={!isGrid}
        onClick={() => onToggle(false)}
        className={!isGrid ? activeStyle : ""}
      >
        <ListBulletIcon />
      </Button>
      <Button
        variant="icon"
        size="default"
        aria-label="Show grid layout"
        aria-pressed={isGrid}
        onClick={() => onToggle(true)}
        className={isGrid ? activeStyle : ""}
      >
        <DashboardIcon />
      </Button>
    </div>
  );
}
