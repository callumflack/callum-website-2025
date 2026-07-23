import { allPosts } from "content-collections";
import { cacheLife } from "next/cache";

async function buildPostsJson(): Promise<string> {
  "use cache";
  cacheLife("days");
  return JSON.stringify(allPosts);
}

export async function GET() {
  const body = await buildPostsJson();
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
