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
- CJK pages read in the reader's own serif (`Songti SC` / `Noto Serif CJK SC` / `SimSun`), as ruri shipped; Latin stays Georgia. A bundled 1.8 MB Noto Serif CJK subset was shipped earlier and removed again: subsetting left dense glyphs looking washed out next to the system faces, and the file cost every CJK page a 1.8 MB download. `scripts/build-font.py` and `static/fonts/` are gone with it.
- Fixed: the bundled serif (since removed, see above) was throttled to 130s+ by GitHub Pages; it had been mirrored to the Cloudflare site and is now moot.
- The demo site moved from GitHub Pages to Cloudflare Pages (`sasaorange-blog-hugo-demo`), bringing previews with it: a pull request deploys to `<branch>.sasaorange-blog-hugo-demo.pages.dev` while the main site stays up. GitHub Pages is gone because one repository has one live site, so previews and the real site could never coexist there.
- Fixed: the home hero image was capped at 960px inside a 1240px shell, so the banner stopped short of the right edge on wide screens. It now spans the shell, and its drop shadow (which read as a hard seam against the tinted page) is gone.
- Fixed: the hairline under the hero was centred on a box that was not centred, leaving it short at the right end.
- Fixed: the palette buttons lost their pressed state after in-site navigation.
- Fixed: on narrow screens the hero hugged the left edge and left a strip of page on its right. `.hero` is also a `.shell`, and `margin:0` in the hero rule wiped out the `margin-inline:auto` that centres a shell; the two only agreed on wide screens.
- Renamed the theme to sasaOrange: page title, footer credit, palette labels, `theme.toml` and both READMEs now credit hugo-theme-ruri and hugo-theme-reimu as the sources. Internal asset names (`ruri.css`, the `ruri` param block, `/ruri-media/`) are unchanged so existing sites keep working.
- Added `ruri_updated`, `ruri_scheme*` interface strings in all four languages.
- Added in-page navigation feedback, in four parts. The menu item that was clicked takes the current-page mark immediately, so the reader knows where they are going before anything arrives. A paper sheet unfolds below the header with a turning ring and one line of text ("正在努力加载中", localized), and leaves when the next page has been parsed and its scripts are ready; it covers the page being left rather than blanking it, so there is something to read through. The header's own hairline fills as a progress bar. None of it takes a click: mid-wait, clicking the page cancels the navigation, while the tools in the header still work and no longer cancel it. Reduced motion stills the ring and drops the sheet's unfold. `<main>` carries `aria-busy` during the wait.
- Fixed: `ruri.css` ended with a duplicated `prefers-reduced-motion` block for the loading bar.

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
