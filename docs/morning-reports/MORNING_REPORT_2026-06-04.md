# Morning brief — 2026-06-04

Repo: `erp-industrial` (SvelteKit + Prismic marketing site, freshly migrated to Svelte 5 / Tailwind 4 / pnpm). Review focus per request: **mobile UX wins**, plus a full repo-health sweep (a11y, bugs, deps, secrets, doc drift). Read-only — nothing was changed.

**Headline:** No critical (data-loss/security) bugs — the contact form is solid now and secrets are clean. The wins here are **mobile UX and accessibility**, where this older site shows its age. Two findings flagged "CRITICAL" by an automated reviewer were **verified false** (see _Verified non-issues_ at the bottom — I'm noting them so a future review doesn't re-flag them).

---

## Top of stack (do these first — highest leverage, ~30 min each)

1. **Kill the `100vh` mobile trap.** [src/app.html:64-71](src/app.html#L64) sets `body { height: 100vh; overflow: hidden }`, and every slide uses `h-screen` (=100vh). On real phones the dynamic URL bar makes `100vh` _taller_ than the visible area → the bottom of each full-screen slide (CTAs, scroll arrow) hides behind the browser chrome and scroll-snap lands a few px off. Switch `100vh`→`100dvh` (and `h-screen`→`h-dvh` / add a `min-h-dvh`). **Biggest single mobile win.** _Note: I could not reproduce this in headless Playwright because it uses a fixed-height viewport with no dynamic toolbar — verify on a real iPhone/Android before/after._
2. **Remove or soften the landscape block.** [src/lib/components/LandscapeModal.svelte](src/lib/components/LandscapeModal.svelte) shows a full-screen black "Please Switch to Portrait Mode" for _any_ mobile/tablet UA in landscape — **confirmed live** (probe screenshot `/tmp/erp-mobile/landscape.png`). An **iPad in landscape is locked out entirely**, and users who keep a phone in landscape for accessibility reasons can't use the site. Either delete it or replace with a non-blocking responsive landscape layout.
3. **Make contact details tappable + fix tap targets.** Phone & email on [src/routes/contact/+page.svelte:130,132](src/routes/contact/+page.svelte#L130) are plain `<p>` (no `tel:`/`mailto:` anywhere in the repo — grep-confirmed). For a real-estate site, tap-to-call is table stakes. While there, the **hamburger button is 13×34px** ([src/lib/components/Nav.svelte](src/lib/components/Nav.svelte)) — the primary mobile nav trigger is far under the 44×44 minimum.

---

## Findings — CRITICAL

None. No data-loss, no security exposure, no broken core flow. (Contact form verified working end-to-end earlier today; `.env` gitignored; secrets server-only via `$env/dynamic/private`.)

---

## Findings — HIGH

**H1 — `100vh` everywhere breaks mobile viewports.** See Top-of-stack #1. [src/app.html:64](src/app.html#L64), pervasive `h-screen`. Fix: `dvh`/`svh`.

**H2 — Landscape hard-block locks out tablets.** See Top-of-stack #2. [src/lib/components/LandscapeModal.svelte:15](src/lib/components/LandscapeModal.svelte#L15). Also `screen.orientation` is read without a guard (can be undefined in some browsers → throws). Confirmed blocking live.

**H3 — No `prefers-reduced-motion` support (a11y, WCAG 2.3.3).** Zero occurrences across `src/` and `app.css` (grep-confirmed). The site is built almost entirely on staggered `fade`/`fly` transitions, a full-page fade-to-black route transition, and scroll-snap stacking — nauseating for vestibular-sensitive users and a near-certain axe/Lighthouse hit. Fix: add a global `@media (prefers-reduced-motion: reduce)` reset in [src/app.css](src/app.css) and gate the JS-driven transitions (layout overlay, Hero) on `matchMedia('(prefers-reduced-motion: reduce)')`.

**H4 — Hero CTAs are mouse-only + the mousemove handler is a hot path.** [src/lib/slices/Hero/index.svelte:184-193](src/lib/slices/Hero/index.svelte#L184) is a full-screen `onmousemove`/`onclick` layer with `aria-hidden="true"` that re-dispatches clicks via `document.elementsFromPoint`. The Hero CTA ("Watch"/button) sits _under_ it → **keyboard and screen-reader users can't activate it**, and [handleMouseMove (lines 37-72)](src/lib/slices/Hero/index.svelte#L37) runs `elementsFromPoint` + Set diffing + DOM class/cursor mutation on _every_ mousemove (jank on low-end devices, especially over the Vimeo iframe). Fix: make CTAs real top-layer focusable elements; drop the forwarding or throttle via rAF with an early-exit.

**H5 — Legacy-mode reactivity trap in two globally-mounted files.** [src/routes/+layout.svelte:36-38](src/routes/+layout.svelte#L36) (`isSnappy`, `isTransitioning`) and [src/lib/components/LandscapeModal.svelte:5](src/lib/components/LandscapeModal.svelte#L5) use plain `let` for mutated UI state. These **work today** only because neither file uses a rune (so they're in Svelte-4 legacy mode where top-level `let` is still reactive — I verified the config doesn't force `runes: true`, and the modal empirically renders). The trap: the moment anyone adds a single rune to either file during future work, those `let`s silently become non-reactive and the page-transition overlay / landscape modal die with no error. Fix proactively: convert to `$state(...)` now so the files are rune-safe.

---

## Findings — MEDIUM

**M1 — Mobile footer social links go to generic sites, not ERP.** [src/lib/components/Footer.svelte:85-91](src/lib/components/Footer.svelte#L85) (the `md:hidden` mobile block) links to bare `https://linkedin.com` / `facebook.com` / `loopnet.com`, while the desktop block [lines 45-56](src/lib/components/Footer.svelte#L45) uses the correct company URLs (`linkedin.com/company/erp-industrials/`, etc.). Mobile users tapping social icons leave to a generic homepage. Copy the real URLs over.

**M2 — Contact page: long dead scroll before the form on mobile.** Probe screenshot `/tmp/erp-mobile/contact.png` shows the address/phone/email block with large `mt-48`/`my-32` gaps, pushing "SEND US A MESSAGE" far below the fold. Tighten vertical rhythm on mobile or move the form up.

**M3 — Tap targets under 44px throughout mobile chrome.** Beyond the hamburger (H/Top-3): footer + nav-overlay links measure ~15px tall, social icons 18×24 (probe data). Add vertical padding for touch.

**M4 — Mobile nav overlay has no focus trap / Escape / scroll-lock.** [src/lib/components/Nav.svelte:23-47](src/lib/components/Nav.svelte#L23). Keyboard users can tab "behind" the open menu; Escape doesn't close it; the page scrolls underneath. Fix: focus the close button on open, trap Tab, handle Escape, `inert` the background.

**M5 — Form placeholder contrast below AA.** [src/routes/contact/+page.svelte:215-219](src/routes/contact/+page.svelte#L215) placeholders use `#ffffff99` (~60% white) on `#1d1c1c` ≈ 2.7:1 (need 4.5:1). This is a primary conversion path. Raise alpha.

**M6 — `navLinks` seeded with an empty entry + rebuilt non-reactively.** [contact/+page.svelte:10-18](src/routes/contact/+page.svelte#L10), and the two `[uid]`/preview pages — all start `navLinks` with `{href:'',text:''}` and `forEach`-push once (svelte-check flags "only captures initial value of data"). Renders a stray empty link and won't refresh on client nav. Fix: `const navLinks = $derived(data.nav.data.links.map(...))`, drop the seed.

**M7 — Heading hierarchy is size-driven, not semantic.** [src/lib/components/ContentBox.svelte:60-76](src/lib/components/ContentBox.svelte#L60) takes the heading level as a prop; `bigText`/`teams` inject extra `<h1>`/`<h5>`; `h3` and `h5` are styled identically in [app.css](src/app.css#L47). Pages can ship multiple `<h1>`s and skip levels. Decouple visual size (utility class) from heading level.

**M8 — Weak/missing image alt text.** Logos are `alt="logo"` ([Nav.svelte:57](src/lib/components/Nav.svelte#L57), [Footer.svelte](src/lib/components/Footer.svelte)); team headshots and slide images render `PrismicImage` with no `alt` fallback ([StackedContent.svelte:141](src/lib/slices/FullScreenSlide/variations/StackedContent.svelte#L141), [HalfPageSlide.svelte:28](src/lib/slices/FullScreenSlide/variations/HalfPageSlide.svelte#L28)) — unlabeled if editors leave the Prismic alt blank. Use company name for logos; pass the person's name as alt for headshots.

**M9 — `SliderOfContentBoxes` leaks its autoplay interval.** [src/lib/components/SliderOfContentBoxes.svelte:40](src/lib/components/SliderOfContentBoxes.svelte#L40) starts a `setInterval` with no `onDestroy` clear — when the mobile carousel unmounts (e.g. resize past the breakpoint) it keeps firing on a dead component. Dot clicks ([line 88](src/lib/components/SliderOfContentBoxes.svelte#L88)) don't reset the timer either. Also a `console.log(sliderIndex)` ([line 37](src/lib/components/SliderOfContentBoxes.svelte#L37)) ships to prod.

**M10 — Render-blocking third-party scripts in `<head>`.** [src/app.html:18-19](src/app.html#L18): Font Awesome kit + `buildout.com/api.js` load synchronously (no `async`/`defer`). FA gates _all_ icons (hamburger, arrows, spinners) → slower First Contentful Paint on mobile. `defer` the FA kit; lazy-load Buildout only on the routes that need it.

---

## Findings — LOW (nits / polish — you asked to include these)

- **Invalid CSS that silently does nothing:** `text-shadow: 2px 2px 120px 5px ...` on `h1` ([app.css:37](src/app.css#L37)) — `text-shadow` has no spread value, so the whole shadow is ignored. `.grecaptcha-badge { display: hidden }` ([app.css:127](src/app.css#L127)) — `hidden` isn't a valid `display` value, so the badge isn't hidden by CSS (it's visible on `/contact`, see probe). Empty `h4 {}` rule ([app.css:56](src/app.css#L56)).
- **`relativve` typo** (invalid class, silently dropped) — [Footer.svelte:64](src/lib/components/Footer.svelte#L64).
- **Dead code:** commented `sendToBottomPane` block [Hero/index.svelte:25-29](src/lib/slices/Hero/index.svelte#L25).
- **Legacy `<slot>` / `$$props` stragglers** keeping components in Svelte-4 mode: [ContentWidth.svelte:2,5](src/lib/components/ContentWidth.svelte#L2) (used on nearly every slice), [+layout.svelte:61](src/routes/+layout.svelte#L61), [RichText/Label.svelte:7,9](src/lib/slices/RichText/Label.svelte#L7). Convert to `$props()` + `{@render children?.()}`.
- **README is the stock Prismic starter** — [README.md:1](README.md#L1) still says "Prismic + SvelteKit Minimal Starter" with a demo link and zero ERP/contact-form/Resend/Netlify/env info. **MIGRATION_SVELTE_5.md** lists "spot-check rune migrations" as open — which findings H5/legacy-slot confirm are genuinely still open.
- **`setTimeout`-based nav orchestration** (hard-coded 50/400/800ms) in [+layout.svelte:17-28](src/routes/+layout.svelte#L17) and [contact/+page.svelte](src/routes/contact/+page.svelte) is timing-fragile; prefer driving off `afterNavigate`/transition end events.
- **Dependency CVEs are dev-only.** `pnpm audit` = 11 (3 high / 4 mod / 4 low), but every one is under `@lhci/cli`, `slice-machine-ui`, or `@reddoorla/maintenance>mjml` (build/dev tooling) — **none ship to the browser**. The `cookie <0.7.0` via `@sveltejs/kit` is transitive and low-impact. Renovate is configured and will PR the bumps; no action needed beyond merging those.
- **Local branch clutter:** 5 stale local `maint/*` + `onboard/*` branches from the automated onboarding (`git branch`); all work is merged. `git branch -D` them when convenient.

---

## Open loops carried forward (intentionally not addressed tonight)

- **Real-device mobile verification of H1 (`100vh`).** Headless Playwright can't reproduce the dynamic-toolbar clipping; needs a physical phone test. Carrying forward as the one finding I couldn't fully confirm visually (the CSS strongly implies it).
- **Lighthouse/axe baseline.** CI runs `reddoor-maint audit --only a11y`; I did not pull the latest scores. H3/M4/M5/M7/M8 are all likely contributors — worth a baseline run after fixes.
- **Production deploy verification** of today's merged contact-form work (Resend env vars, `from` domain verification) — that's a deploy check, not a code review item.

## Decisions deferred (needed you, couldn't ask)

- **LandscapeModal: delete vs. redesign?** I recommend **delete** (blocking landscape is rarely justified and hurts iPad users), but it may have been a deliberate design call to avoid a broken landscape layout. Provisional: remove it and instead make the slides tolerate landscape. Your call.
- **reCAPTCHA badge:** hiding it (the intent behind the broken CSS) requires Google's attribution-text alternative per their terms. Provisional: either show the badge or add the required attribution line — don't just fix `display:none`.

## What I did NOT do tonight

Read-only review. **No commits, no PRs, no pushes, no emails/live-service writes, no dependency changes.** The repo is exactly as you left it (local `main` at the merge of PR #2). The only file written is this brief. Temp probe scripts/screenshots live in `/tmp` (`.erp-mobile.mjs`, `/tmp/erp-mobile/`), not in the repo.

---

### Verified non-issues (so the next review doesn't re-flag)

- "+layout / LandscapeModal state is non-reactive → features dead" — **false.** Config doesn't force `runes`; both files are legacy-mode and work (modal render confirmed live). Captured as the _latent_ trap H5 instead.
- "Horizontal overflow on mobile" — **none** on any page at 390px (probe-confirmed). The off-screen reCAPTCHA badge on `/contact` doesn't widen the document.
- "Secret leakage" — **clean.** No secrets in the client bundle (build grep), `.env` gitignored, server-only env access.
