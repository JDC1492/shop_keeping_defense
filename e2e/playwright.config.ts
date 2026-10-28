import { defineConfig, devices } from '@playwright/test';

const API_URL = process.env.API_URL ?? 'http://localhost:3000';
const WEB_URL = process.env.WEB_URL ?? 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    {
      // Black-box HTTP exploit regressions. No browser needed.
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_URL },
    },
    {
      // XSS execution, UI-level access control.
      name: 'browser',
      testDir: './tests/browser',
      use: { ...devices['Desktop Chrome'], baseURL: WEB_URL },
    },
    {
      // axe-core scans per route and key flow.
      name: 'a11y',
      testDir: './tests/a11y',
      use: { ...devices['Desktop Chrome'], baseURL: WEB_URL },
    },
  ],
});
