import fs from "fs";
import path from "path";

async function globalSetup() {
  const resultsDir = path.join(process.cwd(), "allure-results");
  const historySource = path.join(process.cwd(), "temp-history"); // downloaded artifact in GitHub Actions
  const historyDest = path.join(resultsDir, "history");

  // Ensure allure-results/history folder exists
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
  if (!fs.existsSync(historyDest)) fs.mkdirSync(historyDest, { recursive: true });

  // Copy previous Allure history if exists
  if (fs.existsSync(historySource)) {
    fs.cpSync(historySource, historyDest, { recursive: true });
    console.log("✔ Restored Allure history for trends");
  } else {
    console.log("ℹ No previous history found. Trends will start fresh.");
  }
}

export default globalSetup;
