# ERP Industrials

Marketing site for **ERP Industrials** (Energy Related Properties) — a SvelteKit + Prismic site deployed on Netlify.

## Stack

- **SvelteKit 2 / Svelte 5** (runes), **Vite**
- **Tailwind CSS 4**
- **Prismic** as the CMS (Slice Machine for slice modeling)
- **Resend** for contact-form email delivery
- **Google reCAPTCHA Enterprise** (score-based) on the contact form
- **Netlify** hosting (`@sveltejs/adapter-netlify`)
- **pnpm** package manager
- Shared config + a11y/Lighthouse tooling via [`@reddoorla/maintenance`](https://www.npmjs.com/package/@reddoorla/maintenance)

## Local development

```bash
pnpm install
pnpm dev          # runs Vite + Slice Machine concurrently
```

The app runs at `http://localhost:5173`. Slice Machine runs alongside for editing slice models.

### Environment variables

Create a `.env` (gitignored). Server secrets are read at runtime via `$env/dynamic/private`.

| Variable                   | Scope            | Purpose                                                                    |
| -------------------------- | ---------------- | -------------------------------------------------------------------------- |
| `RESEND_API_KEY`           | server (private) | Resend API key for contact-form email                                      |
| `RECAPTCHA_SECRET_KEY`     | server (private) | Google Cloud API key for the reCAPTCHA Enterprise assessment               |
| `VITE_RECAPTCHA_SITE_KEY`  | server           | reCAPTCHA Enterprise **site** key (public; used in the assessment body)    |
| `CONTACT_TEST_EMAIL`       | server, dev-only | If set, all local form submissions route here (never emails real contacts) |
| `VITE_PRISMIC_ENVIRONMENT` | build            | Prismic environment override (optional)                                    |

For local contact-form testing you only need `RESEND_API_KEY` (and optionally `CONTACT_TEST_EMAIL`) — **reCAPTCHA is skipped in dev** (it's enforced in production only, via `$app/environment`'s `dev` flag), so you don't need to allow-list `localhost` on the reCAPTCHA key.

## Contact form

`src/routes/contact/+page.server.ts` is a SvelteKit form action (runs as a Netlify function — it is **not** a Netlify "Form"):

1. Verifies the reCAPTCHA Enterprise token (production only; score threshold 0.5).
2. Routes to a recipient based on the selected interest (Leasing / Investor Relations / Property Sales), always copying `tucker@reddoorla.com`.
3. Sends via Resend from `submissions@reddoorla.com` (the `reddoorla.com` domain must be verified in the Resend account behind `RESEND_API_KEY`).

The client checks the action result's `type` (not `response.ok`) — SvelteKit actions posted via `fetch` return HTTP 200 even on `fail()`.

## Scripts

```bash
pnpm dev          # dev server + Slice Machine
pnpm build        # production build (adapter-netlify)
pnpm preview      # preview the production build
pnpm check        # svelte-kit sync + svelte-check
pnpm lint         # prettier --check + eslint
pnpm format       # prettier --write
pnpm slicemachine # Slice Machine only
```

## Content & slices

Content is authored in Prismic. Slices live in `src/lib/slices/` (each with an `index.svelte`); the largest, `FullScreenSlide`, dispatches to focused variation components under `FullScreenSlide/variations/`. Models are edited with Slice Machine (`pnpm slicemachine`) and versioned in the repo. Do not edit `src/routes/slice-simulator/` — it's used by Slice Machine in development.

## Deployment

Pushes/merges to `main` trigger a Netlify build (`pnpm build`, publish `build/`). Set the env vars above in the Netlify site config (available at both build and runtime). CI (`.github/workflows/ci.yml`) runs prettier, eslint, svelte-check, build, and an a11y audit on every PR.

## Review notes / known follow-ups

See `docs/morning-reports/` for review notes. Outstanding items at the last review include: `prefers-reduced-motion` gating of the Svelte JS `fly` transitions (CSS-based motion is already handled), heading-order semantics, and some Prismic image `alt` text relying on editor input.
