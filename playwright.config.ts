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

  retries: 2,

  use: {
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    navigationTimeout: 60000,
  },

  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    // { name: "firefox", use: { browserName: "firefox" } },
    // { name: "webkit", use: { browserName: "webkit" } },
  ],
});
