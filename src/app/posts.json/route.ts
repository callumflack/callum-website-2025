import { cacheLife } from "next/cache";
import { getPublishedPosts } from "@/lib/posts/actions";

async function buildPostsJson(): Promise<string> {
  "use cache";
  cacheLife("days");
  return JSON.stringify(getPublishedPosts());
}

export async function GET() {
  const body = await buildPostsJson();
  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
