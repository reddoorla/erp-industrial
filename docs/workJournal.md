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
