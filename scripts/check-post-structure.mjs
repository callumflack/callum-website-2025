import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();
const postsDir = path.join(root, "posts");
const categoryDirMap = new Map([
  ["writing", "writing"],
  ["projects", "projects"],
  ["notes", "notes"],
  ["page", "pages"],
]);

const isMdx = (name) => name.endsWith(".mdx");
const isIgnoredDir = (name) => name.startsWith("_");

const getFrontmatterCategory = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/m);
  if (!match) return null;
  const lines = match[1].split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("category:")) {
      return trimmed.replace("category:", "").trim();
    }
  }
  return null;
};

const walk = async (dir, results) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (isIgnoredDir(entry.name)) continue;
      await walk(path.join(dir, entry.name), results);
      continue;
    }
    if (!isMdx(entry.name)) continue;
    results.push(path.join(dir, entry.name));
  }
};

const run = async () => {
  const mdxFiles = [];
  await walk(postsDir, mdxFiles);

  const errors = [];

  for (const filePath of mdxFiles) {
    const relative = path.relative(postsDir, filePath);
    const parts = relative.split(path.sep);

    if (parts.length === 1) {
      errors.push({
        file: relative,
        reason: "mdx in posts root",
      });
      continue;
    }

    const content = await fs.readFile(filePath, "utf8");
    const category = getFrontmatterCategory(content);
    const expectedDir = categoryDirMap.get(category);

    if (!category) {
      errors.push({ file: relative, reason: "missing category" });
      continue;
    }

    if (!expectedDir) {
      errors.push({ file: relative, reason: `unknown category: ${category}` });
      continue;
    }

    if (parts[0] !== expectedDir) {
      errors.push({
        file: relative,
        reason: `expected in ${expectedDir}/`,
      });
    }
  }

  if (errors.length) {
    console.error("Post structure check failed:");
    for (const error of errors) {
      console.error(`- ${error.file} (${error.reason})`);
    }
    process.exit(1);
  }

  console.log("Post structure check passed.");
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
