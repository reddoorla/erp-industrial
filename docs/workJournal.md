# ERP Industrial — Work Journal

Running log of build work: what was done, why, and where it landed.
Chronological — newest entry at the bottom. The README says what the stack
ships; this is the history of getting it there.

The convention is in [CLAUDE.md](../CLAUDE.md) under "The work journal". In
short: every working session appends a dated entry, prose over bullets, why
over what, and history is never edited to be right — a later entry corrects an
earlier one and says so.

---

## 2026-09-05 — Journal opened, and 266 commits summarised rather than remembered (`chore/work-journal`)

The journal starts today, so this first entry is a **backfill**: a coarse
summary read off the commit log, not written from memory. Detail below this
line is trustworthy; detail above it is not, and nothing here should be cited
as though someone recorded it at the time. For anything before 2026-09-05 the
commit log is the record.

**What this repo is.** The marketing site for ERP Industrials (Energy Related
Properties) — a SvelteKit 2 / Svelte 5 / Tailwind 4 / Prismic site on Netlify.
It is a full-screen slide site rather than a document site: three slices
(`Hero`, `RichText`, `FullScreenSlide`), the last of which dispatches to four
variation components, plus a Vimeo hero and a Buildout listings map on its own
route. The contact form routes by an `interest` field — Leasing, Investor
Relations, Property Sales and Acquisitions — and the recipients for those live
dashboard-side, not here.

**Three eras, and a fourteen-month gap between the last two.** 151 commits in
2024 are the original hand build: April through July, terse messages ("d",
"push", "taking a breath"), no PRs, and an enormous amount of it mobile —
padding, Vimeo playback on phones, a portrait-mode alert, a landscape modal.
2025 adds 14 commits of pure upkeep across January to April and then stops
dead on 2025-04-30. Nothing at all until 2026-06-03.

