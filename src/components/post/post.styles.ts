export const postIconStyle =
  "h-[0.666em] w-[0.666em] transform translate-y-[-0.235em]";

export const hideFeaturedDotStyle =
  "before:absolute before:left-[-1em] before:h-tab before:w-[1em] before:bg-canvas";

export const lineHoverStyle = [
  "hover:relative hover:z-0",
  // before
  "hover:before:absolute",
  "hover:before:-inset-x-3 hover:before:inset-y-0",
  // "hover:before:bg-background-hover",
  "hover:before:border",
  // "hover:before:border-border-hover/25",
  "hover:before:border-solid",
  "hover:before:rounded-button",
  "hover:before:content-[''] hover:before:-z-[1]",
];
