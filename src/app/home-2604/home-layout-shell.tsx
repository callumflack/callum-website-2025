"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { HomeLayoutToggle } from "./home-layout-toggle";

/**
 * Client shell that owns the "which layout" state for the home page.
 *
 * Both slots are rendered simultaneously as siblings; the inactive one is
 * hidden via the `hidden` class (display: none) + `inert` so it's inert to
 * user interaction and assistive tech. This means:
 *
 *   - Toggling is a CSS flip — no React unmount/remount, no effect teardown,
 *     no Framer-Motion reinitialisation. Instant.
 *   - `?layout=grid` deep-links still work: we read it on mount.
 *   - URL stays in sync via router.replace (not push), so toggling doesn't
 *     pollute the back-button history.
 */
export function HomeLayoutShell({
  defaultSlot,
  gridSlot,
}: {
  defaultSlot: React.ReactNode;
  gridSlot: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isGrid = searchParams.get("layout") === "grid";

  const setIsGrid = useCallback(
    (next: boolean) => {
      const url = next ? `${pathname}?layout=grid` : pathname;
      router.replace(url, { scroll: false });
    },
    [pathname, router]
  );

  return (
    <>
      <HomeLayoutToggle isGrid={isGrid} onToggle={setIsGrid} />
      <div className={isGrid ? "hidden" : ""} inert={isGrid}>
        {defaultSlot}
      </div>
      <div className={isGrid ? "" : "hidden"} inert={!isGrid}>
        {gridSlot}
      </div>
    </>
  );
}
