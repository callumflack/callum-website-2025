"use client";

import { BodyClassProvider } from "@/components/utils/body-class-provider";
import { PageInner } from "@/components/page/page-inner";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface HomeFolioClientProps {
  children: React.ReactNode;
}

export function HomeFolioClient({ children }: HomeFolioClientProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <BodyClassProvider
      condition={isZoomed}
      className={cn(
        "bg-canvas"
        // UNDECIDED! I kinda like it just plain today…
        // "overflow-hidden",
        // "bg-background-hover",
        // "[&_[data-component=Nav]]:bg-background-hover",
        // "[&_[data-component=Nav]_a]:opacity-[0.0]",
        // "[&_[data-component=Nav]_span]:opacity-[0.0]",
        // "[&_[data-component=PageInner]:not(.Folio)]:opacity-[0.0]",
        // "[&_[data-component=TitleHeader]]:opacity-[0.0]",
        // "[&_[data-component=RuleWithinInner]]:opacity-[0.0]"
      )}
    >
      {/* Close overlay for the EnhancedZoomable */}
      {/* {isZoomed && (
        <div
          className="absolute inset-0 z-99 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        ></div>
      )} */}
      <PageInner
        variant="home"
        className={cn(
          "relative",
          isZoomed ? "Folio z-100 cursor-zoom-out" : ""
        )}
        onClick={() => setIsZoomed((prev) => !prev)}
      >
        {children}
      </PageInner>
    </BodyClassProvider>
  );
}
