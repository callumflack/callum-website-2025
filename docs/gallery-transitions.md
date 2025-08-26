# Gallery Transitions: View Transitions (Next.js) and FLIP Ghost

This doc outlines two production-grade approaches to achieve a perfectly smooth "thumbnail → centered detail" animation in the gallery:

- View Transitions API via Next.js experimental flag (native shared-element morph, progressive enhancement)
- FLIP Ghost overlay (framework-agnostic fallback that works everywhere)

Both approaches ensure the animation begins from the exact grid-cell position and ends centered in the viewport.

---

## 1) Next.js Experimental View Transitions

Next 15 exposes an experimental flag that wires React’s View Transitions API in the App Router.

### Enable

```ts
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
};
module.exports = nextConfig;
```

Notes:

- Chromium-based browsers support this best; Firefox lacks full support. Treat as progressive enhancement.
- Prefer-reduced-motion should bypass transitions.

### Core idea

- Give both the grid thumbnail and the dialog’s media the same `view-transition-name` at the moment of transition.
- Wrap the state change that opens the detail/dialog in a view transition so the browser snapshots “before/after” and morphs between rects.

### Minimal steps

1. Name the shared element per item (stable id):

```tsx
// Thumbnail
<div style={{ viewTransitionName: `vt-${slug}` }}> ... </div>

// Dialog content (rendered when open)
<div style={{ viewTransitionName: `vt-${slug}` }}> ... </div>
```

2. Start the transition around opening the detail:

```ts
// Guard: only if document.startViewTransition exists
const run = async (open: () => void) => {
  if ("startViewTransition" in document) {
    // @ts-ignore - experimental API
    const t = document.startViewTransition(async () => {
      open(); // set state so dialog renders the target element with the same name
    });
    await t.finished; // optional
  } else {
    open();
  }
};
```

3. Tweak CSS to disable root cross-fade and tune the named element:

```css
/* Turn off the default page crossfade */
::view-transition-group(root) {
  animation: none;
}

/* Optional: tune ‘old/new’ snapshots for the named element */
::view-transition-old(vt-*) {
  animation: none;
}
::view-transition-new(vt-*) {
  animation: none;
}
```

Tips:

- Keep target size stable using known aspect ratio; don’t wait for intrinsic image load to decide layout.
- If you need rounded corners to morph, animate border-radius on the target container via CSS.
- The origin grid cell can remain visible (dimmed) during the transition; snapshots are handled by the browser.

---

## 2) FLIP Ghost Overlay (Works Everywhere)

When View Transitions isn’t available or you want explicit control, use a FLIP ghost overlay.

FLIP = First, Last, Invert, Play.

### Open animation

1. Measure the clicked cell (First):

```ts
const rect = el.getBoundingClientRect();
```

2. Compute the centered target (Last) using the asset aspect ratio:

```ts
const vw = window.innerWidth;
const vh = window.innerHeight;
const targetW = Math.min(vw * 0.95, vh * 0.95 * aspect);
const targetH = targetW / aspect;
const targetLeft = (vw - targetW) / 2;
const targetTop = (vh - targetH) / 2;
```

3. Create a fixed-position ghost at the target geometry and Invert back to First via transform:

```ts
// element style: position: fixed; left: targetLeft; top: targetTop; width: targetW; height: targetH;
const dx = rect.left - targetLeft;
const dy = rect.top - targetTop;
const sx = rect.width / targetW;
const sy = rect.height / targetH;

ghost.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
requestAnimationFrame(() => {
  ghost.style.transition =
    "transform 400ms cubic-bezier(.2,.8,.2,1), border-radius 400ms";
  ghost.style.transform = "translate(0,0) scale(1,1)"; // Play
});
```

4. Dim the origin cell to ~10–20% opacity while open. Lock scroll during the overlay.

5. After the animation completes, reveal the real dialog content behind the ghost and remove the ghost.

### Close animation

1. Re-measure the destination cell’s rect (it might have moved).
2. Start from current center size; animate the ghost back to the cell with the same FLIP math.
3. Remove ghost, restore scroll and origin opacity.

### Jank guards

- Use double rAF before starting the animation so layout is committed.
- Base target size on known aspect ratio so intrinsic loads don’t shift the target mid-flight.
- Add ResizeObserver on the overlay content to re-center if dimensions change.
- Respect prefers-reduced-motion.

---

## Choosing an approach

- Prefer View Transitions where supported. Minimal code, excellent results for shared-element morphs.
- Use FLIP ghost as the universal fallback (or for bespoke timing/easing/stacking control).
- You can also feature-detect and branch: View Transitions → otherwise FLIP.

---

## Implementation checklist (project-specific)

- Keep consistent borders/rounded using `mediaWrapperVariants` on both thumbnail and target.
- Maintain stable aspect sizing via `getAspectRatioCSS(aspect)`.
- Dim the origin grid cell during expansion (opacity-10) and disable pointer events.
- Ensure overlay z-index sits above nav and content.
- Hook scroll-into-center only after layout settles (rAF + `onLayoutAnimationComplete` or after ghost animation starts).

---

## References

- Next.js experimental View Transition flag: next.config.js `experimental.viewTransition`
- View Transitions API: MDN, Chrome DevTools Animations panel
- Shared element naming: `view-transition-name` CSS property, and `document.startViewTransition()`
