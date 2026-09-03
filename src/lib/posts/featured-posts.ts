/*
 * Editor-curated slug lists. Order = render order.
 *
 *   featuredWorkSlugs    → work Reel (default tab) and work/gallery Selected
 *                          via sortSelectedPosts(). Selected then appends any
 *                          extra projects tagged `featured`.
 *   featuredWritingSlugs → writing Selected via sortSelectedPosts(), same
 *                          featured-tag tail.
 *
 * Do not import this module into MDX: Content Collections would snapshot the
 * arrays at compile time. Live home (`posts/pages/home.mdx`) inlines its own
 * ZoomCarousel / StoryPostList slugs — keep those arrays in sync by hand.
 * Work currently matches; writing home omits ways-of-seeing-generative-ai.
 */

export const featuredWorkSlugs = [
  "vana-2025",
  "kalaurie",
  "the-library-of-economic-possibility",
  "open-data-labs",
  "vana",
  "replier",
  "studio-round",
  "themes-for-shadcnblocks",
  "anchor-ceramics",
  "breaka",
];

export const featuredWritingSlugs = [
  "you-cant-design-a-ui-without-designing-the-code",
  "the-instantaneous-language-of-beauty",
  "the-matter-of-taste",
  "ways-of-seeing-generative-ai",
  "creativity-starts-with-love-and-theft",
  "answerable-vocabulary-for-llm-work",
];
