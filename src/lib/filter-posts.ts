import { format, isSameYear, parseISO } from "date-fns";
import { type Post } from "content-collections";
import { featuredWorkSlugs } from "@/data";
import { sortByCustomSlugOrder, sortByDate, sortByTitle } from "./sort-posts";

const publishedPosts = (posts: Post[]) => posts.filter((p) => !p.draft);

// every post
const everyPost = (posts: Post[]) => {
  const P = posts.filter((p) => !p.draft);
  return sortByDate(P);
};

// by title
const postsAZ = (posts: Post[]) => publishedPosts(sortByTitle(posts));
const postsZA = (posts: Post[]) => publishedPosts(sortByTitle(posts, "desc"));

// nav posts
const navPosts = (posts: Post[]) => {
  const home = posts.filter((p) => p.category === "home");
  const about = posts.filter((p) => p.category === "about");

  // const P = posts.filter((p) => !p.draft && p.tags.includes("featured"));
  return [home[0], about[0]];
};

// by featured
// TODO: if using data/featured-posts, delete this & don't use "featured" tag!
const featuredPosts = (posts: Post[]) => {
  const FP = everyPost(posts);
  const P = FP.filter((p) => p.tags && p.tags.includes("featured"));
  return sortByDate(P);
};

const featuredProjectPosts = (posts: Post[]) => {
  const FP = featuredPosts(posts);
  const P = FP.filter((p) => p.category === "projects");
  // return sortByDate(P);
  return sortByCustomSlugOrder(P, featuredWorkSlugs);
};

const featuredWritingPosts = (posts: Post[]) => {
  const FP = featuredPosts(posts);
  const P = FP.filter((p) => p.category === "writing");
  return sortByDate(P);
};

// by category
const postsByCategory = (category: Post["category"], posts: Post[]) => {
  const FP = everyPost(posts);
  const P = FP.filter((p) => p.category === category);
  return sortByDate(P);
};

const postsByCategories = (categories: Post["category"][], posts: Post[]) => {
  const FP = everyPost(posts);
  const P = FP.filter((p) => categories.includes(p.category));
  return sortByDate(P);
};

// by tags
const postsByTag = (posts: Post[], tag: string) => {
  const FP = everyPost(posts);
  const P = FP.filter(
    (p) => p.libraryType === "post" && p.tags && p.tags.includes(tag)
  );
  return sortByDate(P);
};

// by year
const postsByYear = (posts: Post[], date: string) => {
  const FP = everyPost(posts);
  const P = FP.filter(
    (p) =>
      p.libraryType === "post" && isSameYear(parseISO(p.date), parseISO(date))
  );
  return sortByDate(P);
};

// by library type
const supersetPosts = (posts: Post[]) => {
  const LP = postsByCategory("library", posts);
  const P = LP.filter((p) => p.libraryType === "superset");
  return sortByDate(P);
};

const topicPosts = (posts: Post[]) => {
  const LP = postsByCategory("library", posts);
  const P = LP.filter((p) => p.libraryType === "topic");
  return sortByDate(P);
};

const yearPosts = (posts: Post[]) => {
  const LP = postsByCategory("library", posts);
  const P = LP.filter((p) => p.libraryType === "year");
  return sortByDate(P);
};

const notSupersetOrTopicPosts = (posts: Post[]) => {
  const P = everyPost(posts).filter((p) => p.libraryType === "post");
  return sortByDate(P);
};

// Extract tags
export type Tag =
  | "engineering"
  | "teamwork"
  | "featured"
  | "design"
  | "knowhow"
  | "strategy"
  | "book"
  | "creativity";

function extractUniqueTags(posts: Post[]): Tag[] {
  const tagsSet = new Set<Tag>();

  posts.forEach((post) => {
    post.tags &&
      post.tags.forEach((tag) => {
        if (tag) {
          tagsSet.add(tag as Tag);
        }
      });
  });

  return Array.from(tagsSet);
}

// General function to group posts
type GroupedPosts = Record<string, Post[]>;
const groupPosts = (
  posts: Post[],
  getKey: (post: Post) => string | string[]
): GroupedPosts => {
  // Sort the posts by date in descending order (most recent first)
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return sortedPosts.reduce<GroupedPosts>((acc, post) => {
    const keys = getKey(post);
    const keyArray = Array.isArray(keys) ? keys : [keys];

    keyArray.forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- fuck you typescript
      (acc[key] ??= []).push(post);
    });

    return acc;
  }, {});
};

const groupPostsByYear = (posts: Post[]): GroupedPosts => {
  const filteredPosts = posts.filter(
    (post) =>
      !post.draft && post.libraryType !== "year" && post.libraryType !== "hide"
  );
  return groupPosts(filteredPosts, (post) =>
    format(new Date(post.date), "yyyy")
  );
};

const groupPostsByTag = (posts: Post[]): Record<string, Post[]> => {
  const filteredPosts = posts.filter(
    (post) =>
      !post.draft &&
      !post.title.startsWith("20") &&
      post.category !== "about" &&
      post.libraryType !== "topic" &&
      post.libraryType !== "superset" &&
      post.libraryType !== "hide"
  );
  const grouped = groupPosts(filteredPosts, (post) => post.tags ?? []);

  delete grouped.featured;
  return grouped;
};

export {
  everyPost,
  extractUniqueTags,
  featuredPosts,
  featuredProjectPosts,
  featuredWritingPosts,
  groupPosts,
  groupPostsByTag,
  groupPostsByYear,
  navPosts,
  notSupersetOrTopicPosts,
  postsAZ,
  postsByCategories,
  postsByCategory,
  postsByTag,
  postsByYear,
  postsZA,
  supersetPosts,
  topicPosts,
  yearPosts,
};

export type { GroupedPosts };
