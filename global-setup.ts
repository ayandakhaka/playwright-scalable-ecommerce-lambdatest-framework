import fs from "fs";
import path from "path";

async function globalSetup() {
  const resultsDir = path.join(process.cwd(), "allure-results");
  const reportDir = path.join(process.cwd(), "allure-report");
  const prevHistory = path.join(reportDir, "history");
  const destHistory = path.join(resultsDir, "history");

  // Ensure allure-results exists
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

  // Copy previous history if exists
  if (fs.existsSync(prevHistory)) {
    fs.cpSync(prevHistory, destHistory, { recursive: true });
    console.log("✔ Allure history copied to allure-results/history");
  } else {
    console.log("ℹ No previous history found. Trends will start fresh.");
  }
}

export default globalSetup;
