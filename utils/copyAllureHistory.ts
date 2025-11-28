import fs from "fs";
import path from "path";

const previousReportHistory = path.join(process.cwd(), "temp-history");
const results = path.join(process.cwd(), "allure-results");

function copyRecursive(src: string, dest: string) {
    if (!fs.existsSync(src)) return;

    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach((file) =>
            copyRecursive(path.join(src, file), path.join(dest, file))
        );
    } else {
        fs.copyFileSync(src, dest);
    }
}

function copyHistory() {
    if (!fs.existsSync(previousReportHistory)) {
        console.info("ℹ First run: no previous history found. Trends will start next run.");
        return;
    }

    const historyTarget = path.join(results, "history");
    if (!fs.existsSync(results)) fs.mkdirSync(results);

    copyRecursive(previousReportHistory, historyTarget);
    console.log("✔ Allure history restored for trend charts");
}

copyHistory();
