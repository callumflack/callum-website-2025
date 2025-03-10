import { allPosts } from "content-collections";

export async function GET() {
  return new Response(JSON.stringify(allPosts), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
