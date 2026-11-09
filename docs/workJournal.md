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

## 2026-10-12 — Black is written in oklab so `bg-black/60` stays measurable by axe (reddoor-maintenance P1-31)

`@reddoorla/maintenance` 0.102.0 added a `contrast-unmeasured` gate, and this site is still on `^0.95.1`. Without this change, the Renovate bump would turn the a11y step red. `BgVideo.svelte`'s `bg-black/60` compiles to `color-mix(in oklab, #000 60%, transparent)`, because this config sets `black: '#000'` and Tailwind reads it through `@config` and writes the value inline. lightningcss then folds that to `oklab(0% none none/.6)`. Chrome renders `none` as 0, but axe-core 4.13.0 cannot parse it, so contrast on that element was never measured. A fleet-wide build grep found the folded value on this site and nowhere else except reddoor-website, whose own fix is reddoor-website#260.

The fix is `black: 'oklab(0 0 0)'`, the same as #260. The built CSS changes in exactly four rules: `bg-black/60` becomes `oklab(0% 0 0/.6)`, and `bg-black`, `active:bg-black` and `hover:text-black` go from `#000` to `oklab(0% 0 0)`. The build has no `none` left in it.

I checked in Chromium that each old/new pair renders identical pixels. Element screenshots over white and over a colour gradient have the same sha256, and a solid-against-60% control does differ. In a probe with axe-core 4.13.0, the folded literal stays `colorParse`, and `oklab(0% 0 0/.6)` is measured.

Honest accounting: the site's CI runs maintenance 0.95.1, which has no `contrast-unmeasured` rule, so a green run here proves nothing about this fix. The gate itself could not run end-to-end in the cloud session, because this repo's Playwright wants a Chromium build the container does not have. The proof will be the Renovate bump to 0.102+ going green.

## 2026-10-20 — SvelteKit 3 and adapter-netlify 7, with the canonical origin moved off `prerender.origin` (`claude/kit3-adapter7`, into `main`)

Renovate's #74 (kit 3) and #73 (adapter-netlify 7) could only land together, because adapter 7 peers kit `^3`, and each was red alone (#73 also failed `codegen`, on a dropped socket while fetching, not on code). This replaces both. P1-53 moved eight fleet repos on 10-19 and held this one behind P1-64. It is the factory-shaped port, as caltex-landing and vineyard-custom-homes did it: `svelte.config.js` became `sveltekit.config.js` calling `createKitConfig` with the same adapter options and the same `VITE_REDDOOR_GATE_FIXTURES` refusal, `vite.config.js` hands it to `sveltekit(kitConfig)`, and `eslint.config.js` imports it. `@reddoorla/maintenance` went from `^0.95.1` to `^0.109.1`. The lockfile moved kit 2.70.3 → 3.1.0, adapter 6.0.4 → 7.0.1, maintenance, cookie 0.7.2 → 2.0.1, `@netlify/types` in, and adapter 6's esbuild and toml parser and kit 2's `@types/cookie`, `kleur` and `set-cookie-parser` out; svelte was already 5.57.2. The `cookie@<0.7.0` floor went with its reason: kit 3 declares `cookie ^2.0.1`.

**The one thing this site had that the others did not: the canonical link's origin.** The root layout built `<link rel="canonical">` from `$page.url.origin`, and `svelte.config.js` set `prerender.origin` from Netlify's `URL` so the prerendered pages carried `https://www.erpfunds.com` rather than kit's `http://sveltekit-prerender` placeholder. Kit 3 removed `prerender.origin`, and its replacement, `paths.origin`, is also the only origin kit 3's CSRF check accepts, which would 403 the contact form on any domain alias. So this takes the starter's route: `sveltekit.config.js` exports `productionOrigin` from `URL`, `vite.config.js` `define`s it as `__REDDOOR_SITE_ORIGIN__`, and a new `$lib/seo.ts` holds only the starter's `siteOrigin`, which swaps the placeholder for it. The layout's canonical is `siteOrigin(page.url) + page.url.pathname`. Beachfront needed five review rounds to learn that a source scan never finds every spelling of a `page.url` read, so the check here is its output check: `scripts/prerender-origin.mjs` builds with `URL` set and fails on any built file naming the placeholder, and it runs first in `pnpm test`, which CI runs. Its control is this site's own measurement, not Beachfront's: the kit 2 build has 33 files outside `_app/immutable` and 10 naming production (8 canonicals, plus the static `robots.txt` and `sitemap.xml`), so it requires at least 25 and 8. The kit 3 build gave 32 and 10, and the same 8 canonical links as `main`, byte for byte. Reverting the canonical to `page.url.origin` failed it with "saw 32 files, 2 naming it".

