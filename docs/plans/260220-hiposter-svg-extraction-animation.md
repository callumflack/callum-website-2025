# 260220-hiposter-svg-extraction-animation

## Goal

Extract vector geometry from `HiPoster_A3_FA01.pdf` and produce an animation-ready SVG variant that can be iterated quickly for a "draw-in" line reveal.

## Constraints

- Source PDF is outside repo: `/Users/callumflack/Downloads/HiPoster_A3_FA01.pdf`.
- Keep output/artifacts encapsulated and reproducible from repo scripts.
- Ignore/remove bottom typographic strip; focus on artwork grid.
- First pass can prioritize usable motion over perfect geometric stroke reconstruction.

## Existing patterns

- Script location and style: `scripts/*`.
- Compound planning docs: `docs/plans/*.md`.
- Generated working assets now persisted under `public/images/`.

## Proposed approach

1. **Extraction pass (done)**  
   Read PDF page content stream, extract vector path operators, and write:
   - `tmp/hiposter-full-vector.svg`
   - `tmp/hiposter-artwork-only.svg`
   - Script: `scripts/hiposter-extract-svg-from-pdf.py`

2. **Animation build pass (revised, done)**  
   `scripts/hiposter-build-animated-svg.mjs` now preserves full exported SVG structure and animates paths in place:
   - input default: `public/images/hiposter-pymupdf.svg`
   - output default: `public/images/hiposter-artwork-animated.svg`
   - injects animation style block and decorates each `<path>` with:
     - `class="draw"`
     - `pathLength="1000"`
     - CSS vars `--delay` and `--dur`
   - keeps original transforms/clipping/grouping instead of rebuilding geometry

3. **Runbook commands**
   - Extract:
     - `bun run hiposter:extract -- "/Users/callumflack/Downloads/HiPoster_A3_FA01.pdf"`
   - High-fidelity PDF→SVG export (PyMuPDF):
     - `/tmp/pdfvec-env/bin/python -c "import fitz;d=fitz.open('/Users/callumflack/Downloads/HiPoster_A3_FA01.pdf');open('tmp/hiposter-pymupdf.svg','w').write(d[0].get_svg_image(text_as_path=True))"`
   - Build animated SVG:
     - `bun run hiposter:animate`
     - `bun run hiposter:animate -- public/images/hiposter-pymupdf.svg public/images/hiposter-artwork-animated.svg`

4. **UI integration (done)**
   - Standalone preview route: `src/app/hiposter/page.tsx` (`/hiposter`)
   - Client player: `src/app/hiposter/hiposter-player.tsx`
   - Restart button (top-right) remounts image with cache-busted src param
   - Artwork is layered above global guide lines (`z-10`)

## Edge cases

- If future path data includes unsupported commands (`Q`, `A`, lowercase relative commands), parser must be extended.
- Some filled outlines are not true centerline strokes, so draw animation is an approximation.
- Footer filter is geometric and could remove desired content if source composition changes.

## Learnings so far

- PDF has 504 vector paths on one page; artwork section resolves to 503 paths after footer exclusion.
- The visual "lines" are mostly narrow filled regions, not authored strokes, so `stroke-dashoffset` is a perceptual draw effect rather than literal pen reconstruction.
- A tiny number of very short paths exists and can animate too quickly; duration floor is required to avoid flicker.
- **Important correction:** earlier "rebuild path geometry" approach introduced fidelity bugs (missing left slab segment, occasional wedge artifact).
- Root cause: flattening/re-grouping paths from parsed geometry dropped visual semantics from source SVG/PDF export.
- Reliable fix: animate paths directly in the high-fidelity exported SVG (`public/images/hiposter-pymupdf.svg`) while preserving original structure.
- Fill animation hacks (re-applying fills after draw) caused visual divergence and were removed.
- Current accepted state:
  - full 3x3 composition preserved
  - bottom-left slab serif present
  - black wedge artifact removed
  - restart interaction stable on `/hiposter`

## Validation checklist

- [x] `bun run hiposter:animate`
- [x] Open `/hiposter` and verify draw sequence restarts via button
- [x] Confirm full 3x3 composition is present
- [x] Confirm bottom-left slab serif is present
- [x] Confirm no black wedge artifact in right column

## Out of scope

- Perfect centerline vectorization of filled outlines.
- Production optimization/minification of final SVG payload.

## Next experiments (low-risk)

- Keep `public/images/hiposter-artwork-animated.svg` as baseline "looks right" artifact.
- Create separate variants instead of mutating baseline:
  - `public/images/hiposter-artwork-animated-light.svg` (animate subset of paths, e.g. every 2nd path).
  - `public/images/hiposter-artwork-animated-staged.svg` (group/tile staged timing experiments).
- Keep experimentation isolated to `/hiposter` (or a dedicated lab route), not shared home/page routes.
- Make restart cheaper:
  - Prefer class toggle / animation reset on existing DOM node.
  - Avoid forced asset re-download unless source actually changed.
- Add runtime safeguards:
  - Pause animation when document is hidden (`visibilitychange`).
  - Start animation only when artwork enters viewport (IntersectionObserver).
- Track clear "good enough" gates before adopting a variant:
  - Visual parity: full 3x3, slab serif present, no right-column wedge.
  - Dev sanity: reasonable first load and restart times while running `bun dev`.
