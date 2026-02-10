# Bun Lockfile Merge Conflicts

## The Problem

`bun.lockb` is a binary file. Git can't auto-merge it. When both your branch and main have dependency changes, you get a merge conflict you can't manually resolve.

## The Solution

**Delete it and regenerate.** The lockfile is a derived artifact from `package.json`, not the source of truth.

### Workflow

1. Merge main into your branch
2. Resolve `package.json` conflicts manually (pick the deps you want)
3. Delete and regenerate the lockfile:

```bash
rm -f bun.lockb
bun install
git add bun.lockb
```

4. Commit and push

### Scripts Added

Two helper scripts in `package.json`:

```json
{
  "scripts": {
    "sync": "git fetch origin && git merge origin/main && bun run fix-lock",
    "fix-lock": "rm -f bun.lockb && bun install && git add bun.lockb"
  }
}
```

- `bun run sync` - Fetches main, merges it, and auto-fixes the lockfile
- `bun run fix-lock` - Just fixes the lockfile (use after manually resolving package.json)

### Why "ours" vs "theirs" Doesn't Matter

During a merge conflict on `bun.lockb`:

- Pick "ours"? Doesn't matter, delete it.
- Pick "theirs"? Doesn't matter, delete it.

The regenerated lockfile reflects YOUR resolved `package.json`. Your branch's dep changes are preserved because they live in `package.json`, which you resolve manually.

## Files Added

- `.gitattributes` - Marks `bun.lockb` as binary for merge handling
- Scripts in `package.json` - `sync` and `fix-lock`

## Prevention

Keep your feature branches short-lived. The longer they live, the more likely main diverges and you hit conflicts. Sync regularly:

```bash
bun run sync
```

