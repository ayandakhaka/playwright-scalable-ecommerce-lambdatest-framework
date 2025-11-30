import fs from "fs";
import path from "path";

const source = path.join(process.cwd(), "temp-history");
const dest = path.join(process.cwd(), "allure-results/history");

if (fs.existsSync(source)) {
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(source, dest, { recursive: true });
  console.log("✔ Restored Allure history for trends");
} else {
  console.log("ℹ No previous history found. Trends will start fresh.");
}
