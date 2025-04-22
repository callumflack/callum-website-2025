// const result = generateClampFontSize(500, 1200, 11.5, 14);
// console.log(result); // clamp(11.5px, 9.7143px + 0.3571vw, 14px)
// prev used: https://clamp.font-size.app/
// alt method from klim.co.nz:
// w1: "calc(8 / var(--viewport-basis) * 100vw)"

export function generateClampSize(
  minViewportWidth: number,
  maxViewportWidth: number,
  minFontSize: number,
  maxFontSize: number
): string {
  const minClampValue = `${minFontSize}px`;
  const maxClampValue = `${maxFontSize}px`;

  const fontSizeDiff = maxFontSize - minFontSize;
  const viewportWidthDiff = maxViewportWidth - minViewportWidth;

  const slope = fontSizeDiff / viewportWidthDiff;
  const yIntercept = minFontSize - slope * minViewportWidth;

  const clampExpression = `${yIntercept.toFixed(4)}px + ${(slope * 100).toFixed(
    4
  )}vw`;

  return `clamp(${minClampValue}, ${clampExpression}, ${maxClampValue})`;
}

export const clampSizes = {
  11: generateClampSize(500, 1200, 9, 11),
  12: generateClampSize(500, 1200, 10, 12),
  13: generateClampSize(500, 1200, 11, 13),
  14: generateClampSize(500, 1200, 11.5, 14),
  15: generateClampSize(500, 1200, 12, 15),
  16: generateClampSize(500, 1200, 14, 16),
  17: generateClampSize(500, 1200, 15, 17),
  18: generateClampSize(500, 1200, 16, 18),
  19: generateClampSize(500, 1200, 16, 19),
  20: generateClampSize(500, 1200, 17, 20),
  21: generateClampSize(500, 1200, 17, 21),
  22: generateClampSize(500, 1200, 17, 22),
  23: generateClampSize(500, 1200, 18, 23),
  24: generateClampSize(500, 1200, 20, 24),
  27: generateClampSize(500, 1200, 21, 27),
  28: generateClampSize(500, 1200, 21, 28),
  30: generateClampSize(500, 1200, 22, 30),
  32: generateClampSize(500, 1200, 22, 32),

  fine: generateClampSize(500, 1200, 9, 11),
  pill: generateClampSize(500, 1200, 10, 11.5),
  meta: generateClampSize(500, 1200, 11, 13.5),
  body: generateClampSize(500, 1200, 14, 16),
  heading: generateClampSize(500, 1200, 17, 22),
  title: generateClampSize(500, 1200, 22, 30),

  // spacers
  // lower value is 2/3 of upper value
  // w4: generateClampSize(500, 1200, 10.5, 16),
  // w6: generateClampSize(500, 1200, 16, 24),
  // w8: generateClampSize(500, 1200, 21, 32),
  // w12: generateClampSize(500, 1200, 32, 48),
  // w16: generateClampSize(500, 1200, 43, 64),
  // w20: generateClampSize(500, 1200, 54, 80),
  // w24: generateClampSize(500, 1200, 64, 96),
  // w28: generateClampSize(500, 1200, 75, 112),
  // w32: generateClampSize(500, 1200, 85, 128),
  // w36: generateClampSize(500, 1200, 96, 144),
  // w42: generateClampSize(500, 1200, 112, 168),
  // w48: generateClampSize(500, 1200, 128, 192),
  // w64: generateClampSize(500, 1200, 171, 256),
  // w72: generateClampSize(500, 1200, 192, 288),
  // w96: generateClampSize(500, 1200, 256, 384),

  // semantic spacers
  // gap: generateClampSize(500, 1200, 10.5, 16), // w4
  // small: generateClampSize(500, 1200, 16, 24), // w8
  // minor: generateClampSize(500, 1200, 32, 48), // w12
  // submajor: generateClampSize(500, 1200, 54, 80), // w20
  // major: generateClampSize(500, 1200, 64, 96), // w24
};
