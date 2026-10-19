# Changelog

## Unreleased

### Card covers are wide frames now

- Home and archive entries put the cover on top of the entry, spanning the full
  reading column at 16:9, instead of hiding it or shrinking it into a corner.
  The reason is the shape of the pictures these entries actually get: a random
  image endpoint hands back 16:9 or wider, and the 112px square the card used to
  reserve cut away most of the subject — group shots lost every face but one in
  the middle. Only the placement is borrowed from reimu; the entries keep their
  own hairline separators, type and spacing, and gain no card boxes, shadows,
  rounded frames or icon rows.
- The markup puts the picture before the text rather than moving it there with
  `order`, so a no-CSS render and the accessibility tree read in the order the
  eye does. The cover link is `tabindex="-1"` and `aria-hidden="true"`: the title
  is already a link to the same page, and a second tab stop for one destination
  is a nuisance. The image itself gets an empty `alt`, since announcing it twice
  tells the reader nothing.
- A cover served by a random endpoint cannot be downloaded or measured at build
  time — the URL answers with a 302 to a file named differently on every request
  — so the frame is reserved from `coverRatio` (front matter, defaults to 16:9
  for any remote cover) and the `img` gets that width and height. Measured card
  height drift while the pictures arrive: 0px at 1280, 900 and 390 wide. Without
  it the list grows a screenful as each picture lands.
- The first four cards are `loading="eager" fetchpriority="high"`; the rest stay
  lazy. The reveal animation shows those cards a moment after paint, and lazy
  images there would leave the top of the page blank on a slow connection. Which
  cards those are is passed down from the loop index: neither `.Ordinal` nor
  `.Position` answers for a weighted page inside a section list, so the partial
  cannot work it out for itself.
- `image.html` gained `kind="cover"` (a 420/640/860 ladder that reaches the
  widest the column is ever drawn) and a `ratio` argument for sources it cannot
  resize. The reading time in a cover card no longer sits `margin-left:auto` at
  the far edge of an 850px row, a holdover from when a card was a thumbnail and
  a title; it now follows the tags.
- When the cover is a local or fixed remote file, nothing changes: it still goes
  through the build pipeline and still ships `srcset`.

### Housekeeping from the 2026-10-19 code review

- Removed `i18n/pt-BR.yml`. It held 25 of the 153 keys — the rest, including every
  loading, player and archive string, fell through to the raw key on the page —
  and no site in the repository ever enabled the language. A half-translated pack
  that nobody loads is a debt, not a feature; the four languages the theme
  actually ships are complete and now share the same 153 keys.
- The archive's "load earlier years" control now reads its two labels from the
  shared interface table (`i18n`, injected as `#ruri-i18n`) instead of the
  hand-kept four-language list inside `initArchive()`. That list was a second
  source of truth: a new interface language needed an entry in the JavaScript as
  well, and one that was never added showed a raw key. Two keys,
  `ruri_archive_more` and `ruri_archive_done`, were added to all four packs.
- Corrected `theme.toml`: the description claimed four reading palettes where
  there are two, each with its own dark variant, and the tag list described the
  theme as `minimal` when it ships a player, a heat map, collections and an
  in-page navigation sheet. Both now say what the theme does.
- `QA_REPORT.md` rewritten: it still carried the 2026-09-18 date and a "four
  language builds pass" claim that the incomplete pack above contradicted. It now
  separates what was re-checked on 2026-10-19 from what dates back to the earlier
  run, and records the deliberate open item below.
- Fixed: a table in an article squeezed its cells instead of scrolling. The
  table has `display:block;overflow:auto` so a wide one can be scrolled, but that
  also made every cell size to whatever fit, so a short word broke in half — a
  `WebP` column came out as `We` / `bP` while the next cell sat half empty. Cells
  now take their natural width (code spans included; the paragraph rule that
  lets a long path break was splitting `/fj` into `/f` and `/j` inside a cell),
  and the table is its own scroll container, so a narrow phone still scrolls it
  sideways with no page-level overflow.
- Reviewed, then deliberately left alone: `paintScheme()` measures the header on
  every call and `initPage()` always calls it, so an in-page navigation reads
  layout a second time right after the swap — one `getBoundingClientRect` at
  ~0.002 ms, riding a reflow `initPage()` triggers anyway. Skipping it when the
  palette did not change would leave `--header-h` at the previous page's height
  and bring back the stranded progress rail; no gain, a visible bug.

