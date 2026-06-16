# ERP Industrials

Marketing site for **ERP Industrials** (Energy Related Properties) — a SvelteKit + Prismic site deployed on Netlify.

## Stack

- **SvelteKit 2 / Svelte 5** (runes), **Vite**
- **Tailwind CSS 4**
- **Prismic** as the CMS (Slice Machine for slice modeling)
- **Central forms ingest** via [`@reddoorla/maintenance`](https://www.npmjs.com/package/@reddoorla/maintenance) — the contact form forwards to the shared dashboard pipeline (Airtable Submissions + status-aware notify)
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

Create a `.env` (gitignored — see `.env.example`). Server secrets are read at runtime via `$env/dynamic/private`.

| Variable                   | Scope            | Purpose                                          |
| -------------------------- | ---------------- | ------------------------------------------------ |
| `FORMS_INGEST_URL`         | server (private) | Central ingest endpoint (slug `erp-industrials`) |
| `FORMS_INGEST_TOKEN`       | server (private) | Shared token authorizing the ingest POST         |
| `VITE_PRISMIC_ENVIRONMENT` | build            | Prismic environment override (optional)          |

## Contact form

`src/routes/contact/+page.server.ts` is a SvelteKit form action that forwards the submission to the central `@reddoorla/maintenance` ingest (via `createIngestAction`):

1. Spam is screened by a hidden honeypot + a fill-timing check built into `createIngestAction` (no reCAPTCHA, no Netlify "Form").
2. The submission (including the selected `interest`) is POSTed to `FORMS_INGEST_URL` with `FORMS_INGEST_TOKEN`. The dashboard persists it to Airtable Submissions and sends a status-aware notification.
3. Recipient routing by `interest` (Leasing / Investor Relations / Property Sales and Acquistions) is configured dashboard-side (Notify Routing) — not in this repo.

The form is progressively enhanced with `use:enhance`; success/error render from the action's `form` prop.

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
