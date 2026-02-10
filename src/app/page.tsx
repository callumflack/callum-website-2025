import {
  featuredNotesSlugs,
  featuredWorkSlugs,
  featuredWritingSlugs,
} from "@/lib/posts/featured-posts";
import { filterFeaturedBySlugs } from "@/lib/posts/sorting";
import type { SearchParams } from "@/types/search-params";
import { allPosts, type Post } from "content-collections";
import { HomePage } from "./(home)/home-page";

const getFeaturedProjects = (): Post[] => {
  const visiblePosts = allPosts.filter((post) => !post.draft);
  return filterFeaturedBySlugs(visiblePosts, featuredWorkSlugs);
};

const getFeaturedWriting = (): Post[] => {
  const visiblePosts = allPosts.filter((post) => !post.draft);
  return filterFeaturedBySlugs(visiblePosts, featuredWritingSlugs);
};

const getFeaturedNotes = (): Post[] => {
  const visiblePosts = allPosts.filter((post) => !post.draft);
  return filterFeaturedBySlugs(visiblePosts, featuredNotesSlugs);
};

function dedupePostsBySlug(posts: Post[]): Post[] {
  const seenSlugs = new Set<string>();

  return posts.filter((post) => {
    if (seenSlugs.has(post.slug)) return false;
    seenSlugs.add(post.slug);
    return true;
  });
}

function interleavePosts(primary: Post[], secondary: Post[]): Post[] {
  const maxLength = Math.max(primary.length, secondary.length);
  const combined: Post[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    const primaryPost = primary[index];
    const secondaryPost = secondary[index];

    if (primaryPost) combined.push(primaryPost);
    if (secondaryPost) combined.push(secondaryPost);
  }

  return combined;
}

type HomeLayout = "default" | "grid";

function getLayout(searchParams: SearchParams): HomeLayout {
  const layoutParam = searchParams.layout;
  const layoutValue = Array.isArray(layoutParam) ? layoutParam[0] : layoutParam;

  return layoutValue === "grid" ? "grid" : "default";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const layout = getLayout(resolvedSearchParams);
  const pinnedLatestSlugs = ["ways-of-seeing-generative-ai"];
  const filteredPosts = allPosts.filter(
    (post) =>
      !post.draft &&
      // or post.category === about
      post.slug !== "the-work-and-team-im-after" &&
      post.slug !== "about" &&
      post.slug !== "letters"
  );

  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const pinnedLatestPosts = pinnedLatestSlugs
    .map((slug) => sortedPosts.find((post) => post.slug === slug))
    .filter(Boolean) as Post[];
  const remainingPosts = sortedPosts.filter(
    (post) => !pinnedLatestSlugs.includes(post.slug)
  );
  const latestPosts = [...pinnedLatestPosts, ...remainingPosts].slice(0, 3);

  const projects = getFeaturedProjects();
  const writing = getFeaturedWriting();
  const notes = getFeaturedNotes();
  const featuredGridPosts = dedupePostsBySlug([
    ...interleavePosts(projects, writing),
    ...notes,
  ]);

  return (
    <HomePage
      latestPosts={latestPosts}
      projects={projects}
      writing={writing}
      featuredGridPosts={featuredGridPosts}
      layout={layout}
    />
  );
}
