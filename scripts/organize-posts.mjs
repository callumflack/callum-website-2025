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
const isIgnored = (name) => name.startsWith("_");

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

const ensureDirs = async () => {
  await Promise.all(
    Array.from(new Set(categoryDirMap.values())).map((dir) =>
      fs.mkdir(path.join(postsDir, dir), { recursive: true })
    )
  );
};

const moveFile = async (fromPath, toPath) => {
  try {
    await fs.rename(fromPath, toPath);
    return true;
  } catch (error) {
    if (error.code === "EXDEV") {
      const data = await fs.readFile(fromPath);
      await fs.writeFile(toPath, data);
      await fs.unlink(fromPath);
      return true;
    }
    if (error.code === "EEXIST") {
      return false;
    }
    throw error;
  }
};

const run = async () => {
  await ensureDirs();

  const entries = await fs.readdir(postsDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter(isMdx)
    .filter((name) => !isIgnored(name));

  const moved = [];
  const skipped = [];

  for (const filename of files) {
    const fromPath = path.join(postsDir, filename);
    const content = await fs.readFile(fromPath, "utf8");
    const category = getFrontmatterCategory(content);
    const targetDir = categoryDirMap.get(category);

    if (!targetDir) {
      skipped.push({ filename, reason: "unknown category" });
      continue;
    }

    const toPath = path.join(postsDir, targetDir, filename);
    const didMove = await moveFile(fromPath, toPath);
    if (didMove) {
      moved.push({ filename, targetDir });
    } else {
      skipped.push({ filename, reason: "target exists" });
    }
  }

  console.log("Moved:");
  for (const entry of moved) {
    console.log(`- ${entry.filename} -> ${entry.targetDir}/`);
  }

  if (skipped.length) {
    console.log("\nSkipped:");
    for (const entry of skipped) {
      console.log(`- ${entry.filename} (${entry.reason})`);
    }
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
