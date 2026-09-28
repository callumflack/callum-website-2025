const staticPageSlugs = new Set(["home", "writing"]);

export function isStaticPageSlug(slug: string): boolean {
  return staticPageSlugs.has(slug);
}
