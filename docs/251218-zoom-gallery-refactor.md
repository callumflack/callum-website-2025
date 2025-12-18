# Zoom + Gallery Interactive Islands Refactor

Handoff doc for Stage 2 of the maintenance tax reduction work.

See `docs/251218-repo-assessment-scope.md` for full context.

---

## Job to be done

Make images/videos zoomable on click (desktop only). When zoomed:

- Content scales up
- Page scrolls to center the zoomed content in viewport
- Click again to unzoom

Gallery page has a secondary behavior: clicking a thumbnail expands it inline within the grid.

---

## The files

### Active (in use)

| File                                                    | What it does                                                        | Used by                               |
| ------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------- |
| `src/components/media/zoomable-02.tsx`                  | Simple inline zoom with scroll-centering                            | MDX images/videos via `mdx-media.tsx` |
| `src/app/gallery/(components)/gallery-posts-append.tsx` | Gallery grid with Framer Motion layout expansion + scroll-centering | Gallery page                          |
| `src/app/(home)/zoom-carousel.tsx`                      | Home page carousel with custom Framer Motion expand/collapse        | Home page                             |

### Legacy / iterations (not imported anywhere)

| File                                            | Notes                                                                                                                                                                |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/media/zoomable.tsx`             | Exported from `index.ts` but nothing actually imports it. Has setTimeout timing hack. Different design (width-based vs transform-based).                             |
| `src/components/media/zoomable-enhanced.tsx`    | Complex version with IntersectionObserver, ResizeObserver, controlled/uncontrolled modes. Referenced in commented-out code in `home-page.tsx` but not actually used. |
| `src/components/media/zoomable-enhanced-00.tsx` | Earlier/simpler iteration of enhanced zoomable. No imports.                                                                                                          |

**Note**: The user keeps legacy files intentionally as design references. Don't delete without confirming.

---

## The problems

### 1. Multiple implementations doing similar things

There are **4 different zoomable components** plus the gallery's own expansion logic. This creates:

- Confusion about which to use
- Duplicated measurement/scroll logic
- No single source of truth for zoom behavior

### 2. Effect choreography is fragile

`zoomable-02.tsx` (MDX images/videos):

- Measures content dimensions in `useEffect` on mount
- Re-measures on viewport resize
- Calculates scroll position in another `useEffect` when zoomed
- Uses `requestAnimationFrame` to wait for layout

`gallery-posts-append.tsx` (gallery page):

- Framer Motion `LayoutGroup` for shared layout animations
- `requestAnimationFrame` + `setTimeout(180ms)` fallback for scroll centering
- ResizeObserver watching expanded element
- Complex row-based expansion logic

`zoom-carousel.tsx` (home page):

- Custom Framer Motion `animate()` calls
- Reads computed styles (gap, padding) in effects
- Tracks `isExpanded`, `clickedIndex`, viewport width
- Multiple effects for resize handling

### 3. Stored state that could be derived

- `originalWidth`, `contentHeight`, `aspectRatio` stored in state and updated via effects
- Some of this could be computed from refs or derived from props

### 4. No clear UX spec

Questions that don't have documented answers:

- What exactly should the zoom scale be?
- Should zoomed content be centered vertically, or offset?
- What happens on mobile? (Currently disabled, but is that the right call?)

**Note (scope)**: For the minimal-scope refactor, we are **not** taking on keyboard/focus/ARIA work (no Escape-to-close, no focus trapping). This is intentional to keep the maintenance-tax reduction work small and low-risk.

---

## Corrections (doc hygiene)

- `src/components/media/zoomable.tsx` is **not** exported from `src/components/media/index.ts`.
  - `index.ts` explicitly treats `./zoomable` as legacy and notes `zoomable-02.tsx` is the active implementation.

---

## Known correctness issues worth fixing even if we don't refactor (receipts)

These are small, isolated fixes with good ROI:

- Gallery expansion (`src/app/gallery/(components)/gallery-posts-append.tsx`)
  - A `setTimeout(center, 180)` is scheduled inside an rAF callback, but the `clearTimeout` cleanup is not wired to the React effect cleanup, so it can fire after unmount / rapid state changes.
- Home carousel (`src/app/(home)/zoom-carousel.tsx`)
  - `framer-motion` `animate(...)` controls are not captured/cancelled, so quick expand/collapse can overlap animations.
- MDX zoom (`src/components/media/zoomable-02.tsx`)
  - Measurement state is coupled to viewport resize; it doesn't reliably re-measure when media loads or content size changes without a resize.

---

## Center-in-viewport strategy (decision we should lock)

**Goal**: one shared centering primitive used by MDX zoom + gallery expansion + carousel, so all timing/measurement bugs converge to one place.

**Contract**: `centerInViewport(element)` computes target scroll based on the element's `getBoundingClientRect()`:

- Target: element’s vertical center aligned to viewport’s vertical center.
- Clamp: don’t scroll past document bounds.
- Threshold: if the delta is tiny (e.g. < 1px), do nothing.
- Timing: call after the UI state toggles (zoom/expand). If layout is animating, call on animation completion. If content size can change (image/video load), re-center via a `ResizeObserver` on the active element (throttled by rAF).

**Non-goals (minimal scope)**:

- No keyboard/focus behavior.
- No “perfect across every browser edge case” behavior beyond what we already need for the site.

---

## Suggested approach

### Step 1: Document the UX requirements

Before refactoring, decide:

- [ ] Exact zoom behavior (scale amount, centering, mobile)
- [ ] Keyboard/accessibility requirements
- [ ] Whether gallery expansion is worth keeping or can be simplified

### Step 2: Consolidate or clearly separate

Options:

- **Consolidate**: Pick `zoomable-02.tsx` as the base, extract scroll-centering into shared utility
- **Keep separate**: MDX zoom, gallery expansion, and home carousel may have different enough UX goals to warrant separate implementations—but then delete the unused legacy files

### Step 3: Reduce effect choreography

Target patterns:

- Derive dimensions from refs where possible instead of storing in state
- Use CSS for what CSS can do (aspect-ratio, transforms)
- If timing hacks are needed, document why with comments

### Step 4: Isolate the gallery expansion

If gallery expansion stays:

- Keep it self-contained in the gallery folder
- Don't share implementation with MDX zoomable (different UX goals)
- Consider whether Framer Motion layout animations are worth the complexity

---

## Decision needed

**Is zoom/expansion a "signature interaction" worth this complexity?**

Options:

1. **Keep and polish** — it's a portfolio site, the interaction is intentional
2. **Simplify** — just use CSS scale transform, accept imperfect centering
3. **Remove** — link to full-size image instead, no zoom at all

The answer affects how much effort to invest here.

---

## Addendum: Why a pure function, not a hook

The refactor extracted `centerInViewport(element, options)` as a **pure function**, not a `useCenterInViewport()` hook. This was intentional.

### The timing problem

Each consumer has different timing needs:

| Consumer                             | When to call `centerInViewport`                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| MDX zoom (`zoomable-02.tsx`)         | Double-rAF after `isZoomed` state change                                        |
| Gallery (`gallery-posts-append.tsx`) | rAF chain + setTimeout fallback (Framer layout animations settle unpredictably) |
| Home carousel (`zoom-carousel.tsx`)  | Framer's `onAnimationComplete` callback                                         |

A hook that tried to manage timing internally would have to either:

1. **Be too opinionated** — force all consumers into one timing strategy (breaks gallery/carousel)
2. **Be too leaky** — expose timing config that recreates the complexity we're trying to hide

### The right boundary

By keeping `centerInViewport` as a pure function that only does scroll math:

- Consumers call it at the right moment for their use case
- Cleanup logic (cancelling rAFs, stopping animations) stays with the consumer who owns that lifecycle
- The scroll math converges to one place; timing stays distributed where it belongs

**Principle**: Extract the _what_ (scroll math), not the _when_ (timing). Let each consumer own their own effect choreography.
