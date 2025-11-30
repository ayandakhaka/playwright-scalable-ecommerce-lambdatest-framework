import fs from "fs";
import path from "path";

async function globalTeardown() {
  const resultsDir = path.join(process.cwd(), "allure-results");

  // Ensure allure-results folder exists
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

  // --- environment.properties ---
  const environmentProperties = `
Environment=QA
Browser=Chromium
Tester=Ayanda Khaka
Company=World Sports Betting
ExecutionType=Local Execution
OS=Windows 10
URL=https://lambdatest.github.io/sample-app-ecommerce/
Framework=Playwright with TypeScript
Project=Scalable E-Commerce Playground
Timestamp=${new Date().toISOString()}
`;

  const envFilePath = path.join(resultsDir, "environment.properties");
  fs.writeFileSync(envFilePath, environmentProperties.trim());
  console.log("✔ Created environment.properties");

  // --- executor.json ---
  const executorData = {
    name: "Playwright Automation",
    type: "local",
    url: "http://localhost",
    reportName: "Regression Suite - QA",
    buildOrder: 1,
    buildName: "v1.0.0",
    description: "Chrome 118 on Windows 11, Node 20, Playwright 1.56",
    buildUrl: "",
    executionType: "manual",
  };

  const executorFilePath = path.join(resultsDir, "executor.json");
  fs.writeFileSync(executorFilePath, JSON.stringify(executorData, null, 2));
  console.log("✔ Created executor.json");

  console.log("🔥 Allure metadata regeneration completed successfully.");
}

export default globalTeardown;
