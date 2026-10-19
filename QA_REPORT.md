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
- `paintScheme()` measures the header unconditionally on every page it is called
  for, and `initPage()` always calls it, so each in-page navigation reads layout
  a second time right after the swap. Deliberately left as is pending review.

Do not describe this candidate as a fully accepted formal release.
