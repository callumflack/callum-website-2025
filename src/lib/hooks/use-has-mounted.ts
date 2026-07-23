"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function useHasMounted() {
  // Server snapshot is false, client snapshot is true — React swaps to the
  // client value right after hydration without a setState-in-effect cascade.
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
