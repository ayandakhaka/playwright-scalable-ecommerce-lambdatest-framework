import fs from "fs";
import path from "path";

// ALWAYS write summary.env to project root
const summaryFile = path.join(process.cwd(), "summary.env");

// Ensure file is created even if no results exist
fs.writeFileSync(summaryFile, "TOTAL=0\nPASSED=0\nFAILED=0\nSKIPPED=0\nRETRIED=0");

console.log("Created summary.env placeholder");

try {
    const resultsPath = path.join(process.cwd(), "allure-results");

    let total = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    let retried = 0;

    const jsonFiles = fs.readdirSync(resultsPath).filter(f => f.endsWith(".json"));

    jsonFiles.forEach(file => {
        const data = JSON.parse(fs.readFileSync(path.join(resultsPath, file), "utf-8"));

        if (Array.isArray(data.tests)) {
            data.tests.forEach((t: any) => {
                total++;
                if (t.retries && t.retries > 0) retried += t.retries;

                switch (t.status) {
                    case "passed": passed++; break;
                    case "failed": failed++; break;
                    case "skipped": skipped++; break;
                }
            });
        }
    });

    const summary = `
TOTAL=${total}
PASSED=${passed}
FAILED=${failed}
SKIPPED=${skipped}
RETRIED=${retried}
`;

    fs.writeFileSync(summaryFile, summary.trim());
    console.log("Generated summary.env:\n" + summary.trim());
} catch (e) {
    console.error("Failed to generate summary:", e);
}
