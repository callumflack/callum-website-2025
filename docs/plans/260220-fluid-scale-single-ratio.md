# Fluid Type + Spacing: Single-Relationship Pass

## Goal

Run a first implementation pass that removes clamp sprawl and centralizes scaling logic behind one shared fluid relationship.

## Decisions in this pass

- Introduce a single global fluid scalar:
  - `--fluid-step = clamp(0, (100vw - 500px) / 700, 1)`
  - `0` at `500px`, `1` at `1200px`, clamped outside that range
- Type tokens all resolve from linear interpolation against `--fluid-step`:
  - `--text-fine`, `--text-pill`, `--text-meta`, `--text-body`, `--text-heading`, `--text-title`
  - Formula pattern: `min + (max - min) * --fluid-step`
- Spacing ladder tokens all resolve from the same interpolation pattern:
  - `--spacing-inset`, `--spacing-w4 ... --spacing-w96`
- Semantic spacing tokens alias ladder tokens (no duplicated interpolation):
  - `gap -> w4`
  - `small -> w6`
  - `minor -> w12`
  - `submajor -> w20`
  - `major -> w24`
- Purposeful outliers remain unchanged:
  - `--spacing-nav`
  - `--spacing-tab`

## Why this shape

- One shared scalar makes the system easy to reason about and tune.
- Every token now shares the same viewport relationship, so behavior is predictable.
- The implementation stays plain-CSS and avoids hard-to-port math features.

## What to evaluate next

- Compare type hierarchy at `500`, `768`, `1024`, `1200`.
- Validate that title range feels expressive enough.
- Decide whether to introduce additional ratio curves later for large-display typography only.

## Alternative method: root clamp + rem cascade

An alternative is to put a single `clamp()` on root font size, then express
type/spacing in `rem` so everything scales from that base.

Reference example: Surge HQ (`https://surgehq.ai`).

```css
html {
  font-size: clamp(14px, calc(14px + 2 * (100vw - 500px) / 700), 16px);
}
```

Then tokens/components use `rem` values (for example: `1rem`, `1.5rem`,
`4rem`) instead of per-token fluid interpolation.

## Difference from current approach

- Current approach (this doc): one shared `--fluid-step`, each token computes
  `min + (max - min) * --fluid-step`.
- Alternative: one fluid root size, tokens stay mostly static in `rem`.
- Current approach gives per-token control over ranges/slopes.
- Alternative reduces token math and can be simpler to maintain.
- Current approach decouples token scaling from root font-size behavior.
- Alternative couples all scale behavior to root size.

## Decision for now

Keep current `--fluid-step` token interpolation as the active approach.
