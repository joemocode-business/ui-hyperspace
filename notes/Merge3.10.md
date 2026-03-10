# Upstream Sync — March 10, 2026

Selective sync of `packages/ui-filecoin/` from upstream `FilecoinFoundationWeb/filecoin-foundation` (commit `8497f6ce`). This repo is a standalone fork of that package, so we pulled only the UI package subtree — not the full monorepo.

## What was brought in

### Updated components (16 files)
- **Badge** — new optional `textTransform` prop (`capitalize` | `uppercase` | `none`)
- **Button** — new optional `size` prop (with `compact` variant)
- **SimpleCard** — passes `textTransform` through to Badge
- **SearchInput** — new optional `placeholder` prop, exported type
- **Search** — passes `placeholder` through to SearchInput
- **RefreshButton** — fixed imports to use relative paths instead of package paths
- **Carousel** — play/pause auto-scroll controls, `autoPlay` now defaults to `true`, `stopOnMouseEnter` changed to `false`
- **CarouselButton** — stops auto-scroll on manual navigation, removed absolute positioning (now handled by parent)
- **CarouselContent** — supports gradient overlay via `gradientMode` prop
- **CarouselNavigation** — renamed from `ConditionalCarouselNavigation`, wrapped in flex container
- **LogoSection** — new `gradientMode` prop, uses `CarouselAutoScrollControls` instead of conditional nav
- **NavigationMainLink** — new `onNavigate` prop, only passed to internal links (mobile nav fix)
- **NavigationMenuPanel** — handles single-link menu sections without grid layout
- **CHANGELOG.md** — updated from upstream

### New files (5)
- `CarouselAutoScrollControls.tsx` — play/pause toggle for carousel
- `CarouselGradient.tsx` — fade gradient overlay for carousel edges
- `Pagination/` — full pagination component (Pagination, PaginationArrowButton, PaginationDelimiter, index) with i18n support
- `YouTubeVideo.tsx` — embedded YouTube player component
- `pagination.css` — pagination styles

### Updated styles
- `button.css` — added `button--compact` size class
- `globals.css` — added `pagination.css` import

## What was left behind (and why)

### Skipped from upstream
- **`package.json`** — upstream is a monorepo workspace package; ours is a standalone package with different name (`@hyperspace/ui`), exports map, and dependency structure
- **`tsdown.config.ts`** — monorepo bundling config, not needed for our standalone build
- **`turbo.json`** — Turborepo task config, not applicable

### Reverted to our version
- **`tsconfig.json`** — upstream extends `@filecoin-foundation/typescript-config/base.json` which we don't have; kept our standalone config
- **`ui-config.test.ts`** — upstream uses `@jest/globals`; we use vitest
- **`linkUtils.ts`** — upstream added `import type { Route } from 'next'`; we don't use Next.js

### Restored after upstream removal
- **`button--filled` variant** — removed upstream but actively used in our app; restored in both `Button.tsx` and `button.css`
- **`globals.css` imports** — re-added `modal.css`, `tabs.css`, `toast.css` which are local-only components not in upstream