2026 is 101 commits and almost a different project. June alone carries 77: npm
→ pnpm, Svelte 4 → 5, Tailwind 3 → 4, then onboarding onto the fleet's shared
configs via `@reddoorla/maintenance`, and then PRs #1–#25 in a run. The contact
backend was rebuilt **twice in two weeks** — reCAPTCHA + SendGrid, then Resend
when SendGrid was suspended (2026-06-03), then #18 threw out both for the
central ingest (2026-06-16). Anyone costing a form backend here should assume
the third answer, not the first. July through September is maintenance and
gates: `/health`, a smoke suite, SEO and 404 fixes, Turnstile as an option,
Renovate, and srcset widths capped with a real `sizes` on every image (#54).

**One defect worth carrying forward.** #33 (2026-07-18): a comment in
`src/app.html` mentioned `%sveltekit.head%` in its prose. SvelteKit substitutes
the **first** occurrence of a placeholder and only the first, so the comment ate
it — and the injected markup's own `-->` closed the comment early, killing
hydration and rendering every route blank. It was a regression from #31, six
weeks earlier, and `reddoor-starter` shipped the same shape against
`%sveltekit.body%` (#74) the same day. Nothing in CI caught it in either repo.

**State as of this entry.** `main` at `fa5c05c`, tree clean, nothing in
flight. Four `renovate/*` branches are open at origin, three of them majors
Renovate has never been allowed to land: `@prismicio/svelte` 2.x (pinned ^1.3.1),
`slice-machine-ui` 2.x (^1.26.0), `svelte-gestures` 5.x (^4.0.0). The README's
own follow-up list still stands: `prefers-reduced-motion` gating on the Svelte
`fly` transitions, heading order, and Prismic image `alt` text that depends on
whoever authored the document.

**What changed today.** `CLAUDE.md` did not exist; it does now, and it carries
the work-journal convention. This file is the other half.

## 2026-10-04 — `@prismicio/svelte` 2, then off Slice Machine onto the Prismic CLI (`claude/prismicio-svelte-2`, `claude/prismic-cli`)

Two stacked branches, because the second needs the first: the Prismic CLI's
slice preview page uses `SliceSimulator` from `@prismicio/svelte`, which only
2.2.0 ships, and this site was still on 1.5 (Renovate's #62 had carried the bare
bump on an older base without touching any call site).

**The 2.x upgrade changed nothing anyone can see, and that was measured, not
assumed.** Both origin/main (`1240751`) and the upgrade branch were built and
every prerendered page diffed — eight of them, `/` through `/slice-simulator`,
real Prismic content with 6 to 15 images each. After normalising chunk hashes
the only difference left in every file was the order of one `modulepreload`
link. The deprecated `@prismicio/helpers` went with it: its five import sites
now take `isFilled` / `asImageSrc` from `@prismicio/client`, and the two
`isFilled.link` bodies are byte-identical. `/contact` is server-rendered, so the
diff does not cover it; its only change is that same import.

**Belief corrected on contact.** The interrupted worker before this session
rewrote the RichText `label` serializer as a runes component and wrote in its
header that 1.x "needed" the legacy `<slot>` form, implying 2.x could not take
it. Measured: the old legacy component, dropped back in under 2.x, passes both
new RichText tests and svelte-check with 0 errors. Svelte 5 hands the `children`
snippet to a legacy default slot. The rewrite stays as the native form; the
comment now says it was not forced.

**The Slice Machine exit** follows the fleet recipe (reddoor-maintenance#1090):
`prismic.config.json`, `SliceSimulator` from `@prismicio/svelte`, the CLI in
place of `slice-machine-ui` / the adapter / `concurrently`, and a
`prismic-codegen` job. The pnpm lockfile lost about 2,400 lines, and two of the
three security overrides in `pnpm-workspace.yaml` (uuid, file-type) were there
only for the Slice Machine chain: `pnpm why` found nothing left for either, so
they are gone; cookie stays because `@sveltejs/kit` still asks for 0.6.

Things specific to this repo. The types file used to live at
`src/prismicio-types.d.ts`, and twelve files imported it by relative path. Moved
to the root, all twelve broke (15 svelte-check errors); one more `../` fixed
them, and because the slices import it, `src/app.d.ts` needs no import. The
regenerated types gained `FormRepliesDocument`: `customtypes/form_replies` had
reached Prismic but never the committed types, which is why `reply-copy.ts`
casts its type argument. Prismic also has it, so nothing is missing at the
other end. Field-level, the only other change is the generator's own: a page
`title` that was `TitleField` is now `RichTextField`.

**Framing needed no change.** There is no CSP, no `X-Frame-Options`, no hook and
no `netlify.toml` header block here. The same holds on vite preview (`/`,
`/slice-simulator`, `/health`, `/about`, `/contact`) and on www.erpfunds.com
(`/`, `/slice-simulator`, `/health`, `/about`), so the prerendered
`/slice-simulator` stays prerendered.

**Models match Prismic, by two authorities.** The 2026-10-04 nightly drift log
read `4334703` and found 6 models matching. Then the Prismic connector, read-only:
the same three custom types and three slices, every field's type and config
equal across all nine `FullScreenSlide` variations. The compare script found the
three differences planted in a scratch copy before it was believed.

## 2026-10-04 — The hero loop plays from Prismic files, not Vimeo (#65, `1240751`; reddoor-maintenance decision 63)

The fleet video rollout's first site after Williamson Construction. The
home and investors heroes embedded Vimeo 939245404 ("erp intro", 42 s) as a
`background=1` iframe through `@vimeo/player`; they now play the same clip
from three files in Prismic through `BgVideo`, ported from
williamson-construction-co. The "Who We Are" overlay (939250244, a content
video with sound) is untouched and stays on Vimeo.

**The master.** `ZZ_Archived Clients/Energy Related Properties/Website/
02_Images/0_Final Website Images/Homepage/Intro-compressed.mp4` in Dropbox:
2560×1440, 23.976 fps, 42.688 s. It matched Vimeo's 42 s by duration and,
frame by frame against Vimeo's 1280px thumbnail, at 1.0 s with SSIM 0.795
against neighbours near 0.40 and an unrelated control at 0.30; side by
side the frames are the same shot. `reddoor-maint video` (phone cap
1200k) wrote `erp-intro-1080.mp4` 22,847,460 bytes (4284 kbps),
`erp-intro-1080.webm` 15,293,983 (2868 kbps) and `erp-intro-phone-720.mp4`
6,424,787 (1205 kbps). Staged on draft deploy `6ac2c8f94a9bad9037301ad0`
(never production), read back byte for byte, uploaded by
`prismic-media-upload.yml` run 37238403106 (three `UPLOADED` lines in 6 s,
which is also the first proof that this repo's `PRISMIC_WRITE_TOKEN`
works with the Asset API), and read back again from the Prismic CDN.

**Two defects review found that tests could not.** Round 1 of the
adversarial review (three lenses) found both, and both are this slice's
shape, not the component's. The hero is a `position: fixed` layer under an
`aria-hidden` sticky overlay that relays clicks with `elementsFromPoint`
and `.click()` on each element: an SVG has no `click()`, so a click on the
control's icon threw before the relay reached the button, and has done the
same over the scroll arrow since before this change. The relay now skips
non-HTML elements and the icons take no pointer events. And a fixed layer
is always in the viewport, so the ported "pause off screen" never paused;
`BgVideo` gained an optional `observe` target and the Hero passes its
in-flow sentinel. Round 2 found no blocker or major. Measured on
production afterwards in Chromium: the video pauses when the next slide
covers it, resumes on the way back, and a click on the control's centre
pauses it.

**Readings on production, 2026-10-04 ~23:05Z** (CDP byte sum, 8 s,
unscrolled, two runs each): home at 390px 2.72 and 4.33 MB with the phone
mp4 playing (5.5 s, 6.1 s in); home at 1440px 8.27 and 8.75 MB, the 1080
webm playing; investors at 390px 3.60 and 3.57 MB; at 1440px 5.87 and
5.05 MB. Zero console errors in those 8 s, zero `hydration_mismatch`, no
Vimeo frame anywhere. The phone figure sits around the 3 MB line because
the clip is 42 s and the operator keeps long loops whole (decision 67).
The Vimeo baseline could not be read with the same instrument: the player
runs in a cross-origin iframe whose requests the page's CDP session does
not see, so there is no honest before-number in bytes. Lighthouse
(desktop): Performance 86, Accessibility 98, Best Practices 74, SEO 100,
LCP 1.2 s.

**Best Practices 74 is not the video.** Its three failures are a Typekit
font blocked by CORS (`use.typekit.net`, a console error after the 8 s
window) and the Prismic preview toolbar's `io.prismic.previewSession`
cookies on production (`third-party-cookies`, `inspector-issues`). Vimeo's
Cloudflare cookies are gone. Both are older than this change and are left
for their own fix.

**Content.** Release `asLNBxIAAEu4DsAS`, published ~23:03Z, carried the
three links on each hero. `diff_release` also listed home's first
`full_screen_slide` as changed; every value matched, and only the order in
which fields serialise differed. Production served the new files at
23:04:02Z with no deploy triggered by hand.

**Left as they are.** The poster is the loading placeholder at 1920w with
no srcset, so phones fetch a desktop-sized still, and it loses the old
image's `fetchpriority=high`; LCP still read 1.2 s. The control stays in
the tab order while later slides cover the hero. Investors' poster is a
different still from the clip's first frame, as it already was under
Vimeo.

## 2026-10-04 — The slice simulator leaves every Prismic page's bundle (branch `fix/simulator-chunk-and-encoded-framing`)

Ported from reddoor-starter#168, following caltex-landing#70 and revogen#91; the reasoning and the fixes that failed are recorded in the starter. Since #66 put this site on `@prismicio/svelte` 2.2, the slices and both Prismic routes import `PrismicImage`, `PrismicRichText` and `SliceZone` from the package barrel, and `/slice-simulator` imports `SliceSimulator` from the same barrel. The barrel statically re-exports the simulator, so Rolldown put `@prismicio/simulator` into a chunk shared with the public pages, and home and `[uid]` preloaded it. `scripts/prismic-barrel.ts` declares that one re-export-only module side-effect-free, and Rolldown then binds each import to its own module. The file is the starter's, reformatted by this repo's prettier (tabs, single quotes, no trailing commas); the code is unchanged.

Measured from the build manifest as each node's static-import closure, gzipped, before → after: home 70,185 → 66,001 and `[uid]` 69,762 → 65,581, about 4.2 KB each. Before, both reached the simulator chunk. After, only `/slice-simulator` does (64,794 → 65,105), and it carries the code in its own node. It is still prerendered. The root layout (39,179), `/contact` and `/buildout-map` never reached it and did not change beyond a byte or two of chunk hash.

There is no framing change. The site has no `hooks.server` and sets no X-Frame-Options or CSP anywhere, and `vite preview` showed neither header on any path before or after, including `/slice%2Dsimulator`.

The proof is `tests/smoke/slice-simulator.spec.ts`, which reads the build manifest from disk. It sits in Playwright rather than vitest because this repo's vitest only collects `src/**`. On `main` it failed the bundle check (1 of 3). On this branch it passes 3 of 3. With the plugin removed from `vite.config.js` and the site rebuilt, the bundle check fails again.
