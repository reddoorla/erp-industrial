// Public reCAPTCHA Enterprise site key — single source of truth for BOTH the client
// (loader script + grecaptcha.execute) and the server-side Enterprise assessment, so the two
// can never drift. Site keys are public by design; the secret assessment key stays server-only.
//
// Previously the server read this via `import.meta.env.VITE_RECAPTCHA_SITE_KEY` (build-time
// inlined), which silently breaks every assessment if that var is unset at build or drifts from
// the client's value. Importing one shared constant removes that failure mode entirely.
export const RECAPTCHA_SITE_KEY = '6LcgrQUqAAAAAGSwikmSpKfzVBS8SjC4Gd1GAKP_';
