# Homepage story — statement of work
Status: proposed for review. No implementation authorised yet.
## Decision
Replace the homepage's featured post plus `Start here / Recent` switcher with one authored, work-first story. Keep `Start here` as a non-interactive designator on the existing hinge. Keep `Projects` and `Writing` as ordinary links on its right. The page should make one thing memorable:

> Callum carries difficult product ideas across language, interaction, and code until they become coherent working things. That breadth shortens feedback loops; his judgment raises the quality of the result. Reader outcome:

- 90-second skim: current Vana work, first-commit-to-sale ownership, design-in-code position, range, judgment, LLM direction, contact.
  
- 5–10-minute read: the evidence and connective argument behind those claims.
  
- Final action: remember Callum for high-agency design engineering; open a project/post; subscribe or get in touch.
  
## Source truth
Current, checked 4 August 2026:

- `src/app/page.tsx` owns the live homepage. It renders `Intro`, one `FeaturedCard`, the client-side `HomeIndex`, and `NewsletterSubscribe`.
  
- `src/app/(home)/home-index.tsx` owns the `Start here / Recent` state plus the `Projects / Writing` hinge.
  
- `content-collections.ts` compiles all `posts/**/*.mdx`; `page` is already a supported category and type.
  
- `src/components/mdx/mdx-components.tsx` is the MDX component map. Its contract is mapping/logic only, not styling.
  
- `src/components/mdx/mdx.tsx` renders compiled Content Collections MDX through that map.
  
- The worktree is dirty with user-owned homepage, slug-page, button, newsletter, export, token, and reference-image work. Execution must preserve it.
  
