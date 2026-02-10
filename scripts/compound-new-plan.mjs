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
  const rawSlug = process.argv[2] ?? "new-feature";
  const slug = toSlug(rawSlug);
  const date = toDatePrefix();
  const filename = `${date}-${slug}.md`;
  const root = process.cwd();
  const target = path.join(root, "docs", "plans", filename);

  const content = `# ${filename.replace(".md", "")}

## Goal

What gets built and for whom.

## Constraints

Technical, product, and timeline constraints.

## Existing patterns

Relevant files and patterns to follow.

## Proposed approach

Implementation steps and file touch list.

## Edge cases

Known failure modes and handling.

## Validation checklist

- [ ] \`bun run check:all\`
- [ ] Manual verification for changed flow

## Out of scope

Explicitly excluded items.
`;

  await fs.mkdir(path.dirname(target), { recursive: true });

  try {
    await fs.access(target);
    console.error(`Plan already exists: ${path.relative(root, target)}`);
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