The 33rd file was `build/_headers`, which adapter 6 wrote for the `/_app/immutable/*` cache headers. Adapter 7 writes the same `public, immutable, max-age=31536000` into `.netlify/v1/config.json`, Netlify's frameworks API, which is how the eight P1-53 sites serve it today.

**What kit 3 would have broken silently, and did not.** Two files imported `$app/stores`: the root layout and `FullScreenSlide`'s `EmbedSlide`, whose `{#key $page.url.pathname}` would have thrown `app_stores_removed` on every page with an embed. Both are on `$app/state`. The contact action, the contact page's Turnstile key and `/health` read `$env/dynamic/*`, which kit 3 makes a view of `src/env.ts`; the starter's `src/env.ts` declares exactly the three they read, now through `$app/env/*`. The matcher moved to `src/params.ts`, the layout renders the starter's local `PrismicPreview`, `/dev` uses `$app/env`, two `error(404, { message })` became `error(404, message)`, `/health` answers through `Response.json`, and the simulator spec reads kit 3's `.svelte-kit/generated/build/` path. The `%sveltekit.*%` trap in `src/app.html` was not touched.

**A belief corrected: `"include": ["src", "tests", "*"]`.** That is caltex's and vineyard's tsconfig, and here it newly type-checked `tailwind.config.js`, whose `safelist` Tailwind 4's `Config` type does not have: one `svelte-check` error the kit 2 tree never reported. The include is now what kit 2's generated one covered (`src`, `tests`, `vite.config.js`) plus `sveltekit.config.js`, and `svelte-check` is back to 0 errors and 6 warnings, the same as `main`. The error itself is real and pre-existing: Tailwind 4 has no `safelist` at all, so that list has done nothing since the Tailwind 4 move. It is filed rather than fixed here.

Measured on `vite preview` of the kit 3 build, against a local stub ingest. With the three variables set, `/health` gave `{"ok":true,"prismic":"ok","forms":{"ingestUrl":true,"ingestToken":true,"turnstile":true}}`, and a same-origin POST to `/contact` answered 200 after the action forwarded it to the stub with the configured `x-forms-token`. With them unset (`env -u`), `/health` gave all three `false` and the POST answered 500 "temporarily unavailable". A POST with a foreign `Origin` answered 403 both times. This site's `/health` does not declare `testMode`, and its action does not forward the marker, so no submission went to the live site, real or synthetic.

