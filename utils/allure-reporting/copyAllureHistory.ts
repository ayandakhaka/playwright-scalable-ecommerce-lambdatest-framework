// utils/copyAllureHistory.ts
import fs from "fs";
import path from "path";

export function copyAllureHistory() {
  const src = path.join(process.cwd(), "allure-report", "history");   // Correct source
  const dest = path.join(process.cwd(), "allure-results", "history"); // Correct destination

  // Ensure allure-results exists
  const resultsFolder = path.join(process.cwd(), "allure-results");
  if (!fs.existsSync(resultsFolder)) {
    fs.mkdirSync(resultsFolder);
  }

  if (!fs.existsSync(src)) {
    console.log("⚠ No history folder in allure-report yet.");
    return;
  }

  // Copy recursively
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });

  console.log("✔ Allure history copied successfully.");
}
copyAllureHistory();
                        
