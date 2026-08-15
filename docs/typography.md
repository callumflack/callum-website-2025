# Typography roles

Choose metadata typography by the text's role, not by the component or layout
that contains it.

## Mono caps: discrete labels and values

Use `Text intent="pill"` for short, self-contained interface labels or metadata
values that can be scanned independently. This includes:

- categories and tags
- dates, years, and durations
- compact actions such as `Share` and `Subscribe`

The same value keeps this treatment across page headers, cards, and list views.
A post year does not become `text-meta` merely because it appears beside a card
title.

Use `dim` when the label or value is secondary. Interactive actions normally
use the foreground color. Color hierarchy is independent of the typeface.

## Text meta: supporting language

Use `Text intent="meta"` for secondary text that is read as language rather than
scanned as a label or value. This includes:

- summaries, captions, and explanatory sentences
- form text and placeholders
- index navigation tabs

`text-meta` sets the small sans-serif text size. It does not imply gray; add
`dim` or an explicit color according to the element's hierarchy.

## Decision test

If the text answers “what kind, when, or how long?” as a compact value, use mono
caps. If it must be read as a phrase or sentence to support nearby content, use
`text-meta`.
