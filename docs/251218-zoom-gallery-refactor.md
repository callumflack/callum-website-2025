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
- Should Escape key close zoom?
- What about reduced-motion preferences?
- Should focus be trapped when zoomed?

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
