# 260210-homepage-featured-grid-toggle

## Goal

Add a homepage layout toggle (button) that switches between:

1. current homepage layout (intro + latest + selected work + selected writing)
2. a card-grid layout containing featured content across projects/writing/notes

In grid mode, the first card is the current intro content (avatar + intro text + links), as shown in the sketch.

## Constraints

- Keep current homepage as the default mode.
- Keep data fetching server-side.
- Keep implementation simple (button toggle for now, no final visual polish pass yet).
- Preserve existing homepage sections and links.
- Avoid introducing broad component churn outside homepage path.

## Existing patterns

- Route/data composition:
  - `src/app/page.tsx`
  - `src/lib/posts/featured-posts.ts`
  - `src/lib/posts/sorting.ts`
- Homepage layout:
  - `src/app/(home)/home-page.tsx`
  - `src/components/page/block-intro.tsx` (`Intro`)
- Existing post list/card UI:
  - `src/components/post/list/post-line.tsx`
  - `src/components/post/list/post-block.tsx`
- Content taxonomy:
  - `content-collections.ts` (`projects`, `writing`, `notes`, `page`)

## Proposed approach

### A) Toggle mechanism (low-friction, RSC-friendly)

Use URL search params instead of local client state:

- `/?layout=default` (or no param) -> existing layout
- `/?layout=grid` -> featured grid layout

Why:
- no client state required for first iteration
- keeps server component data flow clean
- shareable URL state

### B) Data model for grid mode

In `src/app/page.tsx`:

1. Add featured notes source:
   - create `featuredNotesSlugs` in `src/lib/posts/featured-posts.ts`
   - add `getFeaturedNotes()` in `src/app/page.tsx`
2. Build a single ordered list for grid cards:
   - intro card (virtual card, not from post collection)
   - featured projects
   - featured writing
   - featured notes
3. Pass to `HomePage`:
   - existing props (`latestPosts`, `projects`, `writing`)
   - new props for grid data and selected layout mode from search params

### C) Rendering architecture

In `src/app/(home)/home-page.tsx`:

1. Add a small layout switch button near the intro area.
2. Render branch:
   - default mode: unchanged existing homepage sections
   - grid mode: new grid container that renders:
     - intro card first
     - post cards for featured items
3. Keep `PageWrapper` and footer behavior unchanged.

### D) New UI pieces

Create minimal homepage-scoped components in `src/app/(home)/`:

- `home-layout-toggle.tsx` (button/link UI)
- `home-featured-grid.tsx` (grid renderer)
- `home-intro-card.tsx` (wraps current intro content as first card)

Note: keep these scoped to homepage to avoid premature design-system abstraction.

### E) Card rendering choice

Use `PostBlock` for post cards in grid mode for V1 to avoid inventing a new card pattern.
If needed, add a lightweight wrapper for grid-specific spacing only.

### File touch list (planned)

- `src/app/page.tsx`
- `src/app/(home)/home-page.tsx`
- `src/lib/posts/featured-posts.ts`
- `src/app/(home)/home-layout-toggle.tsx` (new)
- `src/app/(home)/home-featured-grid.tsx` (new)
- `src/app/(home)/home-intro-card.tsx` (new)

## Edge cases

- No featured notes configured:
  - grid renders intro + available featured projects/writing only.
- Invalid `layout` query value:
  - fallback to default layout.
- Featured slug not found in posts:
  - silently skip missing entries (same behavior as current slug filtering pattern).
- Intro card in grid needs to remain readable at small widths:
  - enforce single-column at narrow breakpoints, then multi-column.
- Duplicate posts across featured lists:
  - de-duplicate by `slug` when building unified grid list.

## Validation checklist

- [ ] `bun run check:all`
- [ ] Manual: default homepage still renders exactly as before
- [ ] Manual: toggle to grid mode works and URL reflects mode
- [ ] Manual: intro card is first in grid
- [ ] Manual: grid contains featured project/writing/note cards only
- [ ] Manual: invalid query param falls back to default
- [ ] Manual: responsive layout is usable at mobile + desktop widths

## Out of scope

- Final visual redesign/polish of all card styles.
- Animations/transitions between layouts.
- Persisting layout preference beyond URL (cookies/local storage).
- Reworking non-home pages (`/work`, `/writing`, `/log`).

## Open questions to resolve before implementation

1. Should grid mode include section labels ("Projects/Writing/Notes"), or a single mixed grid?
2. Should the intro card include contacts row in full, or a shorter intro variant for density?
3. Should we cap grid card count for initial launch (for example: 1 intro + 9 featured)?
