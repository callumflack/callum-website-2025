import { Feed } from "feed";
import { cacheLife } from "next/cache";
import config from "@/config";
import { allPosts } from "content-collections";
import { isVideoFile } from "@/components/media/media-utils";

async function buildFeedXml(): Promise<string> {
  "use cache";
  cacheLife("days");

  const feed = new Feed({
    title: "Callum Flack",
    description: "Designer who codes. Writes about creativity and process.",
    id: config.PUBLIC_URL,
    link: config.PUBLIC_URL,
    copyright: `${new Date().getFullYear()} Callum Flack`,
    favicon: `${config.PUBLIC_URL}/favicon.ico`,
    language: "en",
    updated: new Date(),
    feedLinks: {
      json: `${config.PUBLIC_URL}/feed.json`,
      atom: `${config.PUBLIC_URL}/feed.xml`,
    },
  });

  allPosts.map((post) => {
    feed.addItem({
      title: post.title,
      id: `${config.PUBLIC_URL}/${post.slug}`,
      link: `${config.PUBLIC_URL}/${post.slug}`,
      date: new Date(post.date),
      description: post.summary,
      image: post.assets?.[0]?.src
        ? isVideoFile(post.assets[0].src)
          ? post.assets[0].src
          : `${config.PUBLIC_URL}${post.assets[0].src}`
        : "",
      author: [{ name: "Callum Flack" }],
    });
  });

  return feed.rss2();
}

export async function GET() {
  const xml = await buildFeedXml();
  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
