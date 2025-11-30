import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: [
    ['list'],
    ['allure-playwright']
  ],
  outputDir: 'allure-results',
  retries: 2,
  use: {
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
    navigationTimeout: 60000,
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),
});
