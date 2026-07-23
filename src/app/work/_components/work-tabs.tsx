import Link from "next/link";
import { textVariants } from "@/components/atoms/text";
import { LinkWithArrow } from "@/components/elements";
import { ListHeader } from "@/components/page/list-header";
import { sortButtonStyle } from "@/components/post";
import { cn } from "@/lib/utils";
import {
  getWorkModeHref,
  WORK_MODES,
  type WorkMode,
  type WorkSearchParams,
} from "./work-mode";

const workTabStyle = [
  "inline-flex h-tab items-center",
  textVariants({ intent: "meta", weight: "medium" }),
  "border-y border-transparent px-1.75 first:pl-0",
  "tracking-[0.015em] hover:text-fill",
];

export function WorkTabs({
  activeMode,
  searchParams = {},
}: {
  activeMode?: WorkMode;
  searchParams?: WorkSearchParams;
}) {
  return (
    <ListHeader
      ariaLabel="Work views"
      rhsNode={
        <LinkWithArrow
          className={cn(sortButtonStyle, "text-solid gap-1! pr-0")}
          href="/gallery"
        >
          Gallery
        </LinkWithArrow>
      }
      showContained
    >
      {WORK_MODES.map((mode) => {
        const isActive = mode.value === activeMode;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              workTabStyle,
              isActive ? "border-b-fill! text-fill" : "text-solid"
            )}
            href={getWorkModeHref(searchParams, mode.value)}
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
