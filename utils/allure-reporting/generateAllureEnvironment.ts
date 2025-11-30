import fs from "fs";
import path from "path";

export function generateExecutor() {
    const allureResultsPath = path.join(process.cwd(), "allure-results");

    if (!fs.existsSync(allureResultsPath)) {
        fs.mkdirSync(allureResultsPath);
    }

    // Allure executor object format
    const data = {
        name: "Local Execution",
        type: "local",
        reportName: "Playwright Automation Report",
        buildName: "Local Run - " + new Date().toISOString(),
        url: "https://ecommerce-playground.lambdatest.io/",
        environment: {
            Environment: "QA",
            Browser: "Chromium",
            Tester: "Ayanda Khaka",
            Company: "World Sports Betting",
            ExecutionType: "Local Execution",
            OS: "Windows 10",
            URL: "https://ecommerce-playground.lambdatest.io/sample-app-ecommerce/",
            Framework: "Playwright with TypeScript",
            Project: "Scalable E-Commerce Playground"
        }
    };

    fs.writeFileSync(
        path.join(allureResultsPath, "executor.json"),
        JSON.stringify(data, null, 2)
    );
}
