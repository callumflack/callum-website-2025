# Repo assessment + scope (Callum website 2025)

Goal: keep what works, but reduce “maintenance tax” so publishing + iterating is easier (less code surface, fewer implicit behaviors, fewer fragile styling/content conventions).

This doc is intentionally practical: problems → why they matter → concrete examples → scope ideas.

---

## High-signal findings (current state)

- **Client surface area is high**

  - We currently have ~**41 `"use client"` files** in `src/`.
  - This isn’t “broken”, but it increases hydration + bundles + “why is this client?” cognitive overhead.

- **Derived UI state is often stored as state**

  - Patterns like `useState` + `useEffect` to keep state in sync with an already-known derived value.
  - Typical costs: extra renders, subtle desync (especially with URL state), more imperative timing logic.

- **Measure / observe / scroll interactivity is heavy**

  - Zoom + gallery expansion includes layout measurement, scroll-centering, observers, and timing fallbacks.
  - It works, but this class of UI tends to be the biggest long-term refactor sink.

- **MDX ergonomics are a known friction point**

  - There’s an ongoing investigation here, and the repo already contains signs of authoring friction (e.g. custom image/video needs, “img doesn’t work” comment).

- **`cn` merge strategy is now correct**
  - Earlier claim (“`cn` removes `text-*` so use `cx`”) was **outdated** given the current `customTwMerge` configuration.
  - Confirmed by running Bun eval with real code:
    - `cn("text-body","text-fill")` → keeps both
    - `cn("text-body","text-meta")` → last text-size wins
    - `cn("text-fill","text-solid")` → last text-color wins
  - So: **we should use `cn`** as the default merge/composition utility.

---

## Concrete examples (file-level “receipts”)

### Accidental client components

**Symptom**: `"use client"` on components that do not use hooks, browser APIs, or client-only features.

- `src/components/post/list/post-line.tsx`
  - Declared `"use client"`, but is pure render.
  - This creates hydration/bundle cost for something that is rendered everywhere.

### Derived state stored + synced via effects

- `src/components/page/nav.tsx`

  - `isScrolled` is derived from scroll position but stored in state and updated in an effect.
  - Cost: extra renders + effect-driven UI flow.

- `src/components/page/posts-index-or-full.tsx`
  - `showInFull` is derived from `useSearchParams()`, but mirrored into local state.
  - Risk: URL state + UI state drift (back/forward; external navigation; programmatic navigation).

### Timing hacks / multi-effect choreography

- `src/app/gallery/(components)/gallery-posts-append.tsx`

  - Complex client “island” (Framer Motion layout + expansion) with scroll-centering that uses `requestAnimationFrame` plus a `setTimeout` fallback.
  - Works, but hard to maintain.

- `src/components/media/zoomable-02.tsx`

  - Multiple pieces of state derived from measurement + effects to center content on zoom.

- `src/components/media/zoomable-enhanced.tsx`
  - Uses IntersectionObserver + ResizeObserver + requestAnimationFrame and multiple effects to keep wrapper height and scroll centering consistent.

### MDX authoring friction / conventions

- `src/components/mdx/mdx-components.tsx`

  - `img` override is commented as “doesn’t work” → indicates default MDX image syntax isn’t flowing smoothly.
  - Heading IDs are generated via `children?.toString()` → fragile for non-string headings and can produce collisions.

- `src/components/mdx/mdx-media.tsx`
  - Media wants structured props (e.g. `aspect`) and supports alt-based caption syntax like `[caption: ...]`.
  - That can be great, but also introduces authoring ceremony and hidden conventions.

### A real correctness bug worth tracking

- `src/components/page/site-time.tsx`
  - `zonedDate` is computed once and then written to state on an interval, so it will not tick forward as intended.

### Content pipeline coupling / validation

- `content-collections.ts`
  - Uses `git log -1` during transform to compute last modified (cached, but still a build-time coupling).
  - `assets.aspect` is `z.string()` (no validation) even though downstream assumes specific formats.
  - Transform mutates `post.assets` adding computed fields that aren't explicitly reflected in the schema.

### Asset.dimensions naming mismatch

- `getImageDimensions()` in `src/components/media/media-utils.ts` returns `{ width, height, aspectRatioNumber }`
- `content-collections.ts` stores `dimensions: { width, height, aspectRatioNumber }`
- but `src/types/content.ts` defines `dimensions.aspectRatio` (not `aspectRatioNumber`)

This mismatch makes the types lie and quietly increases maintenance tax.

---

