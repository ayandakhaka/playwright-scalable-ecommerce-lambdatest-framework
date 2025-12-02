import fs from "fs";
import path from "path";

export default async function globalTeardown() {
  const resultsDir = path.join(process.cwd(), "allure-results");
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

  // environment.properties
  const envProps = `
Environment=QA
Browser=Chromium
Tester=Ayanda Khaka
URL=https://lambdatest.github.io/sample-app-ecommerce/
Timestamp=${new Date().toISOString()}
  `.trim();

  fs.writeFileSync(path.join(resultsDir, "environment.properties"), envProps);
  console.log("✔ Created environment.properties");

  // executor.json
  const executor = {
    name: "Playwright Automation",
    type: "local",
    reportName: "Regression Suite - QA",
    buildName: "v1.0.0",
    executionType: "manual",
  };

  fs.writeFileSync(path.join(resultsDir, "executor.json"), JSON.stringify(executor, null, 2));
  console.log("✔ Created executor.json");
}
