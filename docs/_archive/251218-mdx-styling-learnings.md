# MDX Styling Refactor: Implementation Learnings

## Context

Refactored MDX styling from a scattered system (proseVariants CVA + mdx-components inline styles + mdx-styles.tsx presets) to a consolidated approach.

## The Problem We Were Solving

MDX content styling was spread across 4 places:

1. `proseVariants` CVA in `mdx-prose.tsx` (parent selectors)
2. Inline `className` in `mdx-components.tsx`
3. Style arrays in `mdx-styles.tsx`
4. `code.css` for sugar-high syntax highlighting

When something looked wrong, you had to check all four. High cognitive load.

## Two Approaches Tested

### Approach A: CVA with `[&_selector]:class` syntax

```ts
const proseVariants = cva({
  base: [
    "[&_code]:bg-background-active [&_code]:font-mono",
    "[&_.Callout]:bg-accent3/[0.15]",
    // ...
  ],
});
```

**Pros:**

- Can import and reuse JS utilities (textVariants, etc.)
- `withSelector()` helper enables CVA reuse in parent selector context

**Cons:**

- Ugly, hard to read
- Doesn't fail-fast on invalid utilities (silently generates nothing)
- Tailwind's content scanner may miss classes in dynamic arrays

### Approach B: CSS file with `@apply`

```css
.Prose code {
  @apply font-mono text-[0.925em];
  @apply bg-background-active rounded-soft px-[2px];
}
.Prose .Callout {
  @apply bg-accent3/[0.15] rounded-button;
}
```

**Pros:**

- Clean, readable nesting
- Fails fast on invalid utilities (`@apply` errors at build time)
- Standard CSS — easy to scan and understand
- One file for all MDX styling

**Cons:**

- Can't import JS utilities directly (must duplicate or use CSS variables)
- Adam Wathan (Tailwind creator) recommends against `@apply` generally

## Why `@apply` is Legitimate Here

Adam Wathan's criticism of `@apply`:

> "If I started Tailwind over from scratch, there would be no @apply"
> "@apply basically only exists to trick people who are put off by long lists of classes"

**But he acknowledges exceptions:** styling elements you can't add classes to.

MDX is exactly that case:

- Markdown generates `<p>`, `<code>`, `<blockquote>` etc.
- We can't add `className` to every generated element
- Parent selectors (`.Prose code {}`) are the only option
- `@apply` in this context is just syntactic sugar for CSS properties

## Key Discovery: Silent Failures

The CVA approach was silently failing on utilities like `bg-background-active` and `bg-black-a1` that weren't in Tailwind's theme. No error, just missing styles.

The CSS `@apply` approach fails explicitly at build time:

```
Error: Cannot apply unknown utility class: bg-background-active
```

This forced us to:

1. Add missing colors to the theme (`--color-background-active`)
2. Use CSS variables directly when appropriate (`background-color: var(--black-a1)`)

## Final Architecture

```
mdx-prose.tsx      → Minimal, just outputs `.Prose` class
mdx.css            → ALL styling via @apply + CSS
mdx-components.tsx → Pure JSX mapping, class anchors only
```

Toggle in `mdx-prose.tsx`:

```ts
const USE_CSS_STYLES = true; // false = use proseVariants arrays
```

## Rules Established

| Target                                     | Approach                                     |
| ------------------------------------------ | -------------------------------------------- |
| Native HTML (`h4`, `blockquote`, `a`)      | CSS: `.Prose blockquote {}`                  |
| Controlled divs (`Callout`, `Note`, `Pre`) | Add class anchor, CSS: `.Prose .Callout {}`  |
| Data attributes (`pre`, `contacts`)        | CSS: `.Prose [data-component="pre"] {}`      |
| External components                        | Pass styles as props (exception to CSS-only) |
| Utilities not in theme                     | Use CSS variables directly                   |

## When to Use Each Pattern

**Use CSS + `@apply` when:**

- Styling generated/third-party HTML you can't modify
- MDX content, markdown output, CMS content
- You want fail-fast validation of utility classes

**Use CVA/component classes when:**

- You control the component and can add `className`
- You need JS logic (conditional styles, variants)
- Colocation of styles with component is valuable

## CSS Utility vs JavaScript Const

**Use CSS utility (`@utility`) when:**

- The style is **static** — it never changes based on props or state
- It's **reusable** across different contexts (MDX, components, etc.)
- You want a **single source of truth** without import chains

**Use JavaScript const when:**

- The style needs **runtime logic** — conditional based on props, computed values
- It's **component-specific** and won't be reused elsewhere
- You need to **compose programmatically** (e.g., CVA variants with dynamic selection)

**The test:** Ask yourself — _"Does this ever change, or is it always the same?"_

- `list-bullets` → Always the same. CSS utility.
- `textVariants({ intent })` → Changes based on `intent` prop. JS needed.

**The trap we fell into:** We were using JS indirection (`export const listStyle = [...]`) for something that was always static. The JS const added:

- Import/export chains
- Potential circular dependencies
- Extra cognitive overhead

The `link` utility was already showing the right pattern — we just didn't apply it to lists.

**Rule of thumb:** Start with CSS. Only reach for JS when you need runtime decisions.

## Files

- `src/components/mdx/mdx.css` — All MDX styling (CSS version)
- `src/components/mdx/mdx-prose.tsx` — Toggle + fallback CVA version
- `src/components/mdx/mdx-components.tsx` — JSX mapping only
- `docs/251218-mdx-styling-system.md` — Mental model documentation
