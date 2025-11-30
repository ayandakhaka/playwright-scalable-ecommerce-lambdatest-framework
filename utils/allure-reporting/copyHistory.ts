const fs = require("fs");
const path = require("path");

const results = path.join(process.cwd(), "allure-results");
const report = path.join(process.cwd(), "allure-report");

const src = path.join(report, "history");
const dest = path.join(results, "history");

if (fs.existsSync(src)) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    fs.cpSync(src, dest, { recursive: true });
    console.log("Copied history for trends.");
} else {
    console.log("No history found, this is the first run.");
}
