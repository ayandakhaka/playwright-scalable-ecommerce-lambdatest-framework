import fs from "fs";
import path from "path";

interface Summary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
}

const resultsDir = path.join(process.cwd(), "allure-results");
const reportDir = path.join(process.cwd(), "allure-report");
const historyDir = path.join(reportDir, "history");

const summary: Summary = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
};

// --- Restore previous history for trend charts ---
function restoreHistory() {
  if (!fs.existsSync(historyDir)) {
    console.log("⚠ No previous history found (first run). Trends will start next run.");
    return;
  }

  const target = path.join(resultsDir, "history");
  if (!fs.existsSync(target)) fs.mkdirSync(target);

  fs.readdirSync(historyDir).forEach((file) => {
    const src = path.join(historyDir, file);
    const dest = path.join(target, file);
    fs.copyFileSync(src, dest);
  });

  console.log("✔ Allure history restored for trend charts");
}

// --- Summarize test results ---
function summarizeResults() {
  if (!fs.existsSync(resultsDir)) {
    console.error("❌ allure-results folder not found");
    process.exit(1);
  }

  const files = fs.readdirSync(resultsDir);

  files.forEach((file) => {
    const filePath = path.join(resultsDir, file);

    // Skip directories (like history) or non-json files
    if (fs.lstatSync(filePath).isDirectory() || !file.endsWith(".json")) return;

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
}

// --- Run all ---
restoreHistory();
summarizeResults();
outputSummary();
