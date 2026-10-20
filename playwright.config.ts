import { defineConfig } from '@playwright/test';
import base from '@reddoorla/maintenance/configs/playwright-a11y';
import { INGEST_CAPTURE_URL } from './tests/smoke/ingest-capture';

// The smoke suite submits the real contact form. Its ingest call goes to the
// local capture server in tests/smoke/ingest-capture.ts, never to the central
// endpoint: these are forced, not defaulted, so a FORMS_INGEST_URL in the shell
// cannot turn a test run into a real lead. The dev server inherits them.
process.env.FORMS_INGEST_URL = INGEST_CAPTURE_URL;
process.env.FORMS_INGEST_TOKEN = 'smoke';

export default defineConfig({ ...base, globalSetup: './tests/smoke/ingest-capture.ts' });
