import fs from "fs";
import path from "path";

export function bootstrapHistory() {
  const historyDir = path.join(process.cwd(), "allure-results/history");

  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }

  const historyJson = path.join(historyDir, "history.json");
  const trendJson = path.join(historyDir, "history-trend.json");

  if (!fs.existsSync(historyJson)) {
    fs.writeFileSync(historyJson, "[]", "utf-8");
  }

  if (!fs.existsSync(trendJson)) {
    fs.writeFileSync(trendJson, "[]", "utf-8");
  }

  console.log("✔ Bootstrapped initial history files");
}
