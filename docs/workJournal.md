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
