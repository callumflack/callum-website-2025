# The Stack

Next.js, TailwindCSS, Shadcn/UI, TypeScript, React, Node.js, Vercel

Video CDN = Bunny.net

## Design snapshots

Each past homepage design is tagged at the commit where it was last live. The
tag is the real thing — old components, old tokens, old content, old lockfile.

| Tag | Design | Live | Deployed example |
| --- | --- | --- | --- |
| `home-2508` | ZoomCarousel, latest/work/writing sections | ~Apr 2025 – Feb 2026 | — |
| `home-2604` | Grid-view toggle redesign (#8) | Apr 2026 – Jul 2026 | [preview](https://callum-website-2025-co1gns76r-callums-projects-ad2d654c.vercel.app/) |
| `home-2607` | Featured card + "Start here"/"Recent" tabs | Jul 2026 – Aug 2026 | [preview](https://callum-website-2025-4zov99inr-callums-projects-ad2d654c.vercel.app/) |

The deployed examples are Vercel preview URLs — the quickest way to look at a
past design without checking anything out.

Run one in its own worktree, without disturbing the current checkout:

```bash
git worktree add ../callum-home-2604 home-2604
```

Then install that commit's dependencies and start it on a free port:

```bash
cd ../callum-home-2604 && bun install && bun dev --port 3001
```

Remove it when finished:

```bash
git worktree remove ../callum-home-2604
```

No archived homepage code is kept in `src/`. Copying old pages forward doesn't
reproduce them — global CSS, design tokens and post content are app-wide, so an
in-repo copy renders old markup against today's everything. The tags and the
preview URLs are the only faithful record.

Note the `home-2604` grid view shipped behind `GRID_TOGGLE_ENABLED = false` in
`src/app/(home)/home-page.tsx`, so the toggle is hidden. Flip it to `true` in a
worktree to reach the toggle and `?layout=grid`.

## Experiments

- [Hi Poster](https://github.com/callumflack/callum-website-2025/tree/hiposter-experiment): WIP, execution sucks
