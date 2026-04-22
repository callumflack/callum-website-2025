"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { textVariants } from "@/components/atoms";
import { cn } from "@/lib/utils";

// https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams

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

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    // using useRouter, but can also use Link — see above URL
    <button
      className={className}
      onClick={() => {
        // shape: <pathname>?sort=asc
        router.push(`${pathname}?${createQueryString("sort", sortBy)}`);
        onClick?.();
      }}
      type="button"
    >
      {children}
    </button>
  );
};

type StyledSortButtonProps = SortButtonProps & {
  searchParamsValue: string | undefined;
  initialSortBy: string;
  children: React.ReactNode;
};

export const sortButtonStyle = [
  "inline-flex h-tab items-center gap-2",
  textVariants({ intent: "meta", weight: "medium" }),
  "capitalize",
  "pl-2 pr-1 first:pl-0",
  "hover:text-fill",
  "border-y border-transparent",
];

export const StyledSortButton = ({
  sortBy,
  searchParamsValue,
  initialSortBy,
  onClick,
  children,
}: StyledSortButtonProps) => (
  <SortButton
    className={cn(
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
