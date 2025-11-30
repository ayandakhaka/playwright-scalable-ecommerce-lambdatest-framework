import fs from "fs";
import path from "path";

export function generateAllureEnvironment() {
    const allureResultsPath = path.join(process.cwd(), "allure-results");

    // Create allure-results folder if missing
    if (!fs.existsSync(allureResultsPath)) {
        fs.mkdirSync(allureResultsPath);
    }

    // ----------------------
    // 1️⃣ Environment Properties
    // ----------------------
    const envFile = path.join(allureResultsPath, "environment.properties");

    const environment = [
        `Environment=QA`,
        `Browser=Chromium`,
        `Tester=Ayanda Khaka`,
        `Company=World Sports Betting`,
        `ExecutionType=Local Execution`,
        `OS=Windows 10`,
        `URL=https://lambdatest.github.io/sample-app-ecommerce/`,
        `Framework=Playwright with TypeScript`,
        `Project=Scalable E-Commerce Playground`
    ].join("\n");

    fs.writeFileSync(envFile, environment, "utf8");
    console.log("✔ environment.properties generated");

    // ----------------------
    // 2️⃣ Executor Metadata
    // ----------------------
    const executorJson = {
        name: "Playwright Automation",
        type: "local",
        url: "http://localhost",
        reportName: "Regression Suite - QA",
        buildOrder: 1,
        buildName: "v1.0.0",
        description: "Chrome 118 on Windows 11, Node 20, Playwright 1.56",
        buildUrl: "",
        executionType: "manual"
    };

    fs.writeFileSync(
        path.join(allureResultsPath, "executor.json"),
        JSON.stringify(executorJson, null, 2),
        "utf8"
    );
    console.log("✔ executor.json generated");
}

generateAllureEnvironment();
