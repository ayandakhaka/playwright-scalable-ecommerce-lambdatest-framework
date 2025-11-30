import fs from "fs";
import path from "path";

export function generateExecutor() {
    const allureResultsPath = path.join(process.cwd(), "allure-results");

    if (!fs.existsSync(allureResultsPath)) {
        fs.mkdirSync(allureResultsPath);
    }

    const data = {
        name: "Local Machine",
        type: "local",
        buildName: "local-run-" + new Date().toISOString(),
        url: "https://ecommerce-playground.lambdatest.io/sample-app-ecommerce/",
        reportName: "Local Allure Report"
    };

    fs.writeFileSync(
        path.join(allureResultsPath, "executor.json"),
        JSON.stringify(data, null, 2)
    );
}
