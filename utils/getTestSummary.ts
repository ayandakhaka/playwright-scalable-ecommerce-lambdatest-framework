import fs from "fs";
import path from "path";
import { globSync } from "glob";

interface Summary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
}

const resultsDir = path.join(process.cwd(), "allure-results");
const summary: Summary = { total: 0, passed: 0, failed: 0, skipped: 0 };

// --- Collect all JSON files excluding history ---
const files = globSync(`${resultsDir}/**/*.json`, {
  ignore: [`${resultsDir}/history/**`],
});

if (files.length === 0) {
  console.warn("⚠ No test result JSON files found in allure-results.");
}

// --- Summarize results ---
files.forEach((filePath) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (data.status) {
    summary.total++;
    switch (data.status) {
      case "passed":
        summary.passed++;
        break;
      case "failed":
        summary.failed++;
        break;
      case "skipped":
        summary.skipped++;
        break;
    }
  }
});

// --- Output for GitHub Actions ---
console.log(`TOTAL=${summary.total}`);
console.log(`PASSED=${summary.passed}`);
console.log(`FAILED=${summary.failed}`);
console.log(`SKIPPED=${summary.skipped}`);

// Optional: also write to $GITHUB_ENV for later steps
const githubEnv = process.env.GITHUB_ENV;
if (githubEnv) {
  fs.appendFileSync(githubEnv, `TOTAL=${summary.total}\n`);
  fs.appendFileSync(githubEnv, `PASSED=${summary.passed}\n`);
  fs.appendFileSync(githubEnv, `FAILED=${summary.failed}\n`);
  fs.appendFileSync(githubEnv, `SKIPPED=${summary.skipped}\n`);
}

console.log("✔ Test summary generated successfully");
