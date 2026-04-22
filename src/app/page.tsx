import { Suspense } from "react";
import {
  featuredNotesSlugs,
  featuredWorkSlugs,
  featuredWritingSlugs,
  homeLatest,
} from "@/lib/posts/featured-posts";
import {
  filterFeaturedBySlugs,
  getLatestWithPins,
} from "@/lib/posts/sorting";
import { allPosts, type Post } from "content-collections";
import { GRID_TOGGLE_ENABLED, HomePage } from "./(home)/home-page";
import { HomeLayoutShell } from "./(home)/home-layout-shell";

/*
 * Home-page assembly.
 *
 * Curation (which slugs appear, in what order, what's excluded/pinned) lives
 * in `lib/posts/featured-posts.ts`. This file only reads those lists and
 * arranges them into the page sections:
 *
 *   Latest         → homeLatest (date-sorted + pins + excludes)
 *   Selected Work  → featuredWorkSlugs
 *   Selected Writing → featuredWritingSlugs
 *   Grid mode      → work × writing (interleaved) + notes (flag-gated)
 */

function dedupeBySlug(posts: Post[]): Post[] {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.slug)) return false;
    seen.add(post.slug);
    return true;
  });
}

function interleave(primary: Post[], secondary: Post[]): Post[] {
  const out: Post[] = [];
  const max = Math.max(primary.length, secondary.length);
  for (let i = 0; i < max; i += 1) {
    if (primary[i]) out.push(primary[i]);
    if (secondary[i]) out.push(secondary[i]);
  }
  return out;
}

export default function Home() {
  const visiblePosts = allPosts.filter((post) => !post.draft);

  const latestPosts = getLatestWithPins(allPosts, homeLatest);
  const projects = filterFeaturedBySlugs(visiblePosts, featuredWorkSlugs);
  const writing = filterFeaturedBySlugs(visiblePosts, featuredWritingSlugs);
  const notes = filterFeaturedBySlugs(visiblePosts, featuredNotesSlugs);
  const featuredGridPosts = dedupeBySlug([
    ...interleave(projects, writing),
    ...notes,
  ]);

  const defaultTree = (
    <HomePage
      latestPosts={latestPosts}
      projects={projects}
      writing={writing}
      featuredGridPosts={featuredGridPosts}
      layout="default"
    />
  );

  if (!GRID_TOGGLE_ENABLED) {
    return defaultTree;
  }

  const gridTree = (
    <HomePage
      latestPosts={latestPosts}
      projects={projects}
      writing={writing}
      featuredGridPosts={featuredGridPosts}
      layout="grid"
    />
  );

  /*
   * Suspense is required because HomeLayoutShell calls useSearchParams(),
   * which triggers a client-side rendering bailout. The fallback renders the
   * default tree so the prerendered HTML shows the right content on first
   * paint; the shell hydrates, reads ?layout=, and may flip to grid.
   */
  return (
    <Suspense fallback={defaultTree}>
      <HomeLayoutShell defaultSlot={defaultTree} gridSlot={gridTree} />
    </Suspense>
  );
}
