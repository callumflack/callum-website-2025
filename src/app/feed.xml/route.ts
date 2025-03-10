import { Feed } from "feed";
import config from "@/config";
import { allPosts } from "content-collections";
import { isVideoFile } from "@/components/media/utils";

/* 
  https://github.com/jpmonette/feed
  
  You also may want to limit how many posts you include in this feed, as with a lot of posts, this can get pretty large, so consider only requesting a certain amount of posts for each time the feed is generated. https://spacejelly.dev/posts/how-to-add-a-sitemap-rss-feed-in-next-js-app-router

  Consider caching these feeds: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching
 */

export async function GET() {
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
      // content: post.plainContent,
      image: post.assets?.[0]?.src
        ? isVideoFile(post.assets[0].src)
          ? post.assets[0].src
          : `${config.PUBLIC_URL}${post.assets[0].src}`
        : "",
      author: [{ name: "Callum Flack" }],
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
