// global-setup.ts
import path from "path";
import fs from "fs";
import { copyAllureHistory } from "./utils/allure-reporting/copyAllureHistory";

export default async function globalSetup() {
  console.log("🔧 globalSetup: restoring Allure history if present...");
  copyAllureHistory();

  // (optional) ensure allure-results/history exists even if no previous history
  const historyDir = path.join(process.cwd(), "allure-results", "history");
  if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir, { recursive: true });
  console.log("✔ globalSetup complete");
}
