"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { textVariants } from "@/components/atoms";
import { cx } from "cva";

interface SortButtonProps {
  sortBy: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const SortButton = ({
  sortBy,
  className,
  children,
  onClick,
}: SortButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        router.push(`${pathname}?${createQueryString("sort", sortBy)}`, {
          scroll: false,
        });
        onClick?.();
      }}
    >
      {children}
    </button>
  );
};

export const sortButtonStyle = [
  "inline-flex h-tab items-center gap-2",
  textVariants({ intent: "meta", weight: "medium" }),
  "capitalize tracking-[0.015em]",
  "pl-2 pr-1 first:pl-0",
  "hover:text-fill hover:cursor-pointer",
  "border-y border-transparent",
];

interface StyledSortButtonProps extends SortButtonProps {
  searchParamsValue: string | undefined;
  initialSortBy: string;
}

export const StyledSortButton = ({
  sortBy,
  searchParamsValue,
  initialSortBy,
  onClick,
  children,
}: StyledSortButtonProps) => (
  <SortButton
    className={cx(
      sortButtonStyle,
      (sortBy === initialSortBy && searchParamsValue === undefined) ||
        sortBy === searchParamsValue
        ? "!border-b-fill text-fill"
        : "text-solid"
    )}
    onClick={onClick}
    sortBy={sortBy}
  >
    {children}
  </SortButton>
);
