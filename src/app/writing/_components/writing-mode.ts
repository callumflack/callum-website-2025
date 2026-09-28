export const WRITING_MODES = [
  { label: "Collections", value: "collections" },
  { label: "Chrono", value: "year" },
] as const;

export type WritingMode = (typeof WRITING_MODES)[number]["value"];
export const DEFAULT_WRITING_MODE: WritingMode = "collections";

export type WritingSearchParams = Record<string, string | string[] | undefined>;

export function getWritingMode(sort: WritingSearchParams["sort"]): WritingMode {
  const value = Array.isArray(sort) ? sort[0] : sort;

  return WRITING_MODES.some((mode) => mode.value === value)
    ? (value as WritingMode)
    : DEFAULT_WRITING_MODE;
}

export function getWritingModeHref(
  searchParams: WritingSearchParams,
  mode: WritingMode
): string {
  const params = new URLSearchParams();

  for (const [name, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(name, item));
    } else if (value !== undefined) {
      params.set(name, value);
    }
  }

  if (mode === DEFAULT_WRITING_MODE) {
    params.delete("sort");
  } else {
    params.set("sort", mode);
  }

  const query = params.toString();
  return query ? `/writing?${query}` : "/writing";
}
