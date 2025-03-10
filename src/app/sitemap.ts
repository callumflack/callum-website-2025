import type { MetadataRoute } from "next";
import config from "@/config";
import { allPosts } from "content-collections";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return Promise.resolve([
    {
      url: config.PUBLIC_URL,
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
    {
      url: `${config.PUBLIC_URL}/feed`,
      lastModified: new Date(),
    },
    {
      url: `${config.PUBLIC_URL}/what-i-want`,
      lastModified: new Date(),
    },
    // about is handled as a post
    ...allPosts.map((post) => ({
      url: `${config.PUBLIC_URL}/${post._meta.path}`,
      lastModified: new Date(),
    })),
  ]);
}
