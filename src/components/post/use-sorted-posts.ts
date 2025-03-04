"use client";

import { useMemo } from "react";

// import { allPosts } from "content-collections";
// import {
//   everyPost,
//   featuredProjectPosts,
//   featuredWritingPosts,
//   groupPostsByTag,
//   groupPostsByYear,
//   postsAZ,
//   postsByCategory,
// } from "@/lib/filter-posts";

// const validPosts = Array.isArray(allPosts) ? allPosts : [];
// const posts = everyPost(validPosts).filter(
//   (post) => post.libraryType === "post"
// );

// const writing = postsByCategory("writing", posts);
// const projects = postsByCategory("projects", posts);

export type PostsKind = "projects" | "writing";

// export const useSortedPosts = (kind: PostsKind) => {Perhaps let's start again.
//   return useMemo(
//     () => ({
//       [kind]: kind === "projects" ? projects : writing,
//       projects: featuredProjectPosts(kind === "projects" ? projects : writing),
//       writing: featuredWritingPosts(kind === "projects" ? projects : writing),
//       year: groupPostsByYear(kind === "projects" ? projects : writing),
//       topic: groupPostsByTag(kind === "projects" ? projects : writing),
//       "a-to-z": postsAZ(kind === "projects" ? projects : writing),
//       // chrono: kind === "projects" ? projects : writing,
//     }),
//     [kind]
//   );
// };

// export const useSortedPosts = (kind: PostsKind) => {
//   return useMemo(() => {
//     const currentPosts = posts[kind] || [];
//     return {
//       [kind]: currentPosts,
//       projects: currentPosts,
//       writing: currentPosts,
//       year: {}, // stub for now
//       topic: {}, // stub for now
//       "a-to-z": [...currentPosts].sort((a, b) =>
//         a.title.localeCompare(b.title)
//       ),
//     };
//   }, [kind]);
// };