### Reading-room redesign

- Changed: the loading cog is the reader's own — the ring gear they picked, rim toothed and hub open, filled solid in the page's own ink: the deep brown of the warm reading room (`--ink`, `#3d2d23`), and each palette's own ink elsewhere, dark modes included. The first cog they picked was a line drawing in ink over a wash of paper; on the flat sheet the wash and the sheet were one colour, so the mark read as floating strokes instead of an object, and it made way for this filled one. The open hub is the paper showing through, which keeps the solid shape light at 132px and gives the turn something to read against. The mark before both of these was eight plain blocks around a rim — a generic spinner tinted with the accent, louder than the rest of the page. The SVG is inline, so it inherits the ink and needs no extra request; the spin still pivots on the viewBox (`transform-box:view-box`), the fix that keeps it turning in place instead of revolving.
- Fixed: a fast in-page navigation — a cache hit, a page already in memory — used to open the sheet over the old page and only then swap, so the reader saw the page they were leaving flash back for a moment before the new one snapped in. The sheet now lives outside `#page-shell` (layouts/partials/nav-veil.html): the swap replaces the shell and leaves the paper alone, so the new page is laid in behind the closed sheet and the paper draws back to reveal it — reimu's own order of operations. The close is also given its full duration before the page is laid in (`waitForVeilClosed`), the way reimu gives its loader a minimum showing, so even the fastest navigation is a gesture rather than a flicker.
- Changed: the loading sheet now opens as well as closes. The two wings draw back when the next page is ready, revealing the page the reader asked for. The opening had been silenced with `transition:none` — and `visibility` dropped the instant the class went — so the new page simply appeared; that left the gesture half-finished, a door that closes and is then not there. `visibility` now waits out the slide, a cancelled wait opens the same way over the page the reader stayed on, and the cog and label leave first, the paper following.
- Changed: the loading sheet now closes over the whole screen instead of starting below the header's rule, and the header rides on top of the closing paper. The bar used to hang outside the motion with the old page still showing above it, which read as a strip the sheet had missed. The header carries no background of its own and the wings bring the page's own paper colour, so the sheet that covers the bar is the same paper it already sits on — no seam, no band — and the menu, the tools and the current-page mark stay visible and clickable mid-wait. The cog keeps its old place below the bar.
- Fixed: switching between the two reading schemes moved the header on narrow screens — `html.theme-ruri .site-header{min-height:88px}` outranked the compact phone rule on specificity, so choosing the original palette grew the bar by 22px. The header's height belongs to the layout, not the palette; the rule is gone and both schemes share the reading-room band at every width. The 88px compact band was the pre-redesign height; flat frames, sans-serif type and square corners still carry the original look.
- Fixed: the progress rail and the veil's top edge hung off a measured `--header-h` that was only taken on load and resize, so after a scheme change (or a late-arriving font) they stayed at the old height and the rail showed up as a second line stranded inside the header. The measurement is now taken again the moment a palette lands, and once more when the faces have loaded.

- Fixed: the loading cog sat off-centre on phones and travelled in a small circle instead of spinning in place. `transform-origin:24px 24px` was being read against the element's own 112px box by some engines rather than the SVG's viewBox, which moved the pivot 32px off the middle — a revolution, not a spin. `transform-box:view-box;transform-origin:center` pins the pivot to the viewBox where both engines agree.
- The loading sheet now has exactly one motion: the two halves slide together when the wait starts, and the sheet is simply gone when it ends. The closing had been running the opening's transitions in reverse — a slide apart and a fade that announced the arriving page twice. `.nav-veil:not(.is-open)` now takes `transition:none`, so the wings snap back off-screen and the content the reader came for appears at once.
- Removed the soft-orange and pale-blue reading schemes: the header's paint dots and their translations, the `html.theme-orange` / `html.theme-blue` variable blocks and their dark variants, and the rules that referenced them. The scheme switch keeps warm apricot and the original cool teal — two dots leave room for the site name and the tools on a phone, where four of them had begun to crowd the bar. A stored choice of a removed scheme is ignored on the next visit.
- Added reimu's scroll-reveal motion to the theme's own components: post cards, home category tiles, section headings, the archive heatmap and year groups, term and friend grids, sidebar widgets, pagination, and the article's tags, copyright notice, sponsor block, share row, post navigation and comments each wait a little below their place and rise into it as they are reached. The waiting state is a class on `<html>` set before first paint, so without JavaScript every component is simply where it belongs; the motion travels on the independent `translate` property so a card's hover lift stays its own business; archive years that fold open later are picked up by a mutation observer; reduced motion removes both the drift and the fade.

