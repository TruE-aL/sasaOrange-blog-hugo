# Changelog

## Unreleased

### Reading-room redesign

- Replaced the cool grey palette with a paper-toned one: cream background, warm brown ink, orange-red accent, serif type throughout.
- Added switchable reading schemes (warm cream / soft orange / pale blue), each with its own dark variant; the choice is remembered and restored before first paint.
- Kept the original cool-teal palette as a fourth scheme. Selecting it also restores the flat look it was designed for — square frames, no lift, no gradient headline, system sans-serif — while the book-style structure (centred title page, bar-and-rule headings, indented prose) stays.
- Home screen is now a centred title page: eyebrow, large serif heading with a two-stop gradient, tagline, a rule that fades at both ends, and an optional wide banner beneath.
- Section labels became book-style headings: an accent bar, the title, then a hairline that fades to the right.
- Article headers are centred with a short accent rule; prose is justified with a two-character first-line indent, article `h2`/`h3` read as marginal notes, quotes and inline code took the accent tint.
- Home cards drop the cover thumbnail for a text-first list; tags, pagination, sidebar blocks, archive years, term and friend grids follow the same quiet style.
- Ship a self-hosted Noto Serif CJK SC subset (GB 2312, OFL 1.1) for CJK pages, with `scripts/build-font.py` to rebuild it.
- Fixed: the palette buttons lost their pressed state after in-site navigation.
- Added `ruri_updated`, `ruri_scheme*` interface strings in all four languages.

- Group generated theme scripts and styles under `assets/js/` and `assets/css/`, retaining fingerprinted URLs and lazy-loaded collection modules.

- Publish fetched image originals and responsive variants under `ruri-media/remote/` instead of the site root.

- Add opt-in multilingual arts and culture pages with configurable categories and Bangumi/NeoDB/Douban sources, build-time snapshots or live anime API, per-page lazy loading, ratings, comments and progress.
- Preserve valid collection snapshots on upstream failures, skip unchanged data writes, and support local Douban exports.
- Add optional `ruri.friendsShuffle` to shuffle friend links within each group on page load and in-page navigation; disabled by default.
- Generate responsive WebP variants for covers and content images at build time, with `srcset`/`sizes`, lazy loading and original-size lightbox fallback.
- Add `description.html` so pages without a handwritten description reuse the first 80 characters of body text; cards, meta tags and share links share the same excerpt.
- Add optional `ruri.images.remoteSources` mapping to rewrite CDN prefixes to a fetchable origin during builds.
- Add the solar-system and Voyager default SVG favicon, seven-size ICO up to 256×256, Apple/Android PNGs, and source artwork.
- Fold the mobile music player into a vertical title rail; the first touch expands controls without starting playback.
- Add a mobile article contents drawer that follows in-page navigation and viewport changes, hidden on pages without headings.
- Remove the empty mobile article sidebar space and align floating controls and lyrics.
- Add Hugo Module metadata and a full-example Module build regression check.
- Rewrite Chinese and English installation/configuration guides with Module and Git submodule workflows.
- Remove legacy JSON search output, unused translations/styles/helpers, and share friend-card rendering without merging categories.
- Compact the expanded floating music player and control spacing.

- Add code language/copy/collapse tools, local PhotoSwipe and QR dialogs.
- Restore multilingual Pagefind search with highlighting and pagination.
- Show Waline article counts and configurable footer word/reading totals.
- Honor page copyright overrides and explicit false in pages and RSS.
- Simplify audio configuration to player.audio (legacy fallback retained).
- Include vendored library licenses and copyright/subpath regression tests.


## 0.1.0-rc.1 (unpublished)

Independent example and tests; optional configuration; site-owned editorial copy;
explicit page layouts; four-language player controls; subdirectory menu links;
safe RSS; generic cover fallback; disconnect previous TOC observer on navigation;
license attribution and distribution boundaries.
