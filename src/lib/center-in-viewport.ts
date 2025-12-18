interface CenterInViewportOptions {
  behavior?: ScrollBehavior;
  offsetY?: number;
  thresholdPx?: number;
}

function clampNumber(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function getMaxScrollTop() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  return Math.max(0, max);
}

/**
 * Scroll the page so the element is vertically centered in the viewport.
 * This does NOT disable scrolling; it only computes a valid target scrollTop.
 */
export function centerInViewport(
  element: Element,
  options?: CenterInViewportOptions
) {
  const behavior = options?.behavior ?? "smooth";
  const offsetY = options?.offsetY ?? 0;
  const thresholdPx = options?.thresholdPx ?? 1;

  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const idealTop = (viewportHeight - rect.height) / 2 + offsetY;
  const delta = rect.top - idealTop;

  if (Math.abs(delta) < thresholdPx) return;

  const targetTop = clampNumber(
    window.scrollY + delta,
    0,
    getMaxScrollTop()
  );

  window.scrollTo({ top: targetTop, behavior });
}


