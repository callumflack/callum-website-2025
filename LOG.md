# Worklog

## 2026-09-29

- Fix the production homepage flash: remove dormant Recent-tab URL state and its empty Suspense fallback. Preserve current content, spacing, and unrelated local edits. Completion requires production HTML containing the home content before hydration, plus rendered-page and focused code checks.
- Locally verified: production build and TypeScript pass; initial HTML includes Latest, Work, and Writing on `/` and `/?view=recent`, with no client-render bailout. The same check fails on current production. Rendered production build, focused ESLint/Prettier, and Next runtime diagnostics pass. No editor diagnostics API is exposed in this session. Resolved: committed and pushed only this fix from main. Production deployment remains unverified; unrelated edits and this worklog stay local.

## 2026-09-12

- Redesign `/writing` as an authored alternate entry point: retain the shared designer-engineer intro, add why Callum naturally writes (cultivated attention becoming judgment, then expressed through tools, groups, and systems), and compose explicit thematic `SectionHeader` + `StoryPostList` groups without index tabs.
- Preserve the current tabbed writing index at `/writing-01`; keep home and its legacy composition unchanged. “Start here” uses thumbnails; “Lists and collections” stays a text list.
- Restored “Do the grid fins still fold in?” as a substantive local writing post from Callum's original Littoral Line article and included it under making software.
- Implemented and locally proved both indexes and the restored article: post validation, focused format/lint, TypeScript, full lint, production build, Next runtime diagnostics, sitemap uniqueness, and desktop/mobile rendered-route checks pass. Work remains uncommitted for Callum's editorial and visual review.
- Writing-index review steer: remove the back control and “Read more”; replace the career-history row with quiet About/Work links while retaining contacts. Restore Collections/Chrono tabs, make Collections the authored default, move Designers should code and The instantaneous language of beauty into Start here, rename “Lists and collections” to “Lists”, and increase inter-group spacing by one semantic step.
- Applied and rendered the review steer. Collections is the default canonical URL; Chrono retains the former combined writing/notes/shelf timeline at `?sort=year`. The writing-only group gap is now `submajor` rather than `minor`; focused format/lint, post validation, TypeScript, Next compilation/runtime diagnostics, desktop/mobile renders, tab navigation, landmark count, and overflow checks pass.
- Contextual About return approved: `/writing` links to `/about?from=writing`; About maps only that whitelisted source back to `/writing`, while direct or invalid-source visits retain Home. Refactor the fixed Home button into a destination-aware return link and isolate the request-time parameter read in a small Suspense boundary so About content remains prerenderable.
- Implemented and locally proved contextual return navigation. Writing → About, reload, and its return link resolve to `/writing`; direct and invalid-source About visits resolve to Home; canonical remains `/about`. Focused format/lint, TypeScript, Next route compilation and runtime diagnostics, initial HTML, and a scoped axe check pass.
- Extend the same contextual return contract to Work: `/writing` links to `/work?from=writing`; the source survives Work view changes and reloads, while direct or invalid-source Work visits retain Home. Share the whitelist resolver with About rather than duplicating route logic.
- Implemented and locally proved contextual Work return navigation. Writing → Work, Work view changes, reload, and its return link resolve to `/writing`; direct and invalid-source Work visits resolve to Home; canonical remains `/work`. Focused format/lint, TypeScript, Next route compilation/runtime diagnostics, initial HTML, rendered-route inspection, and a scoped axe check pass.
- Correction: the portfolio will live at `/`. Keep `/work` available but unlinked; Writing’s Work link goes directly home, so Work needs no `from` parameter or contextual return behavior. About retains its contextual return to Writing.
- Applied and proved the correction: Writing’s Work link targets `/`; `/work` retains its standard Home return even if visited with a stale `from` query. Focused format/lint, TypeScript, rendered navigation, and Next compilation/runtime diagnostics pass.
- Writing contact-row decision: remove all five profile/contact icons from the `/writing` intro and replace them with nothing. Retain About | Work for orientation and the newsletter at the end of the index.
- Writing-to-post navigation: links from both Collections and Chrono carry a whitelisted Writing origin so the post return control goes to `/writing`; direct post visits still return Home. Remove the avatar + “Callum” home breadcrumb from shared post metadata everywhere.
- Implemented the Writing-origin post return and removed the shared author breadcrumb. Dynamic post canonicals now exclude the navigation query; focused format/lint, TypeScript, and diff checks pass.
- Writing intro/content steer: add RSS beside About | Work, link “designer-engineer” to the portfolio home, and reorder Start here to UI/code, beauty, taste, creativity, Generative AI, then Designers should code.
- Repeat every Start here article in its thematic collection: Generative AI under language models; UI/code and Designers should code under making software; beauty, taste, and love/theft under attention and creativity.
- Remove “Designers should code” from Start here; retain it under Designing and making software.
- Applied the RSS link, portfolio link, and Start here order; post structure, focused format/lint, TypeScript, and diff checks pass.
- Start here order: UI/code, beauty, taste, iteration-and-prototyping, Generative AI, creativity last.
- First Start here header only: padding at the MDX callsite (`className` on that `SectionHeader`). Shared prose CSS zeros that header’s margin so home stays tight. A margin utility on the header would lose to that reset.
- Home Writing list: add iteration-and-prototyping; drop creativity-starts-with-love-and-theft and answerable-vocabulary-for-llm-work. `featuredWritingSlugs` stays the Selected sort, already out of sync with home.

