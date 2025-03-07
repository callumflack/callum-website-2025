"use server";

import type { Post } from "content-collections";

/**
 * Generates a raw GitHub URL for a post's markdown file
 */
export async function getGithubRawUrl(
  slug: string,
  post?: Post
): Promise<string> {
  // GitHub repository details
  const user = "callumflack"; // GitHub username
  const repo = "cw-next"; // Repository name
  const contentDir = "posts"; // Directory containing content

  // Might need to do this in future… leaving here as a trail…
  // Construct path based on post category if available
  // let contentPath = contentDir;

  // if (post?.category) {
  //   // Map category to directory name
  //   const categoryDir = post.category.toString().toLowerCase();
  //   contentPath = `${contentPath}/${categoryDir}`;
  // }

  // https://raw.githubusercontent.com/callumflack/cw-next/refs/heads/main/posts/kalaurie-outdoor-campaign.mdx
  const rawUrl = `https://raw.githubusercontent.com/${user}/${repo}/refs/heads/main/${contentDir}/${slug}.mdx`;

  return rawUrl;
}
