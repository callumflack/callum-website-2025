import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { exec as execCallback } from "child_process";
import readingTime from "reading-time";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import util from "util";
import { getImageDimensions } from "./src/components/media/media-utils";
import { Category, LibraryType } from "./src/types/content";

const exec = util.promisify(execCallback);

/*
  See: https://www.content-collections.dev/docs/configuration
  Uses: https://github.com/kentcdodds/mdx-bundler
  Set any plugins in next.config.ts withMdX?
  Plugins: 
    remark-smartypants (translates plain ASCII punctuation characters into "smart" typographic punctuation HTML entities): https://github.com/remarkjs/remark-smartypants
    remark-gfm (autolink literals, footnotes, strikethrough, tables, tasklists): https://github.com/remarkjs/remark-gfm
 */

export const posts = defineCollection({
  name: "posts",
  directory: "posts",
  include: "**/*.mdx",
  exclude: ["_*.mdx", "_*/**"], // excludes _TEMPLATE and _leftovers dir
  schema: (z) => ({
    draft: z.boolean().optional(),
    date: z.string(),
    endDate: z.string().optional(),
    projectIsOngoing: z.boolean().optional(),
    lastEditedDate: z.string().optional(),
    showAsNew: z.boolean().optional(),
    title: z.string(),
    linkTitle: z.string().optional(), // optional link title, to shorten post titles in UI
    summary: z.string(),
    libraryType: z
      .enum([
        LibraryType.SUPERSET,
        LibraryType.TOPIC,
        LibraryType.YEAR,
        LibraryType.POST,
        LibraryType.HIDE,
      ])
      .optional()
      .default(LibraryType.POST),
    category: z.enum([
      Category.WRITING,
      Category.PROJECTS,
      Category.LIBRARY,
      Category.HOME,
      Category.ABOUT,
      Category.CONTENT,
      Category.NOTE,
    ]),
    tags: z.array(z.string()).optional(),
    nextPostLink: z.string().optional(),
    thumbnailLink: z.string().optional(), // External link used on thumbnails. If present, the UI does not link to the Post page
    projectLink: z.string().optional(),
    tweet: z.string().optional(),
    assets: z
      .array(
        z.object({
          src: z.string(),
          poster: z.string().optional(),
          alt: z.string(),
          aspect: z.string(),
        })
      )
      .optional(),
  }),
  transform: async (post, ctx) => {
    const lastModified = await ctx.cache(
      post._meta.filePath,
      async (filePath) => {
        const { stdout } = await exec(`git log -1 --format=%ai -- ${filePath}`);
        if (stdout) {
          return new Date(stdout.trim()).toISOString();
        }
        return new Date().toISOString();
      }
    );

    // Process assets to enrich with dimensions and normalized aspect ratios
    if (post.assets) {
      post.assets = post.assets.map((asset) => {
        const { width, height, aspectRatioNumber } = getImageDimensions(
          asset.aspect
        );

        return {
          ...asset,
          // Keep the original aspect value for reference
          aspect: asset.aspect,
          // Add calculated properties as a dimensions object
          dimensions: { width, height, aspectRatioNumber },
        };
      });
    }

    const content = await compileMDX(ctx, post, {
      remarkPlugins: [smartypants, remarkGfm],
    });

    const readingStats = readingTime(content);

    return {
      ...post,
      _id: post._meta.filePath,
      // slug: post.title.toLowerCase().replace(/ /g, "-"),
      slug: post._meta.path,
      readingTime: readingStats.minutes,
      lastModified,
      content,
    };
  },
  // can be used to index the documents or to log messages
  onSuccess: (posts) => {
    console.log(`generated collection with ${posts.length}`);
  },
});

export default defineConfig({
  collections: [posts],
});
