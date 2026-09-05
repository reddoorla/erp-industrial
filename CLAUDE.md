# CLAUDE.md

The marketing site for **ERP Industrials** (Energy Related Properties) — a
SvelteKit 2 / Svelte 5 (runes) / Tailwind 4 / Prismic site deployed on Netlify,
managed with pnpm. It is a full-screen slide site: three slices in
`src/lib/slices/` (`Hero`, `RichText`, `FullScreenSlide` — the last dispatching
to four variation components), plus a Vimeo hero and a Buildout listings map.
[README.md](README.md) covers the stack, the env vars and the contact-form
pipeline in full.

## Commands

```bash
pnpm dev          # Vite + Slice Machine, app on :5173
pnpm build        # production build (adapter-netlify)
pnpm check        # svelte-kit sync + svelte-check
pnpm lint         # prettier --check + eslint
pnpm test:smoke   # Playwright smoke suite
```

There is no single `verify` script here. CI is the fleet's reusable workflow
(`reddoorla/.github`), which runs prettier, eslint, svelte-check, build and an
a11y audit on every PR — so run `pnpm lint && pnpm check && pnpm build` before
pushing if you want to know what CI will say.

## Traps

- **Never write `%sveltekit.head%` — or any `%sveltekit.*%` placeholder — inside
  a comment in `src/app.html`.** SvelteKit substitutes the FIRST occurrence and
  only the first, so a mention in prose consumes the real one, and the injected
  markup's own `-->` closes the comment early. That shipped here as #33 and
  rendered every route blank with no error anywhere. Nothing in CI catches it.
- **`src/prismicio-types.d.ts` is generated** by Slice Machine and
  prettier-ignored. Don't hand-edit it; regenerate.
- **Don't touch `src/routes/slice-simulator/`** — Slice Machine owns it.
- **Contact-form recipient routing is dashboard-side**, not in this repo. The
  form only posts `interest` to the central ingest; who receives it is
  configured in `@reddoorla/maintenance` Notify Routing.
- **The branch filter on `push:` in `.github/workflows/prismic-models.yml` is
  load-bearing**, not tidiness — the workflow's own comment explains why.
  It is managed by `reddoor-maint prismic-ci`; change it there, not here.

## The work journal

**Every working session appends a dated entry to `docs/workJournal.md`** — what
was done and **why**, newest at the bottom, never corrected in place. Write it
as the last act of the session, not the first act of the next one.

The journal is the history of executing the build. Code says what the system
does now; the journal says what it used to do, what it cost to change, and
which beliefs turned out to be wrong. Nearly everything expensive to rediscover
lives there and nowhere else.

An entry is headed with the date, a short title, and where it landed:

```markdown
## 2026-09-04 — Both runway stages render their final frame without JS (#51, `ce46ae0`)
```

Then prose — not a bullet list of file names, which the diff already tells you.
What to put in, in rough order of value:

- **Why, over what.** The reason a thing was done survives; the diff does not
  need restating.
- **Measured numbers, exactly.** "The comp's open mask is 2696×2352 on an 860px
  band — 2.735× the band's height, so a 390×664 phone needs ~534%" is worth
  keeping. "Fixed the hero on mobile" is not.
- **Defects, named.** What broke, what it looked like, and what made it
  invisible until it wasn't.
- **What was tried and abandoned**, and what it would take to revive it. A dead
  end nobody wrote down gets walked twice.
- **Beliefs corrected on contact.** The design assumption that turned out false
  is usually the most valuable line in the entry.
- **Honest accounting.** If a win came from somewhere other than the change
  that claimed it, say so — that is exactly what someone will otherwise
  over-invest in next.

**History is never edited to be right.** An entry that stops being true is not
rewritten; a later entry corrects it, and says which one it corrects. The
journal is a record of what was believed at the time, and that record is most
useful precisely where it was wrong. Fixing the past in place destroys the only
evidence of how the mistake was made.

The one edit an old entry may take is a **forward pointer**: one line directly
under its heading naming the entry that overturned it — `> Superseded in part by
2026-10-14 — <that entry's title>.` It asserts nothing new and retracts nothing,
so the record of what was believed survives whole; it only stops a reader who
lands on the old paragraph from leaving with the old answer. Without it the rule
above is half a mechanism: the correction exists at the bottom of the file, and
nothing points to it from where a reader actually arrives.

If a session produced nothing worth an entry, that is itself worth one line.
