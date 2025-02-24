import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import smartypants from "remark-smartypants";
import readingTime from "reading-time";

import { exec as execCallback } from "child_process";
import util from "util";

const exec = util.promisify(execCallback);

/*
  See: https://www.content-collections.dev/docs/configuration
  Uses: https://github.com/kentcdodds/mdx-bundler
  Set any plugins in next.config.ts withMdX?
  Plugins:
    remark-smartypants (translates plain ASCII punctuation characters into “smart” typographic punctuation HTML entities): https://github.com/remarkjs/remark-smartypants
    remark-gfm (autolink literals, footnotes, strikethrough, tables, tasklists): https://github.com/remarkjs/remark-gfm
 */

enum Category {
  WRITING = "writing",
  PROJECTS = "projects",
  LIBRARY = "library",
  HOME = "home",
  ABOUT = "about",
  CONTENT = "content",
}

const posts = defineCollection({
  name: "posts",
  directory: "src/posts",
  include: "**/*.mdx",
  // exclude: ["**/*.json"],
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
    category: z.enum([
      Category.WRITING,
      Category.PROJECTS,
      Category.LIBRARY,
      Category.HOME,
      Category.ABOUT,
      Category.CONTENT,
    ]),
    tags: z.array(z.string()).optional(),
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

    const content = await compileMDX(ctx, post, {
      remarkPlugins: [smartypants],
    });

    const readingStats = readingTime(content);

    return {
      ...post,
      _id: post._meta.filePath,
      // or post._meta.path?
      slug: post.title.toLowerCase().replace(/ /g, "-"),
      readingTime: readingStats.text,
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
