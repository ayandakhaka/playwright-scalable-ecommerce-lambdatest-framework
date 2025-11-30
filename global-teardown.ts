import fs from "fs";
import path from "path";

async function globalTeardown() {
  const resultsDir = path.join(process.cwd(), "allure-results");

  // Ensure allure-results folder exists
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

  // --- Read environment variables from CI or fallback to defaults ---
  const ENVIRONMENT = process.env.ENVIRONMENT || "QA";
  const BROWSER = process.env.BROWSER || "Chromium";
  const TESTER = process.env.TESTER || "Ayanda Khaka";
  const COMPANY = process.env.COMPANY || "World Sports Betting";
  const EXECUTION_TYPE = process.env.EXECUTION_TYPE || "CI Execution";
  const OS = process.env.OS || "Ubuntu 22.04";
  const URL = process.env.BASE_URL || "https://lambdatest.github.io/sample-app-ecommerce/";
  const FRAMEWORK = process.env.FRAMEWORK || "Playwright with TypeScript";
  const PROJECT = process.env.PROJECT || "Scalable E-Commerce Playground";
  const TIMESTAMP = new Date().toISOString();

  // --- environment.properties ---
  const environmentProperties = `
Environment=${ENVIRONMENT}
Browser=${BROWSER}
Tester=${TESTER}
Company=${COMPANY}
ExecutionType=${EXECUTION_TYPE}
OS=${OS}
URL=${URL}
Framework=${FRAMEWORK}
Project=${PROJECT}
Timestamp=${TIMESTAMP}
`;

  const envFilePath = path.join(resultsDir, "environment.properties");
  fs.writeFileSync(envFilePath, environmentProperties.trim());
  console.log("✔ Created environment.properties");

  // --- executor.json ---
  const executorData = {
    name: process.env.EXECUTOR_NAME || "Playwright Automation",
    type: process.env.EXECUTOR_TYPE || "CI",
    url: URL,
    reportName: process.env.REPORT_NAME || "Regression Suite - QA",
    buildOrder: Number(process.env.BUILD_NUMBER) || Number(process.env.GITHUB_RUN_NUMBER) || 1,
    buildName: process.env.BUILD_NAME || "v1.0.0",
    description: process.env.DESCRIPTION || "Chromium on CI, Node 20, Playwright",
    branch: process.env.GITHUB_REF_NAME || "main",
    buildUrl: process.env.BUILD_URL || "",
    executionType: EXECUTION_TYPE,
  };

  const executorFilePath = path.join(resultsDir, "executor.json");
  fs.writeFileSync(executorFilePath, JSON.stringify(executorData, null, 2));
  console.log("✔ Created executor.json");

  console.log("🔥 Allure metadata regeneration completed successfully.");
}

export default globalTeardown;
