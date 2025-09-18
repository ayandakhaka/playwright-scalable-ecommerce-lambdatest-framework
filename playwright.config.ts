import "./setupEnv";
import { defineConfig } from '@playwright/test';

export default defineConfig({

  timeout: Number(process.env.TIMEOUT) || 30000,
  use: {
    baseURL: process.env.BASE_URL,
    headless: process.env.HEADLESS?.toLowerCase() === 'false',
    screenshot: "on",
    video: "retain-on-failure",
    browserName:
      (process.env.BROWSER as "chromium" | "firefox" | "webkit") || "chromium",

    //browserName: process.env.BROWSER || 'chromium',
  },
  retries: 0,
  reporter: [["dot"], ["json", {
    outputFile: "jsonReports/jsonReport.json"
  }], ["html", {
    open: "never"
  }]]
});
