import Link from "next/link";
import { textVariants } from "@/components/atoms/text";
import { ListHeader } from "@/components/page/list-header";
import { cn } from "@/lib/utils";
import {
  getWritingModeHref,
  WRITING_MODES,
  type WritingMode,
  type WritingSearchParams,
} from "./writing-mode";

const writingTabStyle = [
  "inline-flex h-tab items-center",
  textVariants({ intent: "meta", weight: "medium" }),
  "border-y border-transparent px-1.75 first:pl-0",
  "tracking-[0.015em] hover:text-fill",
];

export function WritingTabs({
  activeMode,
  searchParams = {},
}: {
  activeMode?: WritingMode;
  searchParams?: WritingSearchParams;
}) {
  return (
    <ListHeader ariaLabel="Writing views" showContained>
      {WRITING_MODES.map((mode) => {
        const isActive = mode.value === activeMode;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              writingTabStyle,
              isActive ? "border-b-fill! text-fill" : "text-solid"
            )}
            href={getWritingModeHref(searchParams, mode.value)}
            key={mode.value}
            scroll={false}
          >
            {mode.label}
          </Link>
        );
      })}
    </ListHeader>
  );
}
