# MDX Styling System

This document describes the mental model for styling MDX content in this codebase.

## The Single Source of Truth

**All MDX styling lives in `mdx-prose.tsx`.**

| File                 | Responsibility                                            |
| -------------------- | --------------------------------------------------------- |
| `mdx-prose.tsx`      | ALL styling — organized in chunked arrays                 |
| `mdx-components.tsx` | JSX mapping and logic only — zero styling (one exception) |

### The Exception

`HeadingWithId` in mdx-components retains its styling because it integrates with the `Text` component's intent/weight system.

## How It Works

### Prose targets elements via class anchors

Components in mdx-components provide class anchors that Prose targets:

```tsx
// mdx-components.tsx — just the anchor
<div className="Callout">{children}</div>;

// mdx-prose.tsx — all the styling
("[&_.Callout]:bg-accent3/[0.15] [&_.Callout]:rounded-button ...");
```

### Chunked style arrays

Styles are organized into named arrays for readability:

```ts
const proseLayout = [...]
const proseInlineElements = [...]
const proseLinks = [...]
const proseCode = [...]
const proseZoomable = [...]
const proseHeadings = [...]
const proseMedia = [...]
const proseBlockquote = [...]
const proseListStyles = [...]
const proseCalloutStyles = [...]
const proseNoteStyles = [...]
const proseFootnotes = [...]
// etc.

export const proseVariants = cva({
  base: [
    ...proseLayout,
    ...proseInlineElements,
    // etc.
  ],
});
```

### withSelector helper

Reuse existing CVA outputs (like `textVariants`) in parent selector context:

```ts
const withSelector = (selector: string, classes: string): string =>
  classes
    .split(" ")
    .filter(Boolean)
    .map((c) => `${selector}:${c}`)
    .join(" ");

// Usage
const proseLinks = [withSelector("[&_a]", textVariants({ link: "default" }))];
// → "[&_a]:link"
```

## Class Anchors

Components provide these class anchors for Prose to target:

| Component | Anchor                          |
| --------- | ------------------------------- |
| Callout   | `.Callout`                      |
| Note      | `.Note`                         |
| pre       | `.Pre` + `[data-component=pre]` |
| Contacts  | `.Contacts`                     |
| hr        | `.Note` (reuses Note styling)   |

## When Adding New Styles

1. Add styles to the appropriate chunk in `mdx-prose.tsx`
2. If targeting a custom component, add a class anchor in `mdx-components.tsx`
3. Never add styling to mdx-components (except HeadingWithId)

## Sugar-High (Code Syntax Highlighting)

Sugar-high CSS variables remain in `src/styles/code.css`. These are theme variables, not element styling — they define the color palette that sugar-high's generated HTML consumes.

## Files

- `src/components/mdx/mdx-prose.tsx` — All MDX styling
- `src/components/mdx/mdx-components.tsx` — JSX mapping, logic, class anchors
- `src/components/mdx/mdx-media.tsx` — ZoomableImage, ZoomableVideo
- `src/components/mdx/mdx.tsx` — Main Mdx component
- `src/styles/code.css` — Sugar-high theme variables
