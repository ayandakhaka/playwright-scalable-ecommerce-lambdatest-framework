import fs from "fs";
import path from "path";

const sourceHistory = path.join(process.cwd(), "temp-history"); // GitHub Actions artifact folder
const destHistory = path.join(process.cwd(), "allure-results/history");

if (fs.existsSync(sourceHistory)) {
  fs.mkdirSync(destHistory, { recursive: true });
  fs.cpSync(sourceHistory, destHistory, { recursive: true });
  console.log("✔ Restored Allure history for trends");
} else {
  console.log("ℹ No previous history found. Trends will start fresh.");
}
