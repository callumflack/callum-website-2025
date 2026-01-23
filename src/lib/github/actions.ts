"use server";

/**
 * Generates a GitHub new issue URL with file path in body
 */
export async function getGithubIssueUrl(slug: string): Promise<string> {
  const user = "callumflack"; // GitHub username
  const repo = "cw-next"; // Repository name
  const filePath = `posts/${slug}.mdx`;
  const title = encodeURIComponent(`Comment on ${slug}`);
  const body = encodeURIComponent(`File: ${filePath}\n\nThoughts: `);

  const issueUrl = `https://github.com/${user}/${repo}/issues/new?title=${title}&body=${body}`;

  return issueUrl;
}
