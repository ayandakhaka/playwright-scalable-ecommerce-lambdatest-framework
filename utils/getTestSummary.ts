import fs from "fs";
import path from "path";

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

if (!fs.existsSync(resultsDir)) {
  console.error("❌ allure-results folder not found");
  process.exit(1);
}

const files = fs.readdirSync(resultsDir);

files.forEach((file) => {
  if (file.endsWith(".json")) {
    const data = JSON.parse(fs.readFileSync(path.join(resultsDir, file), "utf8"));
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
  }
});

// Output in a format GitHub Actions can read
console.log(`TOTAL=${summary.total}`);
console.log(`PASSED=${summary.passed}`);
console.log(`FAILED=${summary.failed}`);
console.log(`SKIPPED=${summary.skipped}`);