Checks on the migrated tree: `pnpm lint` clean, `pnpm check` 0 errors, `pnpm test` the output check plus 26 of 26 vitest (23 before, plus `siteOrigin`'s 3), Playwright 20 of 20 (CI's 7 smoke tests plus the gate's 13). The gate, `tests/kit-config.spec.ts`, is vineyard's port of caltex's plus the starter's `productionOrigin` and `define` tests, committed first and red on kit 2. Mutations, each red: `FORMS_INGEST_URL` dropped from `src/env.ts` failed "declares every variable" (my first attempt edited nothing, because prettier had re-indented the file with tabs; the grep count caught it); a restored `svelte.config.js` stopped `pnpm check` and the gate's webServer with `config_file_unsupported`; a `$app/stores` import in `EmbedSlide` failed the gate's stores test and one `svelte-check` error; the canonical back on `page.url.origin` failed `prerender-origin`.

Review round 1 ran three lenses. The runtime lens found nothing above a nit. It compared both builds' prerendered output, every absolute URL included, ran 16 routes under `vite preview`, tested the contact action and CSRF through the Netlify function handlers on three hosts, and in a browser checked the fade transition, `EmbedSlide`, the Buildout iframe and the preview toolbar. All of it matched `main`. The completeness lens found minors only.

The gate lens found one major, the same one as vineyard-custom-homes#96's. The origin test set `URL` but never `NETLIFY` or `CONTEXT`, so a `paths.origin` set only on Netlify passed both the gate and the output check, and the contact form 403s on any alias. The gate now sets Netlify's whole build environment and runs once per deploy context. The same guard now fails all three contexts. The output check builds with `NETLIFY` and `CONTEXT=production` as well. It still passes that guard, and correctly so: a set `paths.origin` puts the production URL in the output, so the CSRF damage is the gate's to catch, not the output check's.

Also folded in:

- The env scan refuses a namespace re-export or a dynamic `import()` of `$app/env/*`, because it cannot follow either, and its own control proves it sees both.
- The upstream `PrismicPreview` is caught through a namespace import or a re-export as well as a named import.
- The output check now lists the offending files before it checks its control. Reverting the canonical used to fail with "expected a full build", which reads as a broken build; it now names the 8 pages.
- The absent `/dev/animate-in` fixture is declared, so the CI a11y audit is back to `pass`.
- The journal's lockfile sentence now lists the three kit 2 transitive packages that left.
- The spec's comment no longer claims Playwright is the only runner here.

Round 2 ran one reviewer across all three lenses. It found no major: the three `paths.origin` guards each fail their own context, a guard placed in `vite.config.js` (out of the spawned import's sight) still fails through `kitOptions`, and nothing leaks between contexts. Its minors are folded in. A bare `export * from '@prismicio/svelte/kit'` and a backtick ``import(`$app/env/private`)`` now fail their checks, each with a control line. The Netlify `URL` carries a trailing slash, so the define test tells the origin from the raw value. Playwright now runs 23: CI's 7 smoke tests plus the gate's 16.

## 2026-10-20 — The contact form is covered by the fleet's form-e2e probe (#78)

The nightly form-e2e probe in reddoor-maintenance refuses to submit to a site whose `/health` does not declare `forms.testMode`, because an unmarked probe is a real lead in the client's inbox. ERP had a working form and no end-to-end coverage: the 2026-10-20 07:12Z run listed `erp-industrials` in `FLEET_FORM_E2E_UNCOVERED`. Operator decision 31 (reddoor-maintenance#779) put it, and four other sites, in one PR each.

The action now forwards the probe's hidden `testMode=true` input as top-level boolean `testMode: true` (`src/lib/server/contact-payload.ts`, read from the submitted `FormData` and accepting only the string `"true"`), `/health` declares it, and the thank-you renders inside an always-present `role="status"` region. That region is the probe's success signal. Review round 1 moved it there from the thank-you block itself, because a live region inserted together with its text is announced unreliably. The layout sets `html[data-hydrated]` on mount, which the probe waits for (up to 5 s) before it fills.

**The probe cannot see a broken forward.** Run against a local fixture that declares `testMode` and drops it, maintenance's real runner reported success: it only sees `role="status"`. Such a site would pass every night while emailing ERP a lead. So the proof has to be a test of the ingest body. The first version unit-tested the helper, and review found that removing the helper from the action still passed CI. The smoke suite now starts a capture server (`tests/smoke/ingest-capture.ts`) and `playwright.config.ts` forces `FORMS_INGEST_URL` at it. That assignment is forced, not defaulted, so a smoke run cannot reach central ingest. The spec submits the real form, probe-shaped and visitor-shaped, and asserts on the body ingest would receive. Removing the forward from the action turns it red (1 of 3). So does removing `role="status"` (2 of 3).

**Measured.** Against this branch's production build, with ingest pointed at a local capture server, the runner reported `success:true` in 944 ms click to banner (814 ms to the action's POST). It synthesised `interest` (Leasing), and the captured body carried `testMode: true`. The action's 800 ms fill-time screen drops a faster submit without forwarding it, so the spec waits 1.2 s, as the probe does.

Review ran three rounds. Round 2 found that a retry could never pass (the capture outlived it and the marker was the test id alone) and that the fixed capture port collided between suites; both are fixed, and the spec also asserts that `/health` declares `forms.testMode`. The branch then took main's SvelteKit 3 migration (#79) in a merge commit: the action and `/health` read env through `$app/env/private`, `src/env.ts` declares both ingest variables, and the spec, the harness and a re-run of the forwarding mutation all held on kit 3. Round 3 was nits only.

## 2026-10-27 — The toolbar test keeps main's sleep; the preview-end source check stays, because ending a preview is broken here (#86)

The fleet test audit (`reddoorla/reddoor-workspace` `audits/2026-10-26-fleet-test-audit/report.md`, batch D) flagged two tests here. Its mutants for this site were all Playwright, so none had a vitest catch to restore.

"a normal visit loads no Prismic toolbar" keeps main's `load` plus a fixed 3 s wait, and it is the one sleep left in this spec. This PR tried to replace it three times, and each replacement's verdict depended on when a third party answered. A wait for network idle was set by the home page's streamed Prismic CDN video (idle at 6.5 to 6.9 s on a warm dev server; under load the test timed out in 4 of 7 runs where main's passed 3 of 3). A wait for the layout's `html[data-hydrated]` marker, with no timers run, let a toolbar injected 1 s after mount through 5 of 5 (round 4). A fake clock with a wait for the page's own fetch, xhr and script requests to settle (round 5) covered a toolbar loaded once a fetch answered only while that fetch was fast: green 4 of 15 at head, where main's version was red 5 of 5. Round 6 then found that the settle wait counted requests from every frame and origin, so Buildout's `inventory.json` delayed 6 s turned a correct page red 3 of 3 (`Expected: 0, Received: 1`), where main's version was green 3 of 3. Main's version catches every input those rounds used that loads the toolbar within about 3 s of `load`; it misses a longer timer (round 6's 12 s one) and a chained timer (a response that sets a timer which starts the next fetch, then mounts the toolbar), as every version this PR tried missed something past its own bound. So this PR restores main's test exactly, and the sleep stays, named here as the one sleep left in the spec. Restored, the first test of a cold dev server ran 28.5 s when it passed, and in two of the four cold starts measured it ran out of the 30 s default budget (once at `page.goto`, once at the 3 s wait). Review 3's 60 s budget for this test went with the restore; if a cold CI runner hits the same budget, the fix is a `test.setTimeout`, which this PR does not add.

The other change was meant to retire the source-text check in `tests/kit-config.spec.ts` that reads `PrismicPreview.svelte` for `reset: false` (reddoor-starter#188), once vineyard-custom-homes' new browser test was ported here. The port does not work, and the reason is a live defect: **ending a preview never leaves `/preview` on this site.** Against the production bundle, with the `io.prismic.preview` cookie set on `/preview/about`, six `prismicPreviewEnd` events 1.5 s apart left the URL at `/preview/about` every time; the dev server does the same. The cause is the layout's fade transition. Its `beforeNavigate` cancels every cross-path navigation and re-issues a plain `goto(to.url)` 400 ms later; by then `PrismicPreview` has already spent its `endingPreview` flag on the first, cancelled navigation, so its own `beforeNavigate` treats the re-issued one as a stray link and sends the editor back to `/preview/about`. With the layout's interception short-circuited, one event reaches `/about`. The scroll half of vineyard's test could not apply in any case: the page scrolls inside `main` (`h-dvh overflow-scroll`), the window never moves (720 of 720 px), and the layout resets `main` to the top 400 ms after every navigation, so `reset: false` has nothing visible to keep here. Vineyard's test, run verbatim, fails on its first scroll assertion (window `scrollY` 0).

So the source check stays, unchanged. A test that passes today would have to assert the bug, so the browser test went in as `test.fail("ending a preview reaches the published page (#87)")` instead: it asserts the fix, is green while the defect stands, and reports an unexpected pass the day it is fixed (proved by short-circuiting the layout's interception), which forces the source check out in that change. The defect itself is reddoorla/erp-industrial#87, for its own session.

Review 2 found two holes in that expected failure. Its first version retried the event every 2 s, and each dispatch starts a `goto` that supersedes the one in flight, so with #87 fixed and `/about`'s data delayed 2.5 s it stayed green 3 of 3: the fix would have gone unnoticed. It now dispatches once and waits for the first main-frame navigation after the dispatch, then asserts its pathname (review 4: the 15 s URL wait spent about 15 s of a 60 s budget on a wait that fails by design, and one timeout at load about 23 is consistent with that). Under a 16 s `/about` delay with #87 fixed, the fix reports "Expected to fail, but passed" 3 of 3, and the unfixed tree stays an expected failure 3 of 3. The second hole was that any failure counts. Moving the check that `window` has the `prismicPreviewEnd` listener into an `expect.poll` did not help, because a poll that runs out reports an ordinary failure, which `test.fail` accepts (a listener that never attached came out green). So the test is now an ordinary test that calls `test.fail()` only after hydration and the listener are proved: a missing marker or listener is red. After that point any failure still reads as "#87 stands" (a "fix" whose first navigation lands somewhere other than `/about`, such as `/` from a bad prefix strip), and the comment above the test says so. Review 5 found the two examples this paragraph first gave wrong: a 500 on `/about` with #87 fixed is red ("Expected to fail, but passed"), and a navigation that never starts is `timedOut`, so neither hides. An end handler that throws is red: nothing navigates, the wait runs to the budget, and the result is `timedOut`. Review 4 measured this 1 of 1 with a `throw` at the top of the handler; this session did not re-run it. The test has its own 60 s budget, because a cold dev server spent about 15 s on `/preview/about` and the resulting timeout was red, not the expected failure. Review 3 raised "a normal visit" to the same 60 s, for the cold first compile of `/`: a first run at load 7.3 to 7.7 took 30.7 s, which the old 30 s budget would have failed. This PR later restored main's 30 s default for that test (see the paragraph on "a normal visit" above).

## 2026-11-04 — Fleet majors pilot: staging created; @prismicio/svelte 3, vitest 5 and the svelte-gestures removal on it; Node 26 held (#75, #85, #90, #93, #94)

This was phase 1 of the fleet majors work (reddoorla/reddoor-maintenance#1949). The cockpit listed ERP as five packages a major behind: `@prismicio/svelte@2`, `@types/node@24`, `svelte-gestures@4`, `typescript@6` and `vitest@4`. The aim was to clear each one here and write a recipe that the other sixteen sites follow (`briefs/2026-11-04-fleet-majors/recipe.md` in the workspace).

**The repo had no `staging` branch.** The brief assumed one. The operator chose to set the flow up first. `staging` was cut from `main` at `078a098`, and the Netlify site's `allowed_branches` went from `["main"]` to `["main","staging"]`, the only `build_settings` change. The `staging` ruleset is still the operator's to add, and the promotion (#94) must wait for it, because `delete_branch_on_merge` would delete an unprotected `staging`.

**@prismicio/svelte 3 (#75) and vitest 5 (#85) needed no code change at all.**

- The site already used v3's forms: a `children` snippet on `SliceSimulator`, and no `SvelteRichTextSerializer`.
- The prerendered HTML of all eight pages is identical to v2's except for v3's new `<!--prismic-slice-start/end-->` comments and one trailing space in a class attribute.
- vitest 5 ran the same five files and thirty tests, with the same per-file counts (2, 17, 4, 3, 4).
- Mutation 1, the v2 `let:slices` slot, fails `svelte-check` on v3 and passes on v2.
- Mutation 2, pinning vitest 4 with the v5 config, stays green. There was no config change for v4 to reject. So on ERP the proof that v5 is in use is CI's `RUN v5.1.0` line.

**svelte-gestures was a dead dependency.** Its last import was removed as unused in `bc2ec53`, and the slider it once served is button-driven. The operator chose removal over the bump for the whole fleet. #90 removed it, and Renovate's #63 was closed unmerged.

**TypeScript 7 is held.** With 7.0.2 installed, `svelte-kit sync` dies with `Cannot read properties of undefined (reading 'readFile')`, and eslint stops with `typescript-eslint does not support TS 7.0.`. TS 7 is the Go compiler and has no JS API, and kit 3.1.1, svelte-check 4.7.8 and typescript-eslint 8.72.1 all cap at TS 6.

**Node 26 (#93) is built, green and held.** This is the belief that turned out wrong. Moving `NODE_VERSION` to 26 was taken to move production to Node 26, and it doesn't.

- #93's deploy preview lists `sveltekit-render`, the function that serves `/contact`, `/health` and the previews, on `nodejs24.x`.
- Netlify falls back to 24 because AWS's `nodejs26.x` is still a preview.
- With `@types/node` 26 on top, `new QuotaExceededError('x')` in server code passes `svelte-check` and would throw in production.
- The operator chose to hold #93 until AWS ships `nodejs26.x` as GA. It will land then, together with `AWS_LAMBDA_JS_RUNTIME=nodejs26.x`.

The same PR found that Node 25 and later ship without corepack. So `prismic-codegen.yml`'s bare `corepack enable` would have failed; #93 installs corepack 0.36.0 first.

**CI runs more than this file's `CLAUDE.md` says.** `ci / ci` also runs `pnpm test` (vitest) and `pnpm test:smoke` (26 Playwright tests), not only prettier, eslint, svelte-check, build and a11y.

**Two landing notes.**

- A second lockfile PR conflicted as soon as the first landed. Each was resolved by merging `staging`, taking its lockfile and running `pnpm install --lockfile-only`, never as text.
- The `@smoke` suite targets only a local server, so the staging URL was checked by hand: each route's status, `/health`, and the markup against production. It matched apart from the contact form's per-request timestamp.

The review minors are filed as #91 (no test proves slices or the simulator render, and `vitest-setup.ts` is not load-bearing) and #92 (stale comments, `engines.node`).

## 2026-11-04 — #86 retargeted from `main` to `staging` (P1-84)

ERP took the staging flow today (the fleet majors pilot above; promotion #94), so this PR moved to `staging`. I merged `origin/staging` (`3553bd0`). The only conflict was this file, where both entries are kept, and with this file left out the diff against `staging` matches the old diff against `main` line for line. The risk was `@prismicio/svelte` 3, now on `staging`: if v3 had fixed #87, the `test.fail` test would pass and go red. It did not. `tests/smoke/prismic-toolbar.spec.ts` passed 3 of 3 on the merged tree, the expected failure included, and #87 is still open. Lint and svelte-check are clean, with 0 errors and the 6 warnings `staging` already has.

## 2026-11-06 — jsdom 30 → 31 on `staging` (P1-102, reddoorla/reddoor-maintenance#1967)

jsdom is a devDependency here, used only as vitest's `environment: 'jsdom'`, and it never ships to visitors. The 11-05 nightly listed `jsdom@30` as ERP's one major behind, which kept ERP in the cockpit's Watch. Renovate's `jsdom-31.x` branch was still "Awaiting Schedule" on the Dependency Dashboard (#41), so the bump was cut by hand from `staging` (`01f9f60`) with `pnpm add -D jsdom@^31.0.0`. Only `package.json` and `pnpm-lock.yaml` change. jsdom 31 drops `css-tree`, `@asamuzakjp/*`, `@csstools/*` and `bidi-js` from the tree and adds `bcp-47`, `parse5-parser-stream` and the `is-alpha*` helpers. Its one peer, `@napi-rs/canvas`, is optional and not installed.

vitest ran the same 5 files and 30 tests on jsdom 31 as on 30, with the same per-file counts, all passing (Node 24.22.2, vitest 5.1.0).

jsdom 31 replaced its CSS engine (jsdom `d8867d0`, "Replace CSS parsing, selectors, and computed styles"). Inline styles now read back the way browsers serialise them: `translateY(0)` reads back as `translateY(0px)`, `calc()` comes back simplified, and a `var()` shorthand reads back as `""` once one of its longhands is set. ERP has no test that reads an inline style back, so nothing here changed. Six other sites in this sweep do have such tests, and they fail on 31. Those are held for the operator's decision.

Mutations:

- **The deps audit.** maintenance's `loadHoldRules` with `scanOutdated`, run on `staging`, gives `behind: ["jsdom@30"]`. On this branch it gives `behind: []`, and the holds are unchanged (`@types/node@24`, `typescript@6`).
- **The test environment.** With `environment: 'node'`, 23 of the 30 tests fail, all of them DOM tests such as `BgVideo.test.ts`. So the suite really runs on jsdom.

## 2026-11-09 — The old `/fasken-center.html` and `/who-we-are.html` 301 instead of 404, and the sitemap lists `/investors` (`fix/gsc-legacy-404s` → `staging`)

Search Console emailed at 1:46am PT on 11-09 that `https://www.erpfunds.com/` had a new indexing reason, "Not found (404)". The indexing report has no API, so the URLs behind it were found by asking the property itself. The GA service account is `siteOwner` on `https://www.erpfunds.com/`, a URL-prefix property. The candidates were the 5 sitemap URLs plus every page in Search Analytics over 16 months (12 pages), each checked by `urlInspection.index.inspect` and by `curl`. Two of them 404:

- **`/fasken-center.html`**: 8,233 impressions and 164 clicks from 2025-07-10 to 2026-11-08, of which 3,014 impressions and 35 clicks fall in the last 90 days. It ranks at about position 1.8 for "fasken" every day this month. So Google sends people to a 404 from its first result for the building's name. The Fasken Center is a slide on `/office`, so it now 301s there.
- **`/who-we-are.html`**: 2 impressions in August 2025. It 301s to `/about`.

Corrected on contact: URL Inspection calls `/fasken-center.html` "URL is unknown to Google" while Search Analytics shows it ranking daily. Inspection is not the authority on whether an old URL is in the index. The status code and the Search Analytics rows are.

The redirects are a `handle` hook (`src/hooks.server.ts` → `$lib/legacy-redirects`), not `netlify.toml`, for the reason Roalson's identical hook records: adapter-netlify serves the site through one function claiming `/*` (`split: false`), and Netlify matches a function's path before redirect rules. Measured on `vite preview` of the production build: both old paths, and the upper-case variant, answer 301 to their targets; `/nope.html` still 404s; `/office`, `/about`, `/investors` and `/index.html` answer 200. The unit test fails with either map entry removed.

`static/sitemap.xml` was missing `/investors`. That page is in every page's nav, has a self-canonical, is indexed, and drew 7,027 impressions in 16 months. Now the sitemap lists all six nav pages. It is still a hand-written file, so the next page added in Prismic has to be added there by hand.

Left as they are, on purpose. The site serves `www` as primary (the apex 301s to it, and the property is `www`), so this is not one of the apex-primary sites, and nothing here changes that. `/index.html` is "Alternate page with proper canonical tag" pointing at `/`, which is expected. `/buildout-map` (200, self-canonical, outside the sitemap and the nav, 19 impressions) and `/about?=undefined&safari-private=false` (canonical `/about`) are unknown to URL Inspection and were not in the email.

Usage: see the workspace journal entry for this session.

## 2026-11-09 — The portfolio map fills the last screen again (#101)

Brennan Berry (ERP) emailed at 2:08pm PT that the portfolio map "is no longer showing at the bottom of the first page when you scroll all of the way down". The map was never missing. Buildout's iframe loaded, 764px tall with 75 listings and no console errors. What failed was the last screen of the homepage. Scrolled to the bottom on production, the "Our Portfolio" slide's top sat at −194px in Chromium and −180px in WebKit at 1440×900, so the heading (at −158) was off the top. The fixed nav's logo (32–150px) and links sat over the listings panel and the top of the map.

Three causes, stacked:

- **Footer band vs. a full-height slide.** On md+ the footer is a 20dvh band, and the embed slide above it was a full 100dvh. At the end of the page the slide's top 20dvh scrolled away.
- **The heading row was shorter than the nav.** It was 96px tall, under a logo that reaches 150px. So even a slide at top 0 would have had the logo over the map.
- **The footer overflowed its band.** Its four-link column needs about 182px, more than 20dvh on any screen under 910px tall. At 1024×768 the OFFICE link sat at y 778–808, below the screen and unreachable. Chromium counts that overflow as scrollable, which is why it showed 194 where WebKit showed 180. WebKit does not. A `w-screen` slide under `overflow-scroll` also gave Chromium an idle horizontal scrollbar.

**Why "no longer":** e53777a (2026-06-03) swapped `snap-mandatory` for `snap-proximity`. Under mandatory snapping a scroll came to rest with the map slide's top at the top of the screen. Under proximity it runs to the end of the page. **Prismic is not the cause.** The home document's only change to the embed field since March 2025 removed an inline `height:80vh`, which `EmbedSlide.svelte` already overrode with `height: 100% !important`.

**The fix:**

- `--footer-h: max(20dvh, 11.5rem)` in `app.css` sizes both the desktop footer band and the embed slide (`100dvh − --footer-h`), so the two fill the last screen exactly.
- The footer columns go from `gap-4` to `gap-1`.
- The heading sits beside the logo, and the map starts at 152px.
- `<main>` is `overflow-y-auto overflow-x-hidden`.

After the fix, at the bottom of the page in both engines: section top 0, map from 152px to the footer, footer flush with the bottom of the screen. The map is 540px tall at 1440×900, 408 at 1024×768 and 360 at 1280×720. `tests/smoke/portfolio-map.spec.ts` holds this. It failed on `staging` with `section top = 194` before passing here.

**What was tried and abandoned.** The first cut set the slide to a flat `md:h-[80dvh]`. Chromium still showed a 14–40px strip between slide and footer. Listing every element below the footer's bottom edge found the overflowing OFFICE link, which is what led to the shared variable.

**Beliefs corrected.**

- The first test run failed at 1024 with the slide 2304px off. The layout's `afterNavigate` scrolls `<main>` back to the top 400ms after load, and on a cold dev server that reset landed after the test's scroll. The test now waits it out.
- The first push failed CI on svelte-check (`'m.footer' is possibly 'null'`) in the new test, which I hadn't type-checked locally. That was fixed in `a88cafc`.

**For the operator:**

- Below md the footer is a full screen of its own, so the very bottom of the page on a phone is the footer. The map is the full screen before it.
- Buildout's own cookie-consent modal covers the middle of the map until it is dismissed. It belongs to Buildout and was not touched.

Usage: not readable

## 2026-11-09 — Slides always come to rest whole; phone hero, footer and logo fixes (#103)

> Stacked on #101 (the entry above).

Tucker asked mid-session for a pass on the scroll snap and the site's general jank ("I made it a long time ago and it does feel a little janky").

**The instrument came first, and two were thrown out.**

- Chromium's CDP `Input.synthesizeScrollGesture` with `gestureSourceType: 'touch'` scrolled nothing, even on a plain four-section test page.
- Its mouse gestures and Playwright's wheel events both snap to the _nearest_ point under `snap-mandatory`, so a 450px gesture on a 664px page snaps back to 0. WebKit snaps in the scroll direction instead.

Neither reproduces a trackpad fling or iOS momentum, so how it _feels_ was not measured headless. What was measured is the snap map: instant-scroll to positions across the page, let the browser re-snap, and record where it settles. On the test page that gave 0/900/1800/2700 in both engines before it was trusted.

**Snapping.** As shipped (`snap-proximity`), /about at 1440×900 settled at 14 points between slides (360, 540, 1260, 2160, 2340…). e53777a chose proximity because mandatory fought the old JS that toggled slides between sticky and relative. **Belief corrected:** I expected sticky slides to put the mandatory snap points in the wrong places in Chromium. Forcing `y mandatory` on the shipped page put every one exactly on a slide boundary, in Chromium and WebKit, desktop and iPhone 13. So the change is one class. `tests/smoke/scroll-snap.spec.ts` runs the map on /about and /office. It fails on `staging` and passes here.

**Footer.**

- Desktop vs. phone layout was chosen from `bind:innerWidth`, which is 0 in SSR, so every desktop visit was served the phone footer and swapped it on hydration. Now both are in the markup, switched at `md` by CSS.
- The phone footer was `justify-end` and overflowed upward under the nav, so its logo printed over INDUSTRIAL PORTFOLIO. It is now centred below 96px, in two columns.
- At 1024px the `w-1/6` columns ran INDUSTRIAL PORTFOLIO into DST INVESTOR PORTAL.
- Contact was a `<button>` inside an `<a>`.

**Phone hero.** The 200% "large" logo sat over the About title, and `pb-32` pushed about 460px of copy up under it. The large logo is now md+ only, and phone padding is `pt-24 pb-16`.

**Logo.** It shrank on the first scroll (`{ once: true }`) and never grew back. It now tracks `scrollTop < 8`, with the listener removed on unmount.

**Tried and reverted.** I registered the footer with `slideObserver` so the nav would turn light over the black phone footer. A screenshot showed the nav is not visible there at all: both are `z-40` and the footer paints later. So the change did nothing and came out.

**Noticed, not changed.** On /office at 1024 the nav links are dark over the black half of the Tenant Portal slide. That is the slide's `isnavlight` in Prismic, a content setting.

Usage: not readable

## 2026-11-09 — The portfolio map slide follows the Figma design (`fix/portfolio-map-design`)

> Corrects in part 2026-11-09 — The portfolio map fills the last screen again (#101).

After #101 and #103 merged, Tucker found the map slide "not working as intended, some weirdly tight margins and the map looks cut off". The reference is the "Build Out Map" frame (`5018:13743`) and "our portfolio" frames in the 2024 **ERP Website Design** Figma file (`xRX9GaUhKI2rGaq0RtJJ5U`), found through a Figma comment email because nothing in this repo links it. In that design:

- The slide is off-white (#fafafa).
- "OUR PORTFOLIO" is centred under the nav.
- The Buildout widget is about 580px tall, inside the content column, its edges lined up with the logo on the left and the nav on the right.
- There are about 50px of air before the footer. On a phone the map is inset under the heading.

What `staging` rendered after #101:

- **Edge to edge.** The widget ran 0–1440 on desktop and was inset only 8px on a phone. The section was pure white against Buildout's off-white panels.
- **Squeezed.** #101 made the slide share the last screen with the 184px footer band, so the widget was 360px tall at 1280×720 and 408px at 1024×768, with listing cards and map cut off. **#101 traded the map's size for its position, and that was the wrong trade on laptop-height screens.**

The fix:

- `--map-slide-h: max(calc(100dvh − --footer-h), 44rem)`. On screens 888px and taller the section and footer still share the last screen exactly, as #101 intended. Below that the slide keeps 44rem, is its own snap stop (mandatory since #103), and the footer comes one scroll later.
- The widget is in `ContentWidth`, so it lines up with the logo, with `md:pb-12` of air below.
- The section is #fafafa.

Measured, resting on the slide: the widget is 110–1330 × 168–668 (500px) at 1440×900, and 488px tall at 1280×720 and 1024×768, in Chromium and WebKit. On an iPhone 13 it is 16–374 × 136–632.

**A defect hit on the way.** Moving `.buildout-embed` onto `ContentWidth`'s class prop silently dropped the iframe to 150px tall. Svelte scopes a component's `<style>` by hashing its own elements, and a class string passed to a child component's element never gets the hash, so the scoped rules matched nothing. The rules are now `:global(.buildout-embed …)`.

`tests/smoke/portfolio-map.spec.ts` is rewritten around the two rules:

- Resting on the slide shows the whole section, with the widget clear of the logo, aligned with it, 40px above the section bottom and at least 480px tall.
- At 888px and taller, the section and footer fill the last screen.

It passes here. On `staging` it fails with the widget 41–110px off the content column.

**Noticed, not changed.** Buildout decides whether a phone opens on the listing list or the map; the 2024 design shows the map. Buildout's cookie modal still covers the widget until it is dismissed.

Usage: not readable
