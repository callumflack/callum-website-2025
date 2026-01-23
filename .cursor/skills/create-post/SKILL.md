---
name: create-post
description: Create a new MDX post using the repo template and taxonomy.
---

# Create Post

Use this skill when you need a new MDX post scaffolded with the correct
frontmatter and taxonomy.

## Steps

1. Ask for:
   - Title
   - Category: `writing`, `projects`, or `notes`
   - Type (optional): `post`, `page`, `link`, or `index`
2. Convert title to kebab-case for the filename.
3. Copy `.cursor/skills/create-post/assets/template.mdx` to `posts/<slug>.mdx`.
4. Replace `YYYY-MM-DD` with today’s date and `Your Post Title` with the title.
5. Update `category` and `type` in the frontmatter if needed.
