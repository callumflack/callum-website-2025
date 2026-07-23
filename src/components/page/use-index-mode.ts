"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

type IndexModeOptions<T extends string> = {
  allowedValues: readonly T[];
  fallback: T;
  param: string;
};

/**
 * Keeps one index control mode in the URL without claiming the rest of the
 * query string. The active value is always one of `allowedValues`.
 */
export function useIndexMode<T extends string>({
  allowedValues,
  fallback,
  param,
}: IndexModeOptions<T>) {
  const searchParams = useSearchParams();
  const rawValue = searchParams.get(param);
  const mode = allowedValues.includes(rawValue as T)
    ? (rawValue as T)
    : fallback;

  const setMode = useCallback(
    (nextMode: T) => {
      if (!allowedValues.includes(nextMode) || nextMode === mode) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set(param, nextMode);

      window.history.pushState(null, "", `?${params.toString()}`);
    },
    [allowedValues, mode, param, searchParams]
  );

  return { mode, setMode };
}
