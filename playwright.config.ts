import { defineConfig } from '@playwright/test';
import base from '@reddoorla/maintenance/configs/playwright-a11y';
import { useIngestCapture } from './tests/smoke/ingest-capture';

// The smoke suite submits the real contact form; its ingest call goes to a local
// capture server, never to the central endpoint (tests/smoke/ingest-capture.ts).
useIngestCapture();

export default defineConfig({ ...base, globalSetup: './tests/smoke/ingest-capture.ts' });
