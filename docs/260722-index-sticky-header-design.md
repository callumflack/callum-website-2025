# Index sticky header design

## Decision

Index pages use this interaction:

1. `TitleHeader` and `ListHeader` begin in the normal page flow.
2. They scroll towards the top of the viewport.
3. They stick as a title-and-tabs stack while the index content continues scrolling.

This preserves the spacious initial composition without permanently consuming that vertical space.

## Current method

`PageInner` owns an explicit `indexSticky` variant:

- `TitleHeader` sticks at `top: 0`.
- `ListHeader` sticks below it.
- `--height-index-title-header` calculates the list-header offset from the title type and padding tokens.
- `/log`, `/writing`, and `/work` opt into the variant.

The height contract assumes a single `Text intent="title"` inside `TitleHeader`. Variable-height headers, multi-line titles, metadata, and tag grids must continue using the ordinary `index` variant.

This method is intentionally local and CSS-only. It avoids JavaScript measurement and does not require changing who owns the tabs.

## Why not use one sticky wrapper now?

A shared wrapper would be structurally cleaner:

```tsx
<IndexStickyHeader>
  <TitleHeader>Projects</TitleHeader>
  <ListHeader>...</ListHeader>
</IndexStickyHeader>
```

Only the wrapper would be sticky, so no title-height offset would be required.

However, this is a composition refactor rather than a styling change. `FeaturedOrIndexPosts` and `FullOrIndexPosts` currently own their `ListHeader`, URL-derived tab state, handlers, and post content. The route cannot wrap the title and tabs together without first exposing the tabs separately.

The smallest responsible version would:

1. Extract the tab controls from both post components.
2. Keep the URL as the shared source of truth so controls and content can read it independently, without context or lifted React state.
3. Compose `TitleHeader` and the extracted controls inside `IndexStickyHeader` at the route level.
4. Leave the post components responsible only for rendering the selected content.
5. Preserve the existing Suspense, keyboard, URL, and container-width behaviour.

That would touch the two post components, the shared page composition, and each participating route. It is worthwhile only when the height contract stops being reliable.

## Revisit when

Choose the shared-wrapper refactor if any of these become requirements:

- Sticky titles can wrap.
- Sticky headers can contain metadata or other variable-height content.
- More pages need different sticky-header compositions.
- The title-height token repeatedly drifts from the rendered header.

Until then, the computed single-line contract is the smaller and clearer implementation.

## Visual oracle

Verify by scrolling `/log`, `/writing`, and `/work` at narrow and wide viewport sizes:

- The title and tabs begin in their intended page position.
- The title sticks at the viewport top.
- The tabs settle immediately below the title without overlap or clipping.
- The index content scrolls beneath the complete sticky stack.
