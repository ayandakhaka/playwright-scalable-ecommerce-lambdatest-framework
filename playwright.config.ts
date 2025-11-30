import { defineConfig } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  testDir: "./tests",
  outputDir: "allure-results",

  reporter: [
    ['list'],
    ['allure-playwright']  // enable Allure reporting
  ],

  retries: 2,

  use: {
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
    navigationTimeout: 60000,
  },

  globalSetup: "./global-setup.ts",
  globalTeardown: "./global-teardown.ts",

  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
});
