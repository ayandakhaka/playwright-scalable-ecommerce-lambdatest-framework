import fs from "fs";
import path from "path";

const results = path.join(process.cwd(), "allure-results");
const previousReportHistory = path.join(process.cwd(), "allure-report", "history");

function copyHistory() {
    if (!fs.existsSync(previousReportHistory)) {
        console.log("⚠ No previous history found (first run). Trends will start from next run.");
        return;
    }

    const historyTarget = path.join(results, "history");

    if (!fs.existsSync(results)) {
        fs.mkdirSync(results);
    }

    if (!fs.existsSync(historyTarget)) {
        fs.mkdirSync(historyTarget);
    }

    fs.readdirSync(previousReportHistory).forEach(file => {
        fs.copyFileSync(
            path.join(previousReportHistory, file),
            path.join(historyTarget, file)
        );
    });

    console.log("✔ Allure history restored for trend charts");
}

copyHistory();
