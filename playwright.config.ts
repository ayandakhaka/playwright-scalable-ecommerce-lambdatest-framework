import { defineConfig } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  testDir: "./tests",

  reporter: [
    //['html', { outputFolder: "playwright-report", open: "never" }],
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
    // { name: "firefox", use: { browserName: "firefox" } },
    // { name: "webkit", use: { browserName: "webkit" } },
  ],
});
