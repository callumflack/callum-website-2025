"use server";

const USER = "callumflack";
const REPO = "cw-next";

/**
 * Generates a GitHub new issue URL with file path in body
 */
export async function getGithubIssueUrl(slug: string): Promise<string> {
  const filePath = `posts/${slug}.mdx`;
  const title = encodeURIComponent(`Comment on ${slug}`);
  const body = encodeURIComponent(`File: ${filePath}\n\nThoughts: `);

  return `https://github.com/${USER}/${REPO}/issues/new?title=${title}&body=${body}`;
}

/**
 * Generates a raw GitHub URL for a post's markdown source file.
 * `filePath` is the content-collections _id (e.g. "notes/foo.mdx").
 */
export async function getGithubRawUrl(filePath: string): Promise<string> {
  return `https://raw.githubusercontent.com/${USER}/${REPO}/refs/heads/main/posts/${filePath}`;
}
