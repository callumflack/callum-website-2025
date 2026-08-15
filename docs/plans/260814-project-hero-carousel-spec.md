# Project hero carousel specification

Status: proposed for review; no implementation is authorised by this document.

## Intent

Add a new MDX component that reproduces the simple two-mode interaction shown in the supplied Threads recording:

1. A horizontally scrollable strip of project hero images inside the homepage text measure.
2. A fullscreen carousel that opens on the clicked image.

The new component is additive. The existing Pasito-backed `StoryCarousel` remains unchanged and continues to render the current homepage blocks.

## Scope contract

| Surface | Current | Proposed |
| --- | --- | --- |
| Component | `StoryCarousel` owns the existing one-at-a-time Pasito presentation | Add `ProjectHeroCarousel` with its own rail and fullscreen-viewer behaviour |
| Homepage | `posts/pages/home.mdx` begins with the Vana `StoryCarousel` | Insert one `ProjectHeroCarousel` as the first MDX content block; retain every existing block below it |
| Content | Project assets are resolved from published post frontmatter | Resolve four authored hero assets by project slug and asset index |
| Media | The selected test assets are videos with poster frames | Use their poster frames as static carousel images in v1; do not autoplay or add video controls |
| Dependencies | Pasito and the repo's existing animation tools are already installed | Add no dependency and do not modify Pasito |

### Allowed implementation surfaces later

- `src/components/mdx/project-hero-carousel.tsx`: published-post and asset resolution; MDX-facing API.
- `src/components/mdx/project-hero-carousel-client.tsx`: rail, dialog state, navigation, focus, and motion.
- `src/components/mdx/mdx-components.tsx`: expose the new MDX component.
- `src/components/mdx/mdx.css`: the component's prose-container geometry if a local class is insufficient.
- `posts/pages/home.mdx`: add the first content block only.

### Forbidden surfaces

- Do not delete, rename, or change `StoryCarousel`, `StoryCarouselClient`, Pasito styles, or current `StoryCarousel` usages.
- Do not change `ZoomCarousel` or extract a shared carousel/lightbox abstraction during this test.
- Do not change global tokens, unrelated homepage copy, project frontmatter, asset files, dependencies, or lockfiles.
- In particular, preserve the existing unrelated change in `src/styles/tokens-semantic.css`.

## MDX contract

Proposed name: `ProjectHeroCarousel`.

```mdx
<ProjectHeroCarousel
  label="Selected project images"
  slides={[
    { slug: "vana", assetIndex: 0 },
    { slug: "the-library-of-economic-possibility", assetIndex: 0 },
    { slug: "kalaurie", assetIndex: 0 },
    { slug: "replier", assetIndex: 0 },
  ]}
/>
```

Each slide resolves from the matching published project post. `assetIndex` defaults to `0`. Missing posts, missing assets, or video assets without posters fail during rendering rather than silently producing an empty card.

For v1:

- Image assets use `src`.
- Video assets use their authored `poster`.
- Alt text comes from the asset frontmatter.
- The project title contributes to the accessible slide label, but no visible title, caption, count, or project link is added.

## Inline rail

The inline state should read as a row of images embedded in the document, not as a control panel.

- The clip viewport is exactly the computed homepage text-container width and never causes document-level horizontal overflow.
- The rail has a small optical gutter at its leading and trailing edges. The gutter sits inside the clipped viewport; cards do not sit flush against its edges.
- Cards share one responsive height. Their widths come from their authored aspect ratios; do not crop them to a single fixed card width.
- The next card remains visibly cut off at the trailing clip edge whenever more content is available. This is the only inline affordance that communicates horizontal scroll.
- Horizontal movement is native and momentum-preserving via touch, trackpad, shift-wheel, or scrollbar input. Do not autoplay, force a slide selection, or add dots, arrows, a progress bar, or pagination.
- Preserve a modest gap between cards and the site's existing media corner treatment. Add only the existing neutral inset image outline if the current media primitive does not already provide edge separation.
- A card is one button-sized hit target. Clicking or tapping anywhere on it opens the fullscreen viewer at that exact index.
- Keyboard users can tab to each visible/reachable card. The accessible name follows `Open {project title} image {position} of {count}`.

### Responsive geometry

- At phone widths, the rail still uses the full available text measure. A complete first card plus a meaningful slice of the next card should be visible.
- At the text container's maximum width, roughly one-and-a-half to two landscape project images should be visible. Exact height is selected during implementation from existing spacing/media tokens, not a new global token.
- The first and last scroll positions expose equal leading and trailing gutters.
- No card may shrink merely to make all four fit.

## Fullscreen viewer

Opening a card creates a modal dialog over the page without changing the URL.

