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

const summary: Summary = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
};

// --- Summarize test results ---
function summarizeResults() {
  if (!fs.existsSync(resultsDir)) {
    console.error("❌ allure-results folder not found");
    process.exit(1);
  }

  // Use glob to only pick test result JSON files (ignore history and metadata)
  const files = glob.sync("allure-results/**/*-result.json");

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

  console.log("✔ Test summary computed successfully");
}

// --- Output for GitHub Actions ---
function outputSummary() {
  console.log(`TOTAL=${summary.total}`);
  console.log(`PASSED=${summary.passed}`);
  console.log(`FAILED=${summary.failed}`);
  console.log(`SKIPPED=${summary.skipped}`);

  // Export to GitHub environment variables for later workflow steps
  fs.appendFileSync(process.env.GITHUB_ENV!, `TOTAL=${summary.total}\n`);
  fs.appendFileSync(process.env.GITHUB_ENV!, `PASSED=${summary.passed}\n`);
  fs.appendFileSync(process.env.GITHUB_ENV!, `FAILED=${summary.failed}\n`);
  fs.appendFileSync(process.env.GITHUB_ENV!, `SKIPPED=${summary.skipped}\n`);
}

// --- Run all ---
summarizeResults();
outputSummary();
