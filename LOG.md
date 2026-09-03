# Worklog

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
