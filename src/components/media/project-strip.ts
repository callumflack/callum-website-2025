import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/components/media/media-utils";
import { cn } from "@/lib/utils";

/** Home zoom-open image height. Work Reel is locked to this size. */
export const CAROUSEL_IMAGE_EXPANDED_HEIGHT = 480;

/** Uniform Reel card width: zoom height at the site default landscape (1600/1000). */
export const CAROUSEL_CARD_WIDTH =
  CAROUSEL_IMAGE_EXPANDED_HEIGHT * (DEFAULT_WIDTH / DEFAULT_HEIGHT);

export type ProjectStripSnap = "start" | "center";
export type ProjectStripItemSnap = ProjectStripSnap | "none" | "end";

/** Extra last-item snap-area so snap-end hits inset-text, not (vw - card) / 2. */
const projectStripEndScrollMarginClassName =
  "scroll-mr-[max(0px,calc(var(--spacing-inset-text)-max(var(--spacing-inset),calc((100vw-var(--carousel-card-width))/2))))]";

const projectStripTrackBaseClassName = cn(
  "relative z-2 w-full",
  "overflow-x-scroll will-change-scroll hide-scrollbar",
  "snap-x scroll-smooth",
  "grid grid-flow-col grid-cols-[max-content] grid-rows-1",
  "gap-inset"
);

/** Home / zoom: snap-start to the text column. */
export const projectStripTrackClassName = cn(
  projectStripTrackBaseClassName,
  "snap-mandatory",
  "px-inset scroll-px-inset",
  "min-[620px]:max-lg:scroll-px-inset-text min-[620px]:max-lg:px-inset-text",
  "lg:scroll-px-[calc(var(--spacing-inset-text)-var(--spacing-major))] lg:px-[calc(var(--spacing-inset-text)-var(--spacing-major))]"
);

/**
 * Reel: pad is the text column so scroll 0 is first-card LHS and max scroll is
 * last-card RHS. scroll-padding stays (100vw - card) / 2 so the snapport is
 * as wide as the card (otherwise extra start/end snaps beat center). First
 * item is snap-none, last is snap-end + scroll-margin to reach inset-text,
 * rest snap-center. Proximity so load doesn't hunt to card 2.
 */
export const projectStripCenterTrackClassName = cn(
  projectStripTrackBaseClassName,
  "snap-proximity",
  "px-inset min-[620px]:px-inset-text",
  "scroll-px-[max(var(--spacing-inset),calc((100vw-var(--carousel-card-width))/2))]"
);

export const projectStripOverlayClassName =
  "focus-visible:outline-fill absolute inset-x-0 top-0 z-1 border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid";

const projectStripItemBaseClassName =
  "relative flex shrink-0 flex-col gap-2.5 overflow-hidden";

export function projectStripItemClassName(snap: ProjectStripItemSnap) {
  switch (snap) {
    case "center":
      return cn(projectStripItemBaseClassName, "snap-center");
    case "none":
      return cn(projectStripItemBaseClassName, "snap-none");
    case "start":
      return cn(projectStripItemBaseClassName, "snap-start");
    case "end":
      return cn(
        projectStripItemBaseClassName,
        "snap-end",
        projectStripEndScrollMarginClassName
      );
    default: {
      const _exhaustive: never = snap;
      return _exhaustive;
    }
  }
}