## What we’d change first (low-risk, high ROI)

These are “cheap wins” with good payoff and minimal behavior change.

- **Remove accidental `"use client"`**

  - Start with leaf components that render everywhere (post lines, list items, stateless renderers).
  - Goal: reduce hydration surface, simplify mental model (“client only where necessary”).

- **Stop mirroring URL state into component state**

  - Treat search params as the source of truth, derive view state directly.
  - Prefer `router.replace()` for toggles when you don’t want history spam.

- **Delete derived-state effects**

  - If state can be computed from props/hook outputs, compute it inline.
  - Goal: fewer effects, fewer internal state machines.

- **Fix correctness paper-cuts that cause distrust**

  - Example: `SiteTime` ticking bug.

- **Codify `cn` as the standard**
  - It’s now safe for text size + text color semantics with this repo’s `customTwMerge`.

---

## Additional scope we should document (beyond the quick wins)

### 1) “Client islands” policy + boundaries

Define a repo-level rule of thumb:

- Default to **RSC** (server components)
- Add `"use client"` only for:
  - browser APIs
  - animations/interactions requiring client runtime
  - Radix/shadcn components that require client behavior

And: isolate those parts into small “islands” instead of making whole pages client.

### 2) Interactivity that measures/scrolls (Zoom + Gallery)

This probably needs its own decision doc:

- What are the explicit UX requirements?
  - zoom behavior on desktop
  - behavior on mobile (disabled vs alternate)
  - scroll-centering requirements
  - accessibility (keyboard, focus, reduced motion)
- What is acceptable complexity?
  - Is this a “signature interaction” worth complexity, or can it be simplified?
- Target refactor shape:
  - reduce the number of interdependent effects
  - minimize measurement state (derive, don’t store, where possible)
  - aggressively isolate the code and provide stable APIs to call sites

### 3) MDX ergonomics (publishing)

This is the publishing “product”. Treat it that way:

- Decide what authoring should look like for:
  - images
  - video
  - captions
  - galleries
  - callouts/notes
  - heading anchors
- Minimize “hidden conventions”
  - If `[caption: ...]` stays, document it in `/posts/_TEMPLATE.mdx` or a `docs/mdx-authoring.md`.
- Decide whether we want:
  - strict schema-first authoring (structured components)
  - or permissive authoring (vanilla markdown with smart transforms)

### 4) Styling composition rules (tailwind-merge + readability)

We should align the repo on:

- `cn` is the default for Tailwind composition (it is merge-aware and respects our semantic tokens).
- Sorting/grouping classes is a **style choice**, not a correctness rule.
  - If we want consistent readability, enforce via formatter/lint or a very small guideline.

### 5) Content pipeline / metadata correctness

Things to consider (without necessarily changing right away):

- do we want `git`-derived metadata in builds (and on CI)?
- do we validate `aspect` formats and asset shapes in schema so content errors fail early?
- do we want computed fields explicitly reflected in schema/types?

---

## Cursor rule cleanup (needs correction)

- `.cursor/rules/tailwind-shadcn-adaptation.mdc`
  - References `packages/ui/src/...` paths that are monorepo residue and don't exist in this repo.
  - The rule itself is valuable—just needs path references made agnostic.

Proposed: update `tailwind-shadcn-adaptation.mdc` to use relative/agnostic paths.

---

## Proposed rollout shape (staged)

This is a suggestion for how to scope the work into “safe increments”.

- **Stage 0 (docs + rules)**

  - Clarify `cn` policy and fix Cursor rules that contradict it.
  - Document MDX authoring contract (even if we keep current behavior).

- **Stage 1 (cheap wins)**

  - Remove accidental `"use client"` in leaf render components.
  - Remove derived-state effects (computed UI state).
  - Fix small correctness bugs (e.g. `SiteTime`).

- **Stage 2 (interactive islands)**

  - Revisit zoom/gallery behaviors with explicit UX specs.
  - Reduce effect choreography + timing hacks.

- **Stage 3 (publishing UX)**
  - Make MDX authoring ergonomic and consistent.
  - Validate content schema so content mistakes fail early and clearly.

---

## Success criteria (how we’ll know it worked)

- Fewer client components (and smaller client bundles) without losing behavior.
- Less effect-driven logic; more derived state and explicit data flow.
- MDX authoring becomes “boring”: fewer conventions, fewer surprises, less ceremony.
- Styling composition becomes predictable (use `cn`, no weird merge gotchas).
- Changes become easier to make without touching unrelated files or breaking layout.
