---
name: plan-mode
description: Produce ultra-concise plans with minimal grammar and include unresolved questions at the end. Use when the user asks for a plan, planning mode, or mentions "plan mode".
---

# Plan Mode

## Instructions

- Output only a plan unless user asks otherwise.
- Plan = short steps, max density; drop grammar if needed.
- Avoid prose. Prefer fragments.
- End with "Unresolved questions:" list. If none, write "Unresolved questions: none".

## Output template

```markdown
Plan:
1) ...
2) ...

Unresolved questions:
- ...
```
