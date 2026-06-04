# Morning brief — 2026-06-05

Repo: `erp-industrial` (SvelteKit 2 / Svelte 5 runes + Prismic). This is a **fresh review**, not a recap of the PR #4–#8 sprint. Threshold: all severities (you asked for LOW too). Deep-dive targets you flagged: contact form/email, third-party embeds, scroll/stacking — all three covered below, plus a full repo sweep. Read-only; nothing changed.

**Headline:** The big one isn't in any diff — **the hero `<h1>` (your LCP element) is never server-rendered.** `ContentBox` and the Hero both gate their entire content behind `{#if isMounted}`, so the headline/body only paint after JS hydration. That's a larger LCP lever than the Typekit font we chased last time, and it also means crawlers get an empty hero. Second: the **contact form has two ways to fail silently in production** — worth confirming before you walk, because if one is true you're losing leads right now. The sprint genuinely fixed most of the 2026-06-04 brief (navLinks, slider leak, focus trap, dvh, landscape, tap targets — all verified shipped); the new findings are deeper.

---

## Top of stack (do these first — highest leverage)

1. **Confirm the contact form still works in production (10 min, possibly CRITICAL).** [src/routes/contact/+page.server.ts:86](src/routes/contact/+page.server.ts#L86) reads the reCAPTCHA site key via `import.meta.env.VITE_RECAPTCHA_SITE_KEY` — **build-time inlined**, unlike every other secret here (runtime `$env/dynamic/private`). If Netlify's _build_ environment doesn't have `VITE_RECAPTCHA_SITE_KEY` set, or it has drifted from the hardcoded client key, the Enterprise assessment rejects **every** submission as invalid and all prod contact emails silently fail. **First action: submit the live form once (or check Netlify build env), and confirm it lands.** This is the exact drift trap the client's hardcoded-const was created to avoid — yet the server reintroduced it.

2. **Server-render the hero content (30–45 min — the real LCP/SEO win).** [ContentBox.svelte:49](src/lib/components/ContentBox.svelte#L49) wraps _all_ content (incl. the `<h1>` and `<p>`) in `{#if isMounted}` (`isMounted` flips in `onMount`), and Hero does the same at [Hero/index.svelte:226](src/lib/slices/Hero/index.svelte#L226). Net: the LCP headline is absent from SSR HTML and fades in after hydration (+200ms delay). Fix: render the content unconditionally and move the transition to a wrapper/CSS so the markup is in the server response. Re-measure LCP after this _and_ the Typekit `font-display: swap` — this is likely why LCP stayed ~4s.

3. **Make the route-transition overlay crash-proof (30 min).** [+layout.svelte:13-38](src/routes/+layout.svelte#L13) sets `isTransitioning = true`, `cancel()`s, and schedules `goto()` in 400ms — but `isTransitioning` is reset _only_ in `afterNavigate`. Interrupt that chain (rapid clicks, a redirect, a second nav in the 400ms window) and the full-screen black `z-40` overlay never clears → whole site blocked. Rapid clicks can also double-navigate to the wrong page. Fix: track + `clearTimeout`/re-arm the pending timer, and reset defensively (`goto(...).finally()` and/or a watchdog).

---

## Findings — CRITICAL

**C1 — Contact form can silently fail in production (two independent causes).** Primary lead-capture path for the business; both failures are invisible to the user (they see a generic error or, worse, nothing actionable).

- **Build-time site key:** [+page.server.ts:86](src/routes/contact/+page.server.ts#L86) — see Top-of-stack #1. `import.meta.env.VITE_*` is frozen at build; if unset/drifted, 100% of prod verifications fail.
- **reCAPTCHA score fail-OPEN:** [+page.server.ts:95](src/routes/contact/+page.server.ts#L95) — `recaptchaResult.riskAnalysis?.score < 0.5`. When `riskAnalysis` is absent (degraded/malformed assessment response), `undefined < 0.5` is `false`, so the OR short-circuits and the submission **passes with no score check**. The threshold is enforced only on the happy path. Fix: `const s = recaptchaResult.riskAnalysis?.score; if (!recaptchaResult.tokenProperties?.valid || typeof s !== 'number' || s < 0.5) return fail(...)`.

_(Graded CRITICAL because it's silent failure of the revenue path. Neither is data-loss; if you confirm the live form sends and the score block is present in responses, downgrade to HIGH and fix at leisure.)_

---

## Findings — HIGH

**H1 — Hero leaks a Vimeo `Player`, two timers, and a rAF on every SPA navigation.** [Hero/index.svelte:46](src/lib/slices/Hero/index.svelte#L46) creates `new Player(videoIframe)` but never `player.destroy()`; `onMount` returns no cleanup. The `hardCap` (6s) and `onReady` (1.2s) `setTimeout`s ([:43](src/lib/slices/Hero/index.svelte#L43),[:57](src/lib/slices/Hero/index.svelte#L57)) and the `moveRaf` rAF ([:84](src/lib/slices/Hero/index.svelte#L84)) are never cleared. Hero lives in the home SliceZone, so navigating to /about etc. unmounts it — each home visit leaks a live SDK instance + postMessage listeners pointed at a detached iframe, and timers fire into a dead component. Fix: hoist `player`, `return () => { player?.destroy(); clearTimeout(...); cancelAnimationFrame(moveRaf); }` from `onMount`. _(This is collateral from the otherwise-good PR #5 reveal logic.)_

**H2 — `prefers-reduced-motion` is only half-implemented (a11y / WCAG 2.3.3).** [app.css:126-135](src/app.css#L126) neutralizes CSS `animation/transition-duration` + `scroll-behavior` — but **all the actual motion is Svelte JS transitions** (`transition:fade`, `in:fly={{delay}}`, the 400ms route overlay, the 1000ms StackedContent backdrop), which run via the Web Animations API and **ignore that CSS rule entirely.** A reduced-motion user still gets every fade/fly/stack animation. The CSS block creates a false sense of compliance. Fix: read `matchMedia('(prefers-reduced-motion: reduce)')` into a value and set transition `duration: 0` / skip `delay` on the JS transitions. _(Verified: this is the partially-fixed state of last brief's H3.)_

**H3 — Open Graph tags use `name=` instead of `property=`.** [+layout.svelte:47-52](src/routes/+layout.svelte#L47) emits `<meta name="og:title">` / `<meta name="og:image">`. OG requires `property=`; Facebook/LinkedIn/iMessage ignore `name`-based OG, so shared links get no title card/image. One-character fix per tag.

**H4 — Internal-only routes ship to production and are crawlable.** `build/dev/a11y-fixtures.html` (added in `bd50f9b`) and `build/slice-simulator.html` are publicly reachable. Fix: gate `/dev/*` with `if (!dev) error(404)` in a `+page.server`, and add `Disallow: /dev/` + `/slice-simulator` to robots.txt.

**H5 — `@types/node` is not installed, so `tsconfig` type-checking is degraded.** svelte-check warns `Cannot find type definition file for 'node'` — the generated tsconfig requests `types: ["node"]` but there's no top-level `@types/node` (only unreachable transitive copies). Type-checking of any Node API is silently weakened. Fix: `pnpm add -D @types/node@^20`.

**H6 — No `+error.svelte` / 404, and a bad UID 500s instead of falling back.** [[uid]/+page.server.js:10](src/routes/[[preview=preview]]/[uid]/+page.server.js#L10) guards with `if (page)`, but `client.getByUID` _throws_ on a missing doc rather than returning null — so the `else` home-fallback is dead code and an unknown slug throws an unstyled 500. There's no custom error page anywhere in `src/`. Fix: `try/catch` the load (return home or `error(404)` on `NotFoundError`) and add a branded `src/routes/+error.svelte`.

---

## Findings — MEDIUM

**M1 — Two `<title>` tags render; the dynamic one loses.** [+layout.svelte:44](src/routes/+layout.svelte#L44) sets `<title>` from `page.data.title`, but [[uid]] and home each _also_ hardcode `<title>ERP Industrials</title>` in their own `<svelte:head>`, and `/buildout-map` hardcodes "ERP Properties". Two titles render; the last wins, so the Prismic-driven title is overridden. Fix: delete the per-page `<title>`s; let the layout drive it.

**M2 — SEO meta only exists on `page`-type routes.** `/contact` and `/buildout-map` have no server load supplying `meta_description`/`og:*`, so those routes get none. Fix: add meta to those loads or a shared default.

**M3 — Contact form input hardening.** [+page.server.ts](src/routes/contact/+page.server.ts): no server-side email-format validation (only non-empty, [:59](src/routes/contact/+page.server.ts#L59)); `email` flows raw into `subject` + `replyTo` ([:109-110](src/routes/contact/+page.server.ts#L109)) (Resend's JSON API blunts true header injection, but strip CR/LF + validate anyway); `interest` isn't allow-listed against the known set; no honeypot or rate-limit beyond reCAPTCHA. Fix: validate email + allow-list interest + `fail(400)`; add a hidden honeypot.

**M4 — Double-submit sends duplicate emails.** [contact/+page.svelte](src/routes/contact/+page.svelte) — the submit button swaps to a spinner but isn't `disabled` while `isEmailSending`; Enter-spam fires multiple reCAPTCHA+POST cycles. Fix: `disabled={isEmailSending}` + early-return guard.

**M5 — `SlideOverlay` crashes on an empty CMS video embed.** [SlideOverlay.svelte:17](src/lib/slices/FullScreenSlide/variations/SlideOverlay.svelte#L17) — `slice.primary.video_embed.embed_url.split('/')` with no `?.`; Hero guards this, SlideOverlay doesn't. An editor leaving the embed blank on a `withVideoPopup` slide throws at init and breaks the overlay. Fix: `embed_url?.split('/').pop()`.

**M6 — `BuildOut.embed()` is coupled to a CMS-provided target.** [[[preview]]/+page.svelte:39](src/routes/[[preview=preview]]/+page.svelte#L39) calls `embed({target:'buildout'})` on home, but `#buildout` only exists because an `EmbedSlide` injects it via `{@html}`. Remove/reorder that slice in Prismic and `embed()` runs against a missing target (silent fail — plausibly the home-page 401/Turnstile noise). Fix: guard `if (document.getElementById('buildout'))`, or move `embed()` into `EmbedSlide`'s own `onMount` so target + init are colocated.

**M7 — `withBuildOut` poller can't be cancelled.** [buildout.ts:9-20](src/lib/buildout.ts#L9) self-reschedules up to 5s with no cancel token; navigate away mid-poll and it still fires `embed()` into stale/missing DOM. Also, exhaustion only `console.error`s — a blocked Buildout script leaves a blank portfolio panel with no fallback. Fix: return a cancel fn for `onMount` cleanup; render a visible fallback (link to `/buildout-map` or LoopNet) on exhaustion.

**M8 — `$app/stores` is deprecated in SvelteKit 2.** [+layout.svelte:3](src/routes/+layout.svelte#L3) and [EmbedSlide.svelte:3](src/lib/slices/FullScreenSlide/variations/EmbedSlide.svelte#L3) use `import { page } from '$app/stores'` + `$page`. Modern API is `$app/state` (`page`, no `$`). Works today; will warn louder over time.

**M9 — Heading hierarchy is size-driven, not semantic.** `ContentBox` takes `titleTag` as a free-form prop; [app.css](src/app.css) styles `h3`/`h5` identically; `StackedContent` injects extra `<h1>`/`<h5>` and Hero emits `<h1>` — a page can ship multiple `<h1>`s and skip levels. Fix: decouple visual size (utility class) from heading level; one `<h1>` per page. _(Carried from 2026-06-04 M7 — still open.)_

**M10 — Weak/missing image alt text.** Logos are `alt="logo"` ([Nav.svelte:94](src/lib/components/Nav.svelte#L94), [Footer.svelte:20](src/lib/components/Footer.svelte#L20)); team headshots/backgrounds render `PrismicImage` with no `alt` fallback ([StackedContent.svelte:141](src/lib/slices/FullScreenSlide/variations/StackedContent.svelte#L141), [HalfPageSlide.svelte:28](src/lib/slices/FullScreenSlide/variations/HalfPageSlide.svelte#L28)). Fix: logos → `alt="ERP Industrials"`; headshots → person's name; decorative → explicit `alt=""`. _(Carried from 2026-06-04 M8 — still open.)_

**M11 — `ContentBox`/Hero content gated behind `onMount` (the SSR issue, restated as MEDIUM beyond the LCP angle).** Beyond LCP: no-JS users and crawlers see an empty hero/box; any indexable copy in slides is invisible to search. See Top-of-stack #2.

**M12 — Footer branches layout on a JS width read.** [Footer.svelte:7-14](src/lib/components/Footer.svelte#L7) — `let viewportWidth: number` (plain `let`, uninitialized) drives `{#if viewportWidth > 768}`. SSR renders the _mobile_ footer (undefined → falsy), then swaps on hydration (layout shift). Fix: `$state(0)` + prefer CSS responsive classes over a JS width branch.

---

## Findings — LOW (you asked to include these)

- **Doc drift (several):** [README.md](README.md) "known follow-ups" lists items already fixed (reduced-motion, etc.); [MIGRATION_SVELTE_5.md](MIGRATION_SVELTE_5.md) next-steps are all done; [prismicio.js:17](src/lib/prismicio.js#L17) carries a stale starter TODO though the routes array is actually complete. The 2026-06-04 brief is now mostly superseded — annotate it. Fix: prune stale docs.
- **Starter cruft:** `package.json` name is `sveltekit-starter-prismic-minimal` / version `0.0.1`; duplicate lint config (`.eslintrc.cjs` is dead under flat-config `eslint.config.js`) and duplicate prettier config (`.prettierrc` + `.prettierrc.json`). Fix: rename package; delete `.eslintrc.cjs` + one prettier file.
- **Static assets:** [site.webmanifest:6](static/site.webmanifest#L6) points at `/droid-chrome-192x192.png` but the file is misnamed `ndroid-chrome-192x192.png` (192 icon 404s); `name`/`short_name` empty. [robots.txt](static/robots.txt) has starter `/nogooglebot/`; [sitemap.xml](static/sitemap.xml) is stale (missing `/investors`, `lastmod` 2024). No `<link rel="canonical">` or JSON-LD (Organization/LocalBusiness would fit — address already on the contact page).
- **Nav focus restore targets an unmounted node.** [Nav.svelte:49-52](src/lib/components/Nav.svelte#L49) — the open-trigger is removed while the overlay is open, so the captured `previouslyFocused.focus()` on close is a no-op and focus drops to `<body>`. Fix: re-query the re-rendered trigger at close time.
- **Dead/brittle code:** commented `sendToBottomPane` block in Hero; `@prismicio/helpers` (deprecated) used alongside `@prismicio/client` — consolidate; Hero "Watch" button keyed off the literal title `'Who We Are'` ([Hero:241](src/lib/slices/Hero/index.svelte#L241)) and the overlay Vimeo ID is hardcoded ([:163](src/lib/slices/Hero/index.svelte#L163)) — drive from CMS.
- **Contact `<select>`:** placeholder `<option>` has no `value`/`disabled`/`selected` and a non-existent `text-gr` class; `<select placeholder=...>` is invalid. Form inputs use placeholder-as-label (no `<label>`), no `required`, error banner isn't `aria-live`, and success doesn't move focus. Fix: real labels + `required` + `role="alert"` + focus-to-thank-you.
- **EmbedSlide `:global !important` fill** ([EmbedSlide.svelte:27](src/lib/slices/FullScreenSlide/variations/EmbedSlide.svelte#L27)) is load-bearing and broad (`:global(iframe)`); fine and documented, but scope to `:global(#buildout iframe)` and pin the Buildout `api.js` version so a vendor markup change can't silently break the map fill.
- **`{@html}` of the CMS embed** ([EmbedSlide.svelte:18](src/lib/slices/FullScreenSlide/variations/EmbedSlide.svelte#L18)) is a stored-XSS surface trusting anyone with Prismic access — expected for the Buildout pattern, but document the trust boundary.

---

## Open loops carried forward (intentionally not done tonight)

- **a11y/Lighthouse baseline not pulled.** CI runs `reddoor-maint audit --only a11y`; I didn't fetch current scores. H2/M9/M10 + the contact-form labels are likely contributors — re-baseline after fixes.
- **On-device keyboard test of the Hero CTAs.** Headless can't confirm; my static read says the CTAs are real focusable buttons (so _not_ the hard lockout two subagents claimed), but the click-forwarding `aria-hidden` overlay ([Hero:249-253](src/lib/slices/Hero/index.svelte#L249)) is a fragile mouse-centric pattern. Tab through the hero on a real keyboard before trusting it.
- **Real-device LCP re-measure** after the ContentBox SSR fix + Typekit `font-display: swap`.
- **Rotate the historically-exposed secret keys** (per the `contact-form-secrets-exposed` memory) — repo is clean now, but the old keys were live during the SendGrid era.

## Decisions deferred (needed you, couldn't ask)

- **How aggressive should reduced-motion be?** Kill all entrance flys/route fade, or just shorten them? Provisional: gate every `in:`/`transition:` to `duration: 0` when reduced-motion is set, keep layout intact.
- **Keep the (now-softened) LandscapeModal at all?** Carried from 2026-06-04 — provisional: keep, it's no longer a hard block.
- **reCAPTCHA badge** is hidden via `display:none` ([app.css:121](src/app.css#L121)); Google's terms require the attribution text if the badge is hidden. Provisional: add the one-line attribution near the submit button.

## What I did NOT do tonight

Read-only review. **No commits, no PRs, no pushes, no edits, no emails/live-service writes.** I ran local gates (`build` ✓ 3.2s, `svelte-check` 0 errors/7 warnings, `pnpm audit`), dispatched four read-only review subagents, and read files. Only file written is this brief. (Note: the four merged PRs from earlier today, #5–#8, are already in `main` and verified — unrelated to this read-only pass.)

---

## Grading the 2026-06-04 brief (what the sprint actually closed)

**Fixed & verified shipped:** H1 `100vh`→`dvh` · H2 landscape hard-block → softened · H4 Hero mousemove rAF-throttle · M1 footer social URLs · M2 contact dead-space · M3 44px tap targets · M4 nav focus-trap/Escape · M6 navLinks empty-seed → `$derived` · M9 slider `console.log` + `onDestroy` leak · M10 render-blocking scripts → deferred + preconnect · all the CSS/typo/README-from-stock nits. Plus the Svelte-5 migration landmine (legacy `let` reactivity) was closed.

**Partially fixed:** H3 reduced-motion — CSS done, JS transitions still ungated (tonight's **H2**).

**Still open (re-raised tonight):** M7 heading semantics (→ **M9**), M8 alt text (→ **M10**).

**Verified NON-issues (do not re-flag):**

- **Placeholder contrast.** Both the 2026-06-04 brief and tonight's broad-sweep agent computed `#ffffff99` placeholder ≈ 2.7:1 — but that treats the 60%-white as a _solid_ color. Composited over the dark input bg (`#1d1c1c`) it's ≈ 6.6:1 (**AA pass**). Automated tools that don't composite alpha will keep mis-flagging this; confirm with a tool that composites before "fixing."
- **`state_referenced_locally` warnings** (Hero/StackedContent/SlideOverlay `slice`, `videoId`): benign — those components remount per slice via `{#key slice}`/conditional mount, so the once-only derivation is correct.
- **slideObserver IntersectionObserver lifecycle:** correct — `destroy()` disconnects both observers and deletes the module-level `centred` Map entry; no unbounded growth under normal teardown. (Latent footgun only if a future change swaps nodes without action teardown.)
- **Secrets:** clean — none in working tree or git history; `.env` gitignored; server-only via `$env/dynamic/private`. (Rotation of the SendGrid-era keys still advisable — see memory.)
- **Duplicate-embed on SPA re-nav:** tested earlier this session — always exactly one Buildout iframe; no duplication.
