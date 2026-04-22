/*
 * Editor-curated slug lists for the site's featured surfaces.
 *
 * These drive both the HOME page sections and the "Selected" sort option on
 * index pages (work, writing, gallery). Order in each array = render order.
 *
 * Home surfaces:
 *   featuredWorkSlugs    → "Selected Work" carousel (ZoomCarousel).
 *   featuredWritingSlugs → "Selected Writing" blocks.
 *   featuredNotesSlugs   → Grid-mode only (GRID_TOGGLE_ENABLED feature flag).
 *   homeLatest           → "Latest" section: pin + exclude + row limit.
 *
 * Gallery/work/writing reuse: featuredWorkSlugs and featuredWritingSlugs are
 * also read by sortSelectedPosts() for the "Selected" sort mode — that's why
 * they live here and not in a home-only module.
 */

export const featuredWorkSlugs = [
  "kalaurie",
  "the-library-of-economic-possibility",
  "vana",
  "replier",
  "studio-round",
];

export const featuredWritingSlugs = [
  // "organising-design-system-styles",
  "ways-of-seeing-generative-ai",
  "the-instantaneous-language-of-beauty",
  "the-matter-of-taste",
  "creativity-starts-with-love-and-theft",
];

export const featuredNotesSlugs = [
  "notes-on-coding-with-llms",
  "notes-on-deciphering-sun-tzu",
];

/*
 * Home "Latest" section configuration.
 *
 * The section is labelled chronological but editor-pinnable. `pinned` slugs
 * are forced to the top in array order, then the remaining feed fills in by
 * date desc, capped to `limit`.
 *
 * `exclude` removes slugs that exist as posts but are not part of the dated
 * writing feed (personal pages, pitch pages, etc).
 */
export const homeLatest = {
  pinned: ["you-cant-design-a-ui-without-designing-the-code"],
  exclude: ["the-work-and-team-im-after", "about", "letters"],
  limit: 3,
} as const;
