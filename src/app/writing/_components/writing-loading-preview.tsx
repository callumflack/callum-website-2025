"use client";

import { useState, type ReactNode } from "react";
import { focusVisibleOutlineStyle } from "@/components/atoms";
import { cn } from "@/lib/utils";

// Development-only control for designing the Suspense fallback.
export function WritingLoadingPreview({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const [showLoading, setShowLoading] = useState(false);

  return (
    <div data-slot="writing-loading-preview">
      {showLoading ? fallback : children}
      <button
        aria-pressed={showLoading}
        className={cn(
          "bg-fill text-canvas text-meta rounded-button fixed right-4 bottom-4 z-50 px-4 py-2",
          focusVisibleOutlineStyle
        )}
        onClick={() => setShowLoading((current) => !current)}
        type="button"
      >
        {showLoading ? "Show content" : "Show loading"}
      </button>
    </div>
  );
}
