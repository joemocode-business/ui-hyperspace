# How to Sync from Upstream

This repo is a standalone extraction of `packages/ui-filecoin/` from the [FilecoinFoundationWeb/filecoin-foundation](https://github.com/FilecoinFoundationWeb/filecoin-foundation) monorepo. The histories are unrelated, so we can't do a normal `git merge`. Instead, we extract the subtree and compare manually.

## Prerequisites

The upstream remote should already be configured:

```bash
git remote -v
# Should show:
# upstream  https://github.com/FilecoinFoundationWeb/filecoin-foundation.git
```

If not:

```bash
git remote add upstream https://github.com/FilecoinFoundationWeb/filecoin-foundation.git
```

## Step-by-step process

### 1. Fetch upstream

```bash
git fetch upstream main
```

### 2. Check what changed upstream since last sync

```bash
# See recent upstream commits touching our package
git log upstream/main --oneline -- packages/ui-filecoin/ | head -30
```

Compare against the last synced commit noted in `notes/Merge3.10.md` (or the most recent merge notes file) to know where you left off.

### 3. Extract upstream's ui-filecoin to a temp directory

```bash
mkdir -p /tmp/upstream-ui-filecoin
git archive upstream/main -- packages/ui-filecoin/ | tar -x -C /tmp/upstream-ui-filecoin --strip-components=2
```

This gives you a clean copy of upstream's `packages/ui-filecoin/` at `/tmp/upstream-ui-filecoin/`.

### 4. Diff against your local repo

```bash
diff -rq /tmp/upstream-ui-filecoin /path/to/ui-hyperspace \
  --exclude='.git' --exclude='.claude' --exclude='node_modules' \
  --exclude='vitest.config.ts' --exclude='dist' \
  --exclude='package.json' --exclude='tsdown.config.ts' --exclude='turbo.json'
```

This shows three categories:
- **"Files differ"** — upstream changed a file we also have (review these)
- **"Only in /tmp/upstream-ui-filecoin"** — new files from upstream (usually safe to take)
- **"Only in /path/to/ui-hyperspace"** — our local additions (keep these, they're ours)

### 5. Review each changed file

For files that differ, check the actual diff:

```bash
diff /tmp/upstream-ui-filecoin/src/components/SomeFile.tsx src/components/SomeFile.tsx
```

Look for:
- **Additive changes** (new optional props, new components) — generally safe to take
- **Breaking changes** (removed variants, renamed exports, changed defaults) — evaluate case by case
- **Dependency additions** — reject anything that pulls in `next` or monorepo-only packages

### 6. Copy accepted changes

```bash
# Updated files
cp /tmp/upstream-ui-filecoin/src/components/SomeFile.tsx src/components/

# New files/directories
cp /tmp/upstream-ui-filecoin/src/components/NewComponent.tsx src/components/
mkdir -p src/components/NewDir
cp /tmp/upstream-ui-filecoin/src/components/NewDir/* src/components/NewDir/
```

### 7. Revert files that should stay as ours

If you accidentally copied something that should remain local:

```bash
git checkout HEAD -- path/to/file
```

### 8. Re-apply local modifications

After copying upstream changes, check that our local customizations are still in place:

```bash
git diff -- src/styles/globals.css  # Should still import modal.css, tabs.css, toast.css
git diff -- src/components/Button.tsx  # Should still have 'filled' variant
git diff -- src/styles/button.css  # Should still have button--filled styles
```

### 9. Verify and commit

```bash
git status
git diff  # Review everything one more time
```

## Files to always keep as ours (never overwrite from upstream)

| File | Reason |
|------|--------|
| `package.json` | Standalone package config (`@hyperspace/ui`), different exports, deps |
| `tsconfig.json` | Upstream extends a shared config we don't have |
| `tsdown.config.ts` | Monorepo bundling tool, not applicable |
| `turbo.json` | Turborepo config, not applicable |
| `src/config/ui-config.test.ts` | We use vitest; upstream uses jest |
| `src/utils/linkUtils.ts` | Upstream imports `Route` from `next`; we don't use Next.js |
| `vitest.config.ts` | Local only, doesn't exist upstream |

## Local additions to preserve after any sync

These are components/styles we've added that don't exist upstream. After syncing `globals.css`, make sure these imports are present:

```css
@import './modal.css';
@import './tabs.css';
@import './toast.css';
```

And in `Button.tsx` / `button.css`, ensure the `filled` variant still exists (upstream removed it but we use it).

Local-only components (will show as "Only in ui-hyperspace" in the diff — that's expected):
- `Breadcrumb.tsx`
- `CodeBlock.tsx`
- `DividerWithLabel.tsx`
- `Modal/`
- `ProgressBar.tsx`
- `StatCard.tsx`
- `Tabs/`
- `TextArea.tsx`
- `Toast/`
- `Card/index.ts`
- `Table/index.ts`

## After syncing

Write a merge notes file (e.g., `notes/Merge<date>.md`) documenting:
- Which upstream commit you synced to
- What was brought in
- What was intentionally left behind and why
- Any local customizations that had to be re-applied

See `notes/Merge3.10.md` for an example.
