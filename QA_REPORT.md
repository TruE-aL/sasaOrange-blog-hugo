# Release-candidate QA

Validated 2026-10-19 using Hugo Extended 0.162.1 and Playwright Chromium 151.

> This report records the last full pass. The sections below say which behaviour
> was re-checked on 2026-10-19 and which date back to the 2026-09-18 run; a claim
> in "Passed" is not evidence that it still holds if the component it covers has
> been reworked since.

## Passed

### Re-checked 2026-10-19 (loading sheet, navigation order, palettes, interface strings)
- Five build configurations (minimal / player+comments+search / culture / media
  pipeline / Hugo Modules) build clean, and the built HTML carries the veil, the
  cog and the interface strings: 29/29 assertions.
- Loading sheet, 46 assertions across phone (390px) and desktop (1280px): the
  sheet spans the full viewport from the top edge, the header rides above it at
  `z-index:22` and stays clickable mid-wait, the sheet's own paper is the page's
  `--bg` with no seam at the header, the page is laid in behind the closed sheet
  and the sheet draws back over the new page, and reduced motion stills the whole
  gesture.
- Switching reading schemes no longer moves the header at either width, and the
  progress rail and the sheet's top edge follow the re-measured `--header-h`.
- Cog: centred in its viewBox (`transform-box:view-box`, pivot at 66px/66px of a
  132px box), turning on `ruri-gear`, tinted from `--ink` in all three states —
  warm `#3d2d23`, cool teal `#303d45`, dark `#dce6e8`.
- No page exceptions on home / archives / categories / about / article.
- Interface strings: four language packs hold the same 153 keys. The archive
  "load earlier years" control renders from the shared interface table in all
  four languages (`加载更早年份` / `Load earlier years` / `以前の年を読み込む`
  / `載入更早年份`), instead of the hand-kept list it used to carry.
- In-page navigation: language switch lands on `/en/` with `lang="en"`, and three
  consecutive in-page navigations leave `<head>` with one canonical, one
  description, five alternates and five `og:` tags — nothing accumulates.

### Wide card covers, checked 2026-10-19

Headless Chromium against a build of `exampleSite` served over HTTP, on six
demonstration posts whose covers are live random-image endpoints.

- Frame geometry: 849×478 at 1280 wide, 582×327 at 900, 358×201 at 390 — 1.778
  in every case, i.e. the declared 16:9 holds and `object-fit:cover` does the
  cropping.
- Card height drift measured 120 ms after DOM ready versus fully loaded: `0` on
  every card at all three widths. The reserved frame, not the arriving image,
  decides the height, so the list does not grow a screenful as pictures land.
- Priority: the first four cards are `loading="eager" fetchpriority="high"`, the
  rest `lazy` / `auto`. The count comes from the loop index — `try .Position`
  built but never returned a value, leaving every image lazy.
- Degradation: `cover: false` renders a plain text card with no `has-cover`
  class. A remote cover with `coverRatio: 2.35` emits `width="430"
  height="183"`. A remote cover without the key falls back to 16:9.
- Local covers still take the pipeline: `banner.webp` ships
  `srcset` at 420w/640w/860w with the matching `sizes`.
- Meta line: categories and tags link to their own term pages with their own
  titles (a broken `range` scope briefly pointed every link at the post itself),
  and the reading time follows the tags instead of being pushed to the far edge.
- No horizontal overflow at any of the three widths (`scrollWidth` equals
  `clientWidth`); no console errors or page errors in any run.

### Carried over from 2026-09-18 (not re-run since)
- Independent minimal / four-language / subpath builds and local link checks.
- Current working blog: 875 HTML pages and four search indexes; original source hashes unchanged.
- JavaScript syntax, LRC offset and original/translation grouping unit tests.
- Live browser: playlist remains open while hovering its items; volume and order controls.
- Actual HTMLAudioElement decoding/playback/seek with generated silent WAV; audio element and playback persist during PJAX; cross-language navigation updates accessible control labels.
- Dark-theme toggle, search dialog/Escape, and no-JS archive rendering.
- Archive document widths 320/390/768/1440: no horizontal overflow.
- CSS formatting preserves cascade order.

## Limits / unfinished gates
- Live configured playlist metadata loaded successfully. The WAV test verifies browser media controls, not every remote song's availability or audible output.
- Screenshots captured in local /tmp; these are not accepted visual baselines or release screenshots.
- Lyric parsing is unit-tested; real-provider translated lyric display still needs acceptance.
- Full visual regression, keyboard/TOC walkthrough and Safari/Firefox checks remain.
- Only Chromium was exercised on 2026-10-19; the `--header-h` measurement and the
  sheet's transition timing are the two places most likely to differ elsewhere.
- `paintScheme()` measures the header unconditionally, and `initPage()` always
  calls it, so an in-page navigation reads layout a second time right after the
  swap. Reviewed again on 2026-10-19 and **deliberately left as is**: the second
  read is a single `getBoundingClientRect` at ~0.002 ms, `initPage()` reflows the
  page anyway, so it rides along on a reflow that has already happened, and the
  obvious optimisation — skip the measurement when the palette did not change —
  would leave `--header-h` at the previous page's height and bring back the
  stranded progress rail this was added to fix. The cost is zero and the failure
  mode is a visible bug; not changing it is the correct answer.

Do not describe this candidate as a fully accepted formal release.
