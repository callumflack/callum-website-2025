# Zoom Carousel Feature Summary

## Functionality

The `ZoomCarousel` component displays a horizontal row of project previews (using the first asset from each project). It features a distinct zoom interaction on wider viewports (>= 1024px):

1. **Initial State:** Shows a relatively short row of project previews (base height: 240px) that scrolls horizontally with snapping. Each item has a fixed height, and its width is determined by its asset's aspect ratio.
2. **Click to Zoom (Wide Viewports):**
    * When a user clicks on a project preview *image area* (not the caption link):
        * The entire carousel container smoothly animates to a larger height (expanded height: 480px).
        * *Simultaneously*, all items within the carousel animate to their new widths (calculated based on the expanded height and their aspect ratios).
        * *Simultaneously*, the carousel container smoothly scrolls horizontally to center the *clicked* item within the viewport.
        * The cursor changes to `zoom-in` before zooming and `zoom-out` when zoomed.
3. **Click to Zoom Out (Wide Viewports):**
    * Clicking anywhere on the carousel (or an item) while it's expanded smoothly reverses the animation, returning the carousel and its items to their base height/widths and restoring scroll snapping.
4. **Vertical Centering (Wide Viewports):** After the zoom-in height animation completes, the page smoothly scrolls vertically to attempt to center the expanded carousel in the viewport.
5. **Narrow Viewports (< 1024px):** The zoom functionality is disabled. The carousel remains at its base height, and clicking an item's image area does nothing. The caption link still navigates to the project page.
6. **Navigation:** Clicking the caption below each preview *always* navigates to the corresponding project page (`/[slug]`) and prevents the zoom interaction.
7. **Performance:** Uses `framer-motion` for animations and includes optimizations like `will-change` and `Image` component's `priority` prop.

## Implementation Gotchas & Nuances

Based on the development process and current code (`src/app/(home)/zoom-carousel.tsx`), here are key points to remember:

1. **Horizontal Scroll Calculation:** Directly reading `offsetLeft` of the clicked item during the expansion animation is unreliable due to layout shifts. The target scroll position (`targetScrollLeft`) *must be calculated* based on:
    * The sum of the *calculated expanded widths* of all preceding items.
    * The number of gaps between preceding items (using the `gap` value read on mount).
    * The container's `padding-left` (read on mount).
    * The clicked item's calculated expanded width.
    * The container's current `clientWidth`.
2. **Animation Conflicts:** Native scroll snapping (`snap-x`, `snap-mandatory`, `scroll-smooth`) and scroll anchoring (`overflow-anchor`) interfere with the smooth programmatic scroll animation (`animate`). These CSS classes and the `overflow-anchor: none` style *must* be temporarily applied/removed *before* the horizontal scroll animation starts and restored *after* it completes.
3. **Performance Optimizations:**
    * `will-change: height` is applied to the main container during height animation.
    * `will-change: width` is applied to individual items during width animation.
    * `will-change: scroll-left` is applied temporarily to the container during the horizontal scroll animation. Using `will-change` is crucial but can have memory implications if overused.
    * The `Next/Image` `priority` prop is used for above-the-fold images.
    * The `sizes` prop on `Next/Image` is crucial for performance but needs careful consideration, especially with the dynamic resizing. The current fixed value (`(min-width: 660px) 600px, 1200px`) aims to prevent layout shifts caused by Next.js recalculating sizes during the zoom.
4. **Vertical Centering Timing:** The vertical page scroll to center the carousel should only trigger *after* the height expansion animation is complete (`onAnimationComplete`) to ensure the final position is calculated correctly.
5. **Dimension Calculation:** Relies heavily on utility functions (`getDimensions`, `getAspectRatioCSS`) and consistent aspect ratio strings (`"16-9"`) from the `Asset` type. Errors in aspect ratio data will break the layout calculations.
6. **Event Handling:** Click handling is done on the main container. It differentiates between clicks on items (`data-index`) and clicks elsewhere (for zoom-out). The caption link uses `e.stopPropagation()` to prevent its clicks from triggering the container's zoom logic.
7. **State Dependencies:** The main `useEffect` for horizontal scrolling has several dependencies (`isExpanded`, `clickedIndex`, `projects`, `expandedHeight`, `gridGap`, `paddingLeft`). Changes to any of these will re-trigger the effect.
8. **Breakpoint Logic:** The `isWideEnoughForZoom` state (derived from `ZOOM_BREAKPOINT_PX`) controls the conditional enabling/disabling of zoom behavior and cursor styles.
9. **Hardcoded Heights:** `baseHeight` (240) and `expandedHeight` (480) are currently hardcoded pixel values. Changing these requires updating the constants.
