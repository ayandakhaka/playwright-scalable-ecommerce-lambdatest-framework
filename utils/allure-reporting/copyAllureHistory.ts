import fs from "fs";
import path from "path";

/**
 * Copy previous Allure history from temp-history (downloaded artifact)
 * into allure-results/history for trend generation.
 */
export function copyAllureHistory() {
  const src = path.join(process.cwd(), "temp-history"); // downloaded artifact path
  const dest = path.join(process.cwd(), "allure-results", "history");

  if (!fs.existsSync(src)) {
    console.log("⚠ No previous history found to copy (first CI run)");
    return;
  }

  // Ensure destination exists
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Copy recursively
  fs.cpSync(src, dest, { recursive: true });
  console.log("✔ Allure history copied successfully");

  // Debug: list contents after copy
  const files = fs.readdirSync(dest);
  console.log("Contents of allure-results/history:", files.length ? files : "empty");
}
