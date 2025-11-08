// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  retries: 0,
  use: {
    baseURL: process.env.BASE_URL, // Picked up automatically from ConfigManager
    headless: false,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    navigationTimeout: 60000

  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    // { name: "firefox", use: { browserName: "firefox" } },
    //{ name: "webkit", use: { browserName: "webkit" } },
  ],
});
