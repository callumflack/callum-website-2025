import { compareAsc, compareDesc } from "date-fns";
import { type Post } from "content-collections";

const sortByDate = (posts: Post[], order: "asc" | "desc" = "desc"): Post[] => {
  const compareFn = order === "asc" ? compareAsc : compareDesc;

  return [...posts].sort((a, b) => {
    return compareFn(new Date(a.date), new Date(b.date));
  });
};

const sortByTitle = (posts: Post[], order: "asc" | "desc" = "asc"): Post[] => {
  return [...posts].sort((a, b) => {
    if (order === "asc") {
      return a.title.localeCompare(b.title);
    }
    return b.title.localeCompare(a.title);
  });
};

const sortByCustomTitleOrder = (posts: Post[], titles: string[]): Post[] => {
  return posts.sort((a, b) => {
    const aIndex = titles.indexOf(a.title);
    const bIndex = titles.indexOf(b.title);

    // If both posts are in the titles array, sort them based on their index
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    // If a post is not in the titles array, move it to the end
    if (aIndex === -1) {
      return 1;
    }
    if (bIndex === -1) {
      return -1;
    }

    // If both posts are not in the titles array, keep their original order
    return 0;
  });
};

const sortByCustomSlugOrder = (posts: Post[], customSlugOrder: string[]) => {
  return posts.sort((a, b) => {
    const indexA = customSlugOrder.indexOf(a.slug);
    const indexB = customSlugOrder.indexOf(b.slug);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
};

// alternate method for sortByCustomTitleOrder
const sortPostsByTitles = (posts: Post[], titles: string[]): Post[] => {
  // First, create a new array containing only the posts that are in the titles array
  const sortedPosts = titles
    .map((title) => posts.find((post) => post.title === title))
    .filter((post): post is Post => post !== undefined);

  // Then, add the posts that are not in the titles array to the end of the sortedPosts array
  const remainingPosts = posts.filter((post) => !titles.includes(post.title));
  return [...sortedPosts, ...remainingPosts];
};

export {
  sortByCustomTitleOrder,
  sortByDate,
  sortByTitle,
  sortPostsByTitles,
  sortByCustomSlugOrder,
};