- Cover the visual viewport with a fixed black canvas using dynamic viewport height.
- Lock page scroll while open; leave the inline rail and its scroll position intact underneath.
- Start on the clicked slide. Do not reset to the first slide.
- Centre the poster at the largest size that fits within the safe canvas while preserving its full aspect ratio. Never crop, upscale beyond a visibly useful source size, or stretch.
- Show only three possible controls: close at the top-left, previous at the horizontal left edge, and next at the horizontal right edge.
- Hide/disable previous on the first slide and next on the last. Navigation does not wrap.
- Support control clicks/taps, `ArrowLeft`, `ArrowRight`, and a deliberate horizontal swipe. Ignore predominantly vertical gestures so ordinary touch intent is not hijacked.
- `Escape` and the close control dismiss the viewer. Backdrop click does not close it.
- On close, restore focus to the card that opened the viewer and preserve the rail's previous horizontal position.

### Dialog and focus behaviour

- Use dialog semantics with an accessible label derived from the component `label`.
- Move focus to close when the viewer opens, contain focus within the viewer, and make the obscured page inert.
- All visible controls have non-overlapping hit areas of at least 44 by 44 CSS pixels and visible focus treatment.
- Announce `Image {position} of {count}: {project title}` politely after manual navigation; do not announce during initial page render.

## Motion

The motion should explain spatial continuity, not decorate the carousel.

- Opening: fade in the black canvas while the selected card moves and scales from its inline bounds to its contained fullscreen bounds.
- Closing: reverse toward the originating card when it is still measurable; otherwise use a short opacity exit.
- Previous/next: use a short, interruptible horizontal transition with the incoming poster following the direction of travel. Avoid bounce, parallax, blur, or a staged entrance.
- Target approximately 200–250 ms for open/navigation and a slightly shorter close. Use the repo's existing easing/motion tooling and animate only transform, opacity, and the necessary corner-radius change.
- With `prefers-reduced-motion: reduce`, remove shared-position and slide movement. Use an immediate state change or a brief opacity-only transition.
- Do not animate anything on initial page load.

## State model

```text
inline rail
  -> open(card index)
fullscreen(index)
  -> previous / next within [0...3]
  -> close / Escape
inline rail at prior scroll position and prior focus
```

There is no autoplay state, route state, video playback state, caption state, or selected inline slide state in v1.

## Acceptance checks

The completion oracle is a fresh browser recording that shows the real homepage interaction at phone and desktop widths. Source inspection or lint alone is not completion proof.

### Browser truth

- At 390, 620, and 1440 CSS pixels, the inline clip viewport matches the homepage text measure and the document has no horizontal overflow.
- Initial state shows the first card and a cut-off next card; native horizontal scroll reaches all four cards and ends with a trailing gutter equal to the leading gutter.
- Clicking each of the four cards opens that same card fullscreen.
- The fullscreen canvas covers the dynamic viewport, contains the complete poster, and does not move the page underneath.
- Previous/next controls and arrow keys clamp correctly at both ends. Swipe changes exactly one slide per committed gesture.
- Close and `Escape` restore the prior rail position and focus to the opener.
- Tab order remains inside the dialog while open. Focus treatment and 44-pixel control targets are visible at phone and desktop widths.
- Reduced-motion mode has no position/slide animation and remains fully usable.
- The browser console has no hydration, missing-key, dialog, or asset errors.

### Repo checks

- Exact inspection proves every existing `StoryCarousel` block and Pasito file is unchanged.
- The four MDX references resolve to current published posts and valid asset posters.
- Run focused lint/type checks for changed files, then the repo's production build.
- Review the final diff to prove there are no dependency, lockfile, project-content, token, or unrelated homepage changes.

## Explicit non-goals

- Replacing or redesigning the Pasito carousel.
- Making a reusable site-wide lightbox.
- Playing project videos fullscreen.
- Captions, thumbnails, progress indicators, slide counts, sharing, downloads, deep links, or URL history.
- Autoplay, wrapping navigation, infinite looping, or automatic inline snapping.
- Changing which four projects appear elsewhere on the homepage.

## Production hardening note

Keep the native horizontal rail. Embla—including the Shadcn carousel wrapper—would mainly replace behaviour the browser already provides here and would not remove the fullscreen dialog, focus, transition, or gesture work.

The current custom fullscreen viewer is appropriate for this homepage experiment. Its least mature surface is touch gesture handling: the local pointer threshold does not provide PhotoSwipe's velocity, cancellation, multi-touch, edge-resistance, or gesture-arbitration behaviour.

If real-device testing exposes brittle swipe behaviour, or this component graduates into a reusable gallery, replace the fullscreen controller as one coherent unit with [PhotoSwipe](https://photoswipe.com/). Retain the existing MDX resolver, native inline rail, and semantic-token styling. Configure PhotoSwipe with finite navigation and contained images; disable backdrop close, vertical-drag close, captions, counters, downloads, sharing, and unwanted zoom controls. Do not copy isolated PhotoSwipe internals into the local controller.

This upgrade would also provide mature thumbnail-to-fullscreen transitions, adjacent-image preloading, responsive image handling, reduced-motion behaviour, focus return, scroll locking, and keyboard navigation. It requires accurate poster dimensions rather than assuming a video's authored aspect matches its poster; the Vana test poster already proves that distinction matters.

## Decision required after review

Approve or amend this v1 boundary. Implementation should not begin until the interaction, poster-only media rule, black fullscreen canvas, and no-caption/no-link presentation are accepted.