## 2026-09-08

- Callum asked which argument should become public this week and for help finishing it. Selected the taste/knowhow follow-up to his 2018 essay, using his published Vana example as the concrete scene. Keep the embodied meaning of taste intact and avoid claiming that AI can never exercise judgment.
- Write a complete local website draft for author review. A question is pending for a fresher firsthand correction; the already-published example makes the draft independent of that answer. Publication remains a later action.
- The draft is complete and marked `draft: true`; the KB publishing queue now points to it under Drafting. Callum's optional fresh-example question is still unanswered. Next action is his editorial read, followed by any revisions and a separate publication decision.

## 2026-09-03

- Work Reel cards were `480 × asset aspect`, so widths drifted (1.44 vs 1.6 vs 16:9). Locked to one 768×480 box (zoom height at 1600/1000) with `object-cover`.
- Reel first card sat `major` left of the text column: home track is `inset-text - major` because the wrapper adds `lg:px-major`. Reel had the track without the wrapper. Added `lg:px-major` on the Reel wrapper.
- Folded Reel into the shared project strip: track/item/caption live in `components/media`, ZoomCarouselClient consumes them, WorkReel is a 10-line composition. Deleted the `work-carousel.tsx` fork. Zoom RSC adapter lives in `(home)/zoom-carousel`; MDX re-exports it.
- Reel caption hover was dead: overlay sat on the card so image hover never hit the caption link, and `Caption` `text-solid` ate parent `hover:text-fill`. Card is one `Link`; caption uses `group-hover:text-fill!`.
- Reel `snap-center` did nothing: items had the class but the track still used home’s snap-start `scroll-px` (`inset-text - major` + `lg:px-major`). Center track padding/scroll-padding is now `(100vw - card)/2`.
- Cannot do both with one `scroll-padding` + mixed `snap-start`/`snap-center` + mandatory: LHS wants pad 216, clean center needs snapport ≥ 768 (pad ≤ 172). 768>680 adds extra start snaps. Shipped: pad inset-text both sides, scroll-padding 172, first `snap-none`, last `snap-end` + 44px `scroll-margin-right`, rest `snap-center`, `snap-proximity`. Measured at 1112: load `firstLeft === h1Left` (216), card 2 `centerDelta 0`, last `right === subscribe` (896).
- Added a guarded Bunny Storage media uploader with collision detection, checksum upload, public delivery verification, and mocked-network tests.
- `/work` LCP was Kalaurie’s poster: Reel card 0 is ODL video with no poster, so `priority={index === 0}` never hit an Image. First two strip items now `loading="eager"` (Next 16 dropped `priority`).
- Later: add a poster to `posts/projects/open-data-labs.mdx` (and `vana-2025.mdx`, same videos). Card 0 then becomes the LCP Image instead of Kalaurie. Same hole: MDX `<Video poster="">` on `/open-data-labs`.
