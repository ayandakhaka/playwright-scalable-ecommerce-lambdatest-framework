import fs from "fs";
import path from "path";

/**
 * Copies the history folder from the previous allure-report
 * into the allure-results folder before generating the new report.
 * This preserves trends across multiple runs.
 */
const allureReportDir = path.join(process.cwd(), "allure-report");
const allureResultsDir = path.join(process.cwd(), "allure-results");

const previousReportHistory = path.join(process.cwd(), "temp-history");
const targetHistory = path.join(allureResultsDir, "history");

if (fs.existsSync(previousHistory)) {
  // Ensure allure-results exists
  if (!fs.existsSync(allureResultsDir)) {
    fs.mkdirSync(allureResultsDir, { recursive: true });
  }

  // Remove old history if exists
  if (fs.existsSync(targetHistory)) {
    fs.rmSync(targetHistory, { recursive: true, force: true });
  }

  // Copy previous history to allure-results
  const copyRecursiveSync = (src: string, dest: string) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach((childItemName) => {
        copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      });
    } else if (exists) {
      fs.copyFileSync(src, dest);
    }
  };

  copyRecursiveSync(previousHistory, targetHistory);
  console.log("✅ Allure history copied successfully!");
} else {
  console.log("⚠️ No previous allure history found, skipping copy.");
}
