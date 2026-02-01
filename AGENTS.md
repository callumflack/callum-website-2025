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
