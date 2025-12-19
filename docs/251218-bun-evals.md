### Bun evals (`bun -e`) — what they are

- **What**: `bun -e "…js/ts…"` runs a one-off snippet in the context of your repo (same TS transpile/runtime Bun uses).
- **Why it’s useful**: you can **import real modules** and execute them, so you’re testing _actual behavior_, not inferring from text.

Example (what I ran):

```bash
bun -e "import { cn } from './src/lib/classes.ts'; console.log(cn('text-body','text-fill'))"
```

### Is it “better than grep”?

- **No — different tool.**
- **`grep`** answers: “where does this string/pattern appear?”
- **`bun -e`** answers: “what does this code actually do at runtime (given our config/import graph)?”

When you’re validating things like **`cn` merge semantics, date formatting, slugging, sorting output**, eval wins because it’s executable truth.

### Other options (brief)

- **Node one-liners**: `node -e "..."` (needs TS loader if importing TS; more friction than Bun here).
- **`tsx` runner**: `npx tsx -e "..."` / `tsx -e "..."` (good, but Bun is already your stack).
- **Scratch script**: `scripts/scratch.ts` + `bun run scripts/scratch.ts` (better when snippets grow past ~5–10 lines; versionable).
- **Unit tests**: add a tiny test for tricky utilities (best long-term, but more overhead).
- **REPL**: `bun repl` for interactive poking (less reproducible than `-e`).

### Rule idea (so we don’t overuse it)

- Use **`grep` first** to locate code.
- Use **`bun -e` only to validate behavior** when semantics matter (merge logic, date/time, parsing, sorting), and keep snippets to “copy/pasteable” size.
- If snippet grows, promote it to `scripts/scratch/*.ts` or a test.

### “Better than grep” (compressed)

- **`rg` (ripgrep)**: basically the modern baseline (fast, respects ignore files, regex, file globs). If someone says “better than grep”, they usually mean **use ripgrep**.
- **AST-aware search (structural)**: finds code by _syntax_, not text.
  - **`ast-grep`**: tree-sitter based; “find this function call regardless of whitespace/renames”.
  - **`comby`**: structural-ish rewrite/search via templates (great for refactors).
  - **`semgrep`**: pattern rules + security/static analysis (bigger hammer).
- **Indexed code search** (fast across big repos, cross-repo, symbol-ish):
  - **Sourcegraph**, **Zoekt**, **Livegrep**: pre-indexed, instant search, better ranking, sometimes symbol/nav.
- **Language-server / IDE queries**:
  - “Find all references”, “go to definition”, “rename symbol” beats any text search for correctness.
- **Semantic search** (LLM/vector):
  - Good for “where is X handled?” but not a proof tool; best paired with `rg`/AST search.

### “Better than Markdown or JSON for docs” (compressed)

- **Markdown is fine** for human docs; the “better” stuff is usually about **structure, querying, and single-sourcing**.
- **MDX**: Markdown + components (docs become composable UI; great for design systems).
- **AsciiDoc**: stronger semantics (includes, callouts, cross-refs) → better for large manuals.
- **reStructuredText**: Sphinx ecosystem (Python-heavy).
- **Docs platforms** (still often backed by MD/MDX, but give structure/search/versioning):
  - **Docusaurus**, **Nextra**, **MkDocs**, **Mintlify**, etc.
- **“Docs as data” instead of prose** (when you need strict structure):
  - **CUE / Dhall / Jsonnet**: typed/validated, reusable, generate JSON/YAML/MD; great for config/specs.
  - **YAML/TOML**: nicer than JSON for authoring config (comments, less noise) but still loosely typed unless validated.
  - **SQLite**: underrated for “documentation” that needs querying (glossaries, redirects, changelogs, content registries).
  - **TypeScript modules** (export objects validated by Zod): best-in-repo dev UX, refactorable, type-safe.
- **Hybrid that usually wins**: **Markdown/MDX for prose** + **frontmatter / schema-validated metadata** + **generated indexes** (search, tags, nav) so publishing stays easy but the site stays structured.
