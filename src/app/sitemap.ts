import type { MetadataRoute } from "next";
import config from "@/config";
import { allPosts } from "content-collections";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Extract all unique topics from posts
  const allTopics = new Set<string>();
  allPosts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        if (tag !== "featured") {
          allTopics.add(tag);
        }
      });
    }
  });

  return Promise.resolve([
    {
      url: config.PUBLIC_URL,
      lastModified: new Date(),
    },
    {
      url: `${config.PUBLIC_URL}/log`,
      lastModified: new Date(),
    },
    {
      url: `${config.PUBLIC_URL}/work`,
      lastModified: new Date(),
    },
    {
      url: `${config.PUBLIC_URL}/writing`,
      lastModified: new Date(),
    },
    {
      url: `${config.PUBLIC_URL}/gallery`,
      lastModified: new Date(),
    },
    ...allPosts.map((post) => ({
      url: `${config.PUBLIC_URL}/${post._meta.path}`,
      lastModified: new Date(),
    })),
    {
      url: `${config.PUBLIC_URL}/topic`,
      lastModified: new Date(),
    },
    // Add sitemap entries for all topics
    ...Array.from(allTopics).map((topic) => ({
      url: `${config.PUBLIC_URL}/topic/${topic}`,
      lastModified: new Date(),
    })),
  ]);
}