- The [Jenny Wen homepage](https://jennywen.ca/) is a single ordered record: short dated claims, direct links, and images. The useful reference is its editorial rhythm, not its visual styling. Local receipt: `docs/screencapture-jennywen-ca-2026-08-04-16_07_39.png`.
  
- [Pasito](https://joshpuckett.me/pasito) `0.1.3` is the carousel interaction. Its controlled React `Stepper` API exposes `count`, zero-based `active`, and `onStepClick`; the repo adapter supplies the MDX slide content and layout. Content read for this SOW:
  
- All 57 files under `posts/`: four current pages, five archived About drafts/bits, 15 project posts, 23 current writing posts, three archived writing drafts, five notes, and two shelf posts.
  
- The four required essays in full: `the-instantaneous-language-of-beauty`, `the-matter-of-taste`, `you-cant-design-a-ui-without-designing-the-code`, and `answerable-vocabulary-for-llm-work`.
  
- The strongest professional source pages in full: current/archived About copy, `the-work-and-team-im-after`, Vana, Cleared, Library of Economic Possibility, Epic Guide App, Kalaurie, Replier, Breaka, and the remaining project inventory.
  
## Story grammar
```text
Homepage
  = Intro
  + Hinge
  + StoryBlock{6–8}
  + Coda
  + CTA
Hinge
  = Designator("Start here")
  + Link("Projects")
  + Link("Writing")
StoryBlock
  = Context(project-or-theme, year)
  + Bridge(one paragraph, one claim, 40–70 words)
  + Evidence
Evidence
  = ProjectCard
  | PostCard
  | Carousel(2–6 ProjectCard | PostCard | Image)
  | PostList(explicit slugs, thumbnails optional)
  | Image
Card
  = Canonical link
  + Media when useful
  + Title
  + Short evidence-bearing description
  + Compact year/category metadata
```

Rules:

- Priority, not chronology, determines vertical order.
  
- Every paragraph earns the next evidence block. No biography filler.
  
- Every block carries one burden only: what should the reader now believe?
  
- Prefer canonical post metadata; do not duplicate titles, summaries, dates, or links in homepage prose.
  
- Use explicit slugs. No tag-driven or recent-post feed can silently change the story.
  
- No visible placeholders. Unready Vana items remain MDX comments or a separate content worksheet until publishable.
  
- No autoplay. Carousels are click/keyboard navigated and remember no state in the URL.
  
- First ship target: 6–8 bridge paragraphs, 7–9 vertical evidence blocks, roughly 600–900 homepage words excluding linked posts.
  
## Proposed story tree
This is the editorial contract, not final copy.

```text
<Intro, now>
  — I unite language, interaction, and code to make products fast, coherent, and trustworthy.
  — Existing Intro; tighten only if the finished page proves it necessary.
<Vana, 2022–26>
  — I can work at the frontier before the product category is settled: explore quickly, find the true system, and carry the interface into production.
  — Carousel: 5–6 forthcoming Vana project cards, ordered by importance rather than date.
  — Dependency: public-safe title, year/range, role, outcome, one image, destination, and one sentence of proof for each.
<You can't design a UI without designing the code, 2026>
  — This is the method behind the Vana work: the interface is not a picture; design includes the state, route, renderer, and failure modes that make the surface true.
  — PostCard: `you-cant-design-a-ui-without-designing-the-code`.
<Cleared, 2019–22>
  — I can own more than a feature: first commit to sale, product and interface design, frontend, service integration, and an engineering team of five.
  — ProjectCard: `cleared`; favour the checkout/quiz evidence over a generic thumbnail.
<Selected independent work, 2000–26>
  — The same judgment travels across media and constraints: high-stakes mobile workflow, knowledge system, fashion commerce/brand, and durable brand work.
  — Carousel or thumbnail PostList: `bungy-guide-experience-app`, `the-library-of-economic-possibility`, `kalaurie`, `breaka`.
  — Keep four only. Each proves a different capability; remove any duplicate proof.
<The matter of taste, 2018>
  — Taste is not preference or polish. It is compressed knowhow: cultivated judgment that gets to the heart of a problem faster and differentiates the result.
  — PostCard: `the-matter-of-taste`.
<The instantaneous language of beauty, 2018>
  — A product is felt before it is explained. Beauty earns attention and invites inspection; coherence earns trust.
  — PostCard: `the-instantaneous-language-of-beauty`.
  — If two consecutive essay cards overweight writing, combine both into one two-item PostList under one bridge.
<An answerable vocabulary for LLM collaboration, 2026 →>
  — Writing is part of the work because names shape decisions. My current LLM work makes language answerable to owners, surfaces, proof, and real-world oracles.
  — PostCard: `answerable-vocabulary-for-llm-work`.
  — This is the forward-looking slot for the coming language/LLM series; replace or extend deliberately, never via recency.
<Coda + CTA, now>
  — Compact restatement: broad attention, exact execution, shipped product.
  — Reuse the existing newsletter component; pair it with one direct contact link if the page needs a higher-intent action.
```

Deep structure:

```text
Proof: frontier product work
  → Principle: design lives in code
    → Proof: end-to-end ownership
      → Proof: range across constraints
        → Principle: taste is judgment
          → Principle: beauty earns attention
            → Next edge: language makes work answerable
              → Action: remember / read / subscribe / contact
```
## Content architecture
### Homepage document
Create `posts/pages/home.mdx` as the story body, using the existing Content Collections page schema. Keep layout contracts in TypeScript:

- `src/app/page.tsx`: root route, required `home` document lookup, page shell, `Intro`, hinge, MDX renderer, newsletter.
  
- `posts/pages/home.mdx`: only connective prose and ordered evidence blocks.
  
- `next.config.ts`: redirect `/home` to `/` so the page document has one public URL. This keeps the story easy to edit without turning navigation, layout, or subscription behavior into content. It also avoids a second content system or a bespoke singleton collection.
  
### MDX evidence vocabulary
Add the smallest explicit surface:

- `StoryPost slug variant="card"`: resolve one canonical post and render its media/title/summary/link.
  
- `StoryPostList slugs showThumbnails`: preserve declared order; reuse current `PostBlock`/`PostLine` grammar where it fits.
  
- `StoryCarousel`: thin MDX adapter around Pasito. It receives static MDX children, shows the active child, and derives Pasito `count` from them.
  
- Existing `Image` and `Video`: remain the raw media blocks. Suggested ownership:
  
- `src/components/mdx/story-post.tsx`: canonical post lookup and card/list adapters.
  
- `src/components/mdx/story-carousel.tsx`: active index, slide visibility, focus movement, Pasito integration.
  
- `src/components/mdx/mdx-components.tsx`: names-to-components mapping only.
  
- Controlled component styling stays with the new components. Add only necessary prose spacing hooks to `src/components/mdx/mdx.css`. Do not generalise frontmatter or create a homepage data schema until repeated authoring friction proves MDX props insufficient.
  
### Pasito boundary
Use the repo's package manager: `bun add pasito`, not `npm i pasito`, so `bun.lock` remains the sole lockfile. Import `pasito/styles.css` once at the app style boundary. Theme it via the documented CSS variables from a `StoryCarousel` class. Do not fork or rewrite package CSS. Our wrapper must own what Pasito does not:

- slide rendering and dimensions;
  
- stable active state when child count changes;
  
- previous/next arrow-key handling and focus transfer;
  
- labelled slide region/status;
  
- inactive slide `hidden`/`inert` behavior;
  
- image/video sizing with existing media utilities;
  
- reduced-motion and narrow-width proof. Dependency decision: use `pasito@0.1.3` as requested. Its published tarball currently contains no `license` field, repository metadata, or license file; record that metadata gap in the dependency receipt, but it does not block this personal-site implementation. Do not copy or fork Pasito's source.
  
## Scope
### Allowed writes after approval
- New branch: `callum/home-story`, carrying the current dirty state intact.
  
- `package.json`, `bun.lock` — Pasito only.
  
- `posts/pages/home.mdx`.
  
- `src/app/page.tsx`.
  
- `src/app/layout.tsx` only for the package stylesheet import.
  
- `next.config.ts` only for `/home` canonical redirect.
  
- `src/app/(home)/home-index.tsx` removal after no callers remain.
  
- New `src/components/mdx/story-*.tsx` files.
  
- `src/components/mdx/mdx-components.tsx` mapping.
  
- `src/components/mdx/mdx.css` only if a new class anchor needs prose-owned spacing.
  
- Focused tests/receipts beside their owning components or under `docs/`.
  
### Forbidden / non-goals
- No rewrite of the four essays or existing project posts.
  
- No invented, confidential, or unverified Vana outcomes.
  
- No redesign of `/projects`, `/work`, `/writing`, `/log`, or post pages.
  
- No new recency/chrono state on the homepage.
  
- No autoplay carousel.
  
- No broad MDX, media, card, token, typography, or newsletter refactor.
  
- No deletion of the older unused home/grid/zoom experiments unless a later exact inspection proves they are dead and the user approves that cleanup.
  
- No staging, commit, push, or PR until separately approved.
  
## Execution plan
1. Create `callum/home-story` from current `main`, preserving all dirty files; record the pre-work `git status`.
  
2. Install Pasito with Bun and inspect the exact lockfile delta.
  
3. Build the MDX evidence vocabulary in isolation; prove a five-child mixed image/post carousel before wiring the homepage.
  
4. Add `home.mdx` with the agreed story tree. Use MDX comments for unready Vana entries; render no placeholders.
  
5. Replace the featured card and tabbed index in `src/app/page.tsx`; keep `Start here`, `Projects`, and `Writing` on the hinge.
  
6. Remove `HomeIndex` only after no callers remain. Leave unrelated/legacy home experiments untouched.
  
7. Run focused static checks, build, and browser proof. Revise copy against the 90-second and 5–10-minute reader tests.
  
8. Present screenshots, interaction receipt, final story map, and exact diff. Await approval before commits.
  
## Orchestration after approval
Root keeps branch creation, dependency install, integration, browser proof, and all approvals. Parallel, non-overlapping worker ownership:

- Carousel worker: new `story-carousel.tsx` and its focused proof only.
  
- Evidence worker: new `story-post.tsx` card/list adapters and focused proof only.
  
- Editorial worker: `posts/pages/home.mdx` only, using the agreed tree and supplied Vana facts. Root alone edits `src/app/page.tsx`, `src/app/layout.tsx`, `next.config.ts`, `mdx-components.tsx`, package files, and shared styles. Workers do not delegate or commit.
  
## Done gates
Structural:

- No featured-post slot on `/`.
  
- No `Recent`/chrono tab, URL state, tablist, or hidden second panel on `/`.
  
- `Start here` is text, not a button or tab.
  
- `Projects` and `Writing` remain visible links on the same hinge at desktop and narrow widths.
  
- Homepage story order is explicit in MDX and unaffected by new posts.
  
- `/home` resolves canonically to `/`; linked project/writing routes still resolve. Carousel:
  
- At least one five-step, click-to-navigate instance using Pasito.
  
- Each step reveals the correct image or post card; mixed slide heights do not cause unusable jumps.
  
- Mouse, touch, Tab, Left/Right, Home/End, and focus-visible behavior are proved.
  
- Active slide is intelligible to assistive technology; inactive content is not focusable.
  
- Reduced motion resolves without animated transitions.
  
- No horizontal page overflow at 390, 620, and 1440px. Editorial:
  
- First viewport answers who Callum is and why his combined practice matters.
  
- Vana is first and strongest once publishable; every claim has a supplied public source.
  
- Cleared visibly proves first commit → sale and team/product ownership.
  
- The four named essays are present, but project evidence remains dominant.
  
- Every paragraph has one claim and points to adjacent evidence.
  
- A 90-second skim can recall: Vana, whole-product ownership, design in code, judgment/taste, current LLM language work, CTA.
  
- Full homepage read lands between 5 and 10 minutes in a manual timing pass.
  
- No empty cards, `coming soon` rows, generic CV chronology, or duplicated summaries. Technical oracle:
  
- `bun run check-posts`.
  
- Focused ESLint on touched TypeScript/TSX.
  
- `bunx tsc --noEmit`.
  
- `bun run build`.
  
- Browser screenshots at 390, 620, and 1440px: initial viewport, each carousel step, hinge, final CTA, light/dark if both are supported.
  
- Browser interaction/a11y inspection is the final oracle; source/build success alone is insufficient.
  
- Final `git diff --check`, `git status --short`, and exact touched-path receipt. No unrelated dirty file changed.
  
## Unresolved questions
- Vana: what are the 5–6 public-safe project names, dates, links, images, roles, and one-sentence outcomes, in priority order?
  
- Current dirty work: assumption is that all current homepage/newsletter edits belong on `callum/home-story`; confirm before branch creation.
  
- CTA: newsletter only, or newsletter plus a direct “work with me” email line?
