export const WORK_MODES = [
  { label: "Reel", value: "reel" },
  { label: "Selected", value: "projects" },
  { label: "Chrono", value: "year" },
] as const;

export type WorkMode = (typeof WORK_MODES)[number]["value"];
export const DEFAULT_WORK_MODE: WorkMode = "reel";

export type WorkSearchParams = Record<string, string | string[] | undefined>;

export function getWorkMode(sort: WorkSearchParams["sort"]): WorkMode {
  const value = Array.isArray(sort) ? sort[0] : sort;

  return WORK_MODES.some((mode) => mode.value === value)
    ? (value as WorkMode)
    : DEFAULT_WORK_MODE;
}

export function getWorkModeHref(
  searchParams: WorkSearchParams,
  mode: WorkMode
): string {
  const params = new URLSearchParams();

  for (const [name, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        params.append(name, item);
      });
    } else if (value !== undefined) {
      params.set(name, value);
    }
  }

  if (mode === DEFAULT_WORK_MODE) {
    params.delete("sort");
  } else {
    params.set("sort", mode);
  }

  const query = params.toString();
  return query ? `/work?${query}` : "/work";
}
