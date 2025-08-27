export const calloutStyle = [
  "bg-accent3/[0.15] md:pr-w12 rounded-button space-y-1.5 px-3 pt-2.5 pb-2.5",
  "not-first:mt-w4",
  "[&_code]:bg-black-a1 [&_ul]:text-[0.925em]",
  "[&>*]:text-meta",
];

export const noteStyle = [
  "Note !mt-w12 space-y-2 text-meta text-solid link-block",
  "[&_p]:text-meta [&_p]:text-solid",
];

export const listStyle = [
  "pl-bullet space-y-0.5",
  "[&>li]:relative [&>li]:before:absolute [&>li]:before:top-[0.75em] [&>li]:before:-left-[1.3em] [&>li]:before:inline-block [&>li]:before:h-px [&>li]:before:w-[14px] [&>li]:before:bg-current [&>li]:before:content-['']",
];
