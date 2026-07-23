"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <TooltipProvider delayDuration={750}>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
