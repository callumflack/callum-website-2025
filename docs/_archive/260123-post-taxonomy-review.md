## Post taxonomy review

Scope: sanity-check `writing` vs `note` split, plus taxonomy cleanup.

### Agreed direction

- Kill unused categories (`library`, `home`).
- `writing` is explicit essays (long-form, structured, opinionated).
- `about` + `letters` are pages, not posts.
- Separate `type` from `category`.
- `log` is a view (writing + projects + notes).

### Proposed taxonomy

Category (content domain, mutually exclusive):
- `writing` (essays)
- `projects` (case studies / work)
- `notes` (short-form fragments, quotes, link notes)

Type (format / surface, orthogonal):
- `post` (default)
- `page` (about/letters)
- `link` (mostly outbound, minimal body)
- `index` (log, library, etc.)

### Current `note` posts — sanity check

Keep as `notes`:
- `the-unfolding-afterwards-is-the-experience` (short excerpt + reflection)
- `scott-walker-coming-out-of-silence` (short excerpt + reflection)
- `je-est-un-autre` (quote chain + reflection)
- `forward-deployed-engineers` (link note + excerpt + brief take)
- `convenience-an-attractive-trap` (link note + brief take)

Move to `writing`:
- `rules-for-record-collecting` (full essay with structure, rules, headings)

Move to `page` (type) + `about` (category or rename to `page`):
- `the-work-and-team-im-after` (portfolio/role statement; not a post)

### Current `writing` posts — sanity check

Keep as `writing`:
- `aphorisms-for-remembering-how-to-see`
- `code-people-and-fallibility`
- `creativity-starts-with-love-and-theft`
- `designers-should-code`
- `iteration-and-prototyping`
- `john-boyds-bloody-mindedness`
- `notes-on-deciphering-sun-tzu`
- `notes-on-coding-with-llms`
- `practice-boredom`
- `should-all-decisions-be-unanimous-in-a-band`
- `the-instantaneous-language-of-beauty`
- `the-matter-of-taste`
- `wander-wonder-wunder`
- `ways-to-think-about-generative-ai`
- `organising-design-system-styles`

Consider `type: link` for:
- `do-the-grid-fins-still-fold-in` (no body, external `thumbnailLink`)

### Decision rules (short)

- **Writing** if: full narrative, multiple sections, or sustained argument.
- **Note** if: quote + short reflection, snippet, or single idea.
- **Link** if: mostly points outward and body is minimal.
- **Page** if: evergreen site content (about, letters, etc.).

### Template + create-post as a skill

Move `_TEMPLATE.mdx` and `create-post.ts` behavior into a Cursor skill:
- Skill generates frontmatter + boilerplate + naming.
- Keeps authoring out of repo root and enforces taxonomy/fields.

Reference: https://cursor.com/docs/context/skills
