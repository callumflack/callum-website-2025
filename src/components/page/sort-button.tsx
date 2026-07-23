import type { ComponentProps, ReactNode } from "react";
import { textVariants } from "@/components/atoms";
import { cn } from "@/lib/utils";

export const sortButtonStyle = [
  "inline-flex h-tab items-center gap-2",
  textVariants({ intent: "meta", weight: "medium" }),
  "capitalize tracking-[0.01em]",
  "pl-2 pr-1 first:pl-0",
  "hover:text-fill",
  "border-y border-transparent",
];

type ListModeButtonProps = ComponentProps<"button"> & {
  isActive?: boolean;
};

/** Presentational mode/tab control. Caller owns URL / selection state. */
export function ListModeButton({
  isActive = false,
  className,
  type = "button",
  children,
  ...props
}: ListModeButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        sortButtonStyle,
        isActive ? "border-b-fill! text-fill" : "text-solid",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type SortModeButtonProps = {
  sortBy: string;
  searchParamsValue: string | undefined;
  initialSortBy: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
};

/** Sort control with active state derived from sort params. */
export function SortModeButton({
  sortBy,
  searchParamsValue,
  initialSortBy,
  onClick,
  children,
  className,
}: SortModeButtonProps) {
  const isActive =
    (sortBy === initialSortBy && searchParamsValue === undefined) ||
    sortBy === searchParamsValue;

  return (
    <ListModeButton
      aria-pressed={isActive}
      className={className}
      isActive={isActive}
      onClick={onClick}
    >
      {children}
    </ListModeButton>
  );
}
