# AGENTS.md

[Agent Guidance]|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning
|Read the referenced docs/files before coding when uncertain

[Docs Index]|root: /docs
|repo-guide:{260202-repo-guide.md}
|implementation-guidelines:{260202-implementation-guidelines.md}
|agents-md-best-practices:{260202-agents-md-best-practices.md}

[Skill Index]|IMPORTANT: Look these up just-in-time when relevant
|react best practices:{.agents/skills/vercel-react-best-practices/AGENTS.md}
|composition patterns:{.agents/skills/vercel-composition-patterns/AGENTS.md}
|next.js best practices:{.agents/skills/next-best-practices/SKILL.md}

[Code Index]
|className utils:{src/lib/classes.ts,src/lib/utils.ts}
|content schema:{content-collections.ts}
|asset types:{src/types/content.ts}
|mdx media:{src/components/mdx/mdx-media.tsx}
|component guides:{src/components/AGENTS.md}

[ClassName Rule]
|Use cn() from src/lib/utils.ts, NOT cx() from cva
|Migration: when editing a file that uses cx, migrate that file to cn() in that file
|Reason: cn() wraps custom tailwind-merge for project CSS variables

## Compound

[Compound Loop]|Plan -> Work -> Review -> Compound -> Repeat
|Intent: each unit of work should make the next one easier
|Guide:{docs/260210-compound-engineering.md}

[Compound Principles]
|Compound step is the differentiator (do not stop at review)
|Use safety nets and review systems to build trust, not manual gatekeeping
|Plans are first-class artifacts
|Prefer agent-native execution where safe
|Parallelize independent work when practical

[Compound Artifacts (repo mapping)]
|plan docs:{docs/plans/README.md,docs/plans/YYMMDD-feature-plan-template.md}
|solution docs:{docs/solutions/README.md,docs/solutions/YYMMDD-solution-template.md}
|todo queue:{todos/README.md}
|pr template:{.github/pull_request_template.md}
|scripts:{scripts/compound-new-plan.mjs,scripts/compound-new-solution.mjs,scripts/compound-review-gate.mjs}

[Compound Review Prompts]
|What was the hardest decision?
|What alternatives were rejected, and why?
|What are we least confident about?