- Replaced the cool grey palette with a paper-toned one: cream background, warm brown ink, orange-red accent, serif type throughout.
- Added switchable reading schemes (warm cream / cool teal), each with its own dark variant; the choice is remembered and restored before first paint.
- Kept the original cool-teal palette as the second scheme. Selecting it also restores the flat look it was designed for — square frames, no lift, no gradient headline, system sans-serif — while the book-style structure (centred title page, bar-and-rule headings, indented prose) stays.
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
- Added in-page navigation feedback, in four parts. The menu item that was clicked takes the current-page mark immediately, so the reader knows where they are going before anything arrives. Below the header, two opaque halves of paper slide in from the left and right edges and close over the page — the loader motion of hugo-theme-reimu — with a big cog turning in the middle where reimu puts its taiji and one line of text ("正在努力加载中", localized) under it; the sheet leaves when the next page has been parsed and its scripts are ready, and it covers the page being left rather than blanking it, so there is something to read through. The header's own hairline fills as a progress bar. None of it takes a click: mid-wait, clicking the page cancels the navigation, while the tools in the header still work and no longer cancel it. Reduced motion stills the cog and drops the slide. `<main>` carries `aria-busy` during the wait.
- Fixed: `ruri.css` ended with a duplicated `prefers-reduced-motion` block for the loading bar.
- The warm scheme was rebuilt from the hero illustration instead of borrowed from the novel site: paper `#fdfaf3`, apricot-sand rules `#f1dbbd`, ochre accent `#9c601e`, dusty clay muted text, and a matching dark side (`#221813` paper, `#f2b878` accent). The old cream + amber values read as a second, louder image under the artwork; accent tones now clear 4.5:1 against the paper. Palette label changed from `暖黄色（护眼）` to `暖沙杏金`.
- The loading motion was rebuilt on hugo-theme-reimu's loader: the old clip-path unfold and the small ring are gone, and in their place two opaque halves of paper slide in from the sides and close over the page, with a big cog turning in the middle where reimu puts its taiji. The cog is an inline SVG tinted with `currentColor` — the banner is a clockwork courier, so a gear belongs to the page's own imagery where a generic spinner did not — and it turns at a reading pace rather than a spinner's blur. The label rides in a pill under the cog so it stays legible on a phone. Reduced motion stills the cog and drops the slide, and its selectors match the specificity of the rules they silence so no fade is left running.
- The narrow-screen header became a single row — menu button, brand, tools — and the menu items moved into a bottom drawer, the way hugo-theme-reimu does it: on a phone the links no longer wrap onto a second row that pushed the bar to 108px tall. The button sits at the leading edge, opens a sheet that slides up from the bottom (a thumb's own end of the phone) behind a translucent scrim; it closes on the scrim, the × button, Esc, or any item, with focus returning to the button and the scroll locked while open. The drawer reads the same `menu` list as the desktop header, so the two can never disagree, and in-site navigation brings a fresh pair along. Current page is marked in the accent with a bar, matching the archive list language. Both button and drawer are inert above 760px. New interface strings `ruri_menu` / `ruri_menu_open` in all four languages; `syncCurrent` now marks both menus at once.
- Fixed: below 380px the phone header could not fit the seal, name, four palette dots and four tool icons, and truncated the site name to "sasaOra…"; the name now steps aside whole and the dots tighten instead.
- Added `ruri.bannerFit` (default off). When on, the hero banner keeps the source ratio and shows the whole artwork instead of being cropped into a 16:7 band — nothing at the top or bottom is shaved off, and the caption still sits on the picture. The example site ships a wide illustration with it on.

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
