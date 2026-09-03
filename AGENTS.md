# AGENTS.md

Personal Next.js 16 site. Bun. Content Collections, not Contentlayer. Do not add UI libraries.

**Code is the source of truth.** Live files under `src/`, `posts/`, and `content-collections.ts` win. `docs/` is a lab notebook, not a handbook. Filenames with a `YYMMDD-` prefix, and everything in `docs/plans/`, are dated snapshots. They drift. Read them for intent, then confirm the claim in the live file before following it. If a doc and the code disagree, follow the code. Do not implement a plan unless asked.

Read the live file before inventing a parallel type, token, route, or media component.

## Run

- Package manager is bun. Lockfile is `bun.lock`.
- `bun dev`, `bun lint`, `bunx tsc --noEmit` (no typecheck script).
- After new MDX, `bun check-posts`.

## Content

- Files live in `posts/{writing,projects,notes,pages,shelf}/` matching frontmatter `category`. `category: page` goes in `posts/pages/`.
- Schema is `content-collections.ts`. Types are `src/types/content.ts`. Do not invent `Asset` variants.
- Category is domain. Type is format (`post` default, `page`, `link`). `log` is a view at `/log`, not a category. `type: index` is unused.
- Slug is the filename. Folders are not URL segments. Reserved slug `home`. About, letters, and now are `[slug]` posts, not route files.
- `_*.mdx` and `_archive/` never enter the collection. `draft: true` stays in `allPosts`, hidden in prod.
- Frontmatter `assets` are thumbs, OG, and story slides. Article media is MDX `<Image>` / `<Video>`. Aspect is pixel `"1728-1080"`, not `"16-9"`. No markdown images.
- Upload new video files to Bunny Storage with `bun media:upload <local-file> [--to <remote-path>]`. Configuration lives in ignored `.env.local`; never print or commit `BUNNY_STORAGE_API_KEY`. The command refuses existing remote paths unless explicitly given `--force`, verifies Bunny's stored checksum and size, and checks CDN delivery. Prefer immutable video filenames. This uploader is for video only; keep image assets on the existing image workflow.
- `thumbnailLink` makes a link-out card. `type: link` does not.
- List UIs take `PostListItem` via `toPostListItem`. Do not pass compiled `Post.content` to client lists.
- Home is `src/app/page.tsx` + `posts/pages/home.mdx`. Ignore `src/app/(home)/home-page.tsx`. Do not add `src/app/(home)/page.tsx`. Do not copy old homes into `src/`.

## UI

- `cn()` from `src/lib/utils.ts`. Impl is `src/lib/classes.ts`. No `cx`.
- Type roles are `text-fine|pill|meta|body|heading|title` only. `--text-*: initial` and `--color-*: initial` wipe `text-sm` and `bg-gray-*`.
- New token names go in `src/styles/tokens-semantic.css` and `src/lib/classes.ts`.
- MDX look is `src/components/mdx/mdx.css`. `mdx-components.tsx` is mapping. `mdx-prose.tsx` is a `.Prose` wrapper.
- MDX media is `ZoomableImage` / `ZoomableVideo` in `src/components/mdx/mdx-media.tsx` → `zoomable-02.tsx`. Never import `src/components/media/legacy/`.
- Chrome is `PageWrapper` → optional `PageInner`. Live nav is `HomeButton`, not `Nav`. New indexes go in `src/app/<route>/` with `_components/` (copy `work/` or `gallery/`). Sticky indexes are `PageInner variant="indexSticky"` with a single-line title.
- Do not install new shadcn into `src/components/ui`.

## Next

- App Router under `src/app`. `params` / `searchParams` are `Promise`s. Await them. `cacheComponents` is on.
- Copy work's RSC `searchParams` + `<Link>` for new indexes, not writing's client `useIndexMode`.
- Do not enable view transitions unless asked.

## When needed

Open the live file. Dated docs next to it are intent only. Confirm before following.

- Schema / types: `content-collections.ts`, `src/types/content.ts`
- Queries / list payload: `src/lib/posts/actions.ts`
- New post: `.agents/skills/create-post/SKILL.md`, then put the file in the category folder (the skill still writes posts root). `bun organize-posts` does not know `shelf`.
- Chrome / indexes: `src/components/page/page-wrapper.tsx`, `src/app/work/`
- Home: `src/app/page.tsx`, `posts/pages/home.mdx`
- Tokens / `cn`: `src/styles/tokens-semantic.css`, `src/lib/classes.ts`
- Type roles: `src/components/atoms/text.tsx` (intent snapshot: `docs/typography.md`)
- MDX: `src/components/mdx/mdx.css`, `mdx-components.tsx`, `mdx-media.tsx`
- Video upload: `scripts/upload-media.mjs`; run `bun media:upload <local-file>`. Add `--poster <public-path> --aspect <width-height>` together when a paste-ready `<Video>` snippet is useful.
- Flex / sticky bugs: `src/styles/_CSS-GOTCHAS.md`
- Cache Components: `.agents/skills/next-cache-components/SKILL.md`
- Next conventions: `.agents/skills/next-best-practices/SKILL.md`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
