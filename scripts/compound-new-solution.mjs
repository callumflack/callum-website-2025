import { promises as fs } from "fs";
import path from "path";

function toDatePrefix() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

function toSlug(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function run() {
  const rawSlug = process.argv[2] ?? "new-solution";
  const slug = toSlug(rawSlug);
  const date = toDatePrefix();
  const filename = `${date}-${slug}.md`;
  const root = process.cwd();
  const target = path.join(root, "docs", "solutions", filename);

  const content = `---
tags: []
impact: medium
prevents: ""
---

# ${filename.replace(".md", "")}

## Context

What failed or what was needed.

## Root cause

Why the issue occurred.

## Final fix

What changed.

## Why this approach

Trade-offs and reason for selection.

## Validation run

- [ ] \`bun run check:all\`
- [ ] Targeted runtime/manual checks

## Reusable rule extracted

Instruction to add to \`AGENTS.md\` if broadly useful.

## Follow-ups

Optional deferred improvements.
`;

  await fs.mkdir(path.dirname(target), { recursive: true });

  try {
    await fs.access(target);
    console.error(`Solution already exists: ${path.relative(root, target)}`);
    process.exit(1);
  } catch {
    // expected when file does not exist
  }

  await fs.writeFile(target, content, "utf8");
  console.log(`Created ${path.relative(root, target)}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
