# CSS Notes

## Flex Min-Size Traps

Flex items default to an automatic minimum size.

- In row layouts, children effectively behave like `min-width: auto`.
- In column layouts, children effectively behave like `min-height: auto`.

That means a flex child will often refuse to shrink past its contents unless
you opt in.

Use targeted fixes, not global resets:

- Add `min-w-0` to the flex child that should shrink, truncate, or stop
  blowing out a horizontal layout.
- Add `min-h-0` to the flex child that should shrink so an inner
  `overflow-auto` or `overflow-hidden` region can actually scroll.
- Apply these to the flex item, not the flex container.
- Do not set `min-width: 0` or `min-height: 0` globally on `*`.

The global `min-height: 0` reset broke Privy's modal because nested flex
wrappers were allowed to collapse to zero height.

Rule of thumb:

- horizontal flex bug: "why won't this shrink?" -> `min-w-0`
- vertical flex bug: "why won't this scroll?" -> `min-h-0`

## Root Scroll Container

Rule of thumb:

- Prefer one root scroll container for the page unless a local scroll region
  is intentional.

Why:

- predictable sticky behavior
- less accidental interaction with nested overflow containers
- no horizontal jiggle when scrollbar space appears or disappears

Common implementation:

- put vertical scrolling on the root page
- reserve scrollbar space when needed
- only introduce `overflow-auto` or `overflow-hidden` on inner wrappers when
  you explicitly want local scrolling

`position: sticky` is relative to the nearest scrolling ancestor, so once you
add an overflow parent, that parent owns sticky behavior instead of the page.

## Other CSS gotchas that commonly waste time:

- Flex min-size traps: `min-w-0` / `min-h-0` on the child, not the container.
- Overflow creates a new sticky container: one stray `overflow-hidden` can break `position: sticky`.
- Transforms create containing blocks: fixed/absolute children can start positioning against the wrong ancestor.
- Stacking contexts: `position` + `z-index`, `opacity < 1`, `transform`, `filter`, etc. can make `z-index` feel fake.
- Percentage heights need a real parent height chain.
- `text-overflow: ellipsis` needs the full combo: constrained width, `overflow-hidden`, `whitespace-nowrap`.
- `100vh` on mobile lies; `dvh`/`svh` matters.
- `pointer-events: none` on the wrong wrapper silently kills UI.
- `box-sizing` mismatches make width math look haunted.
- Inline elements ignore width/height in ways that break truncation and icon alignment.
- Margin collapse still bites when block spacing looks “missing.”
- `position: absolute` plus `overflow: hidden` clips things in ways people forget.