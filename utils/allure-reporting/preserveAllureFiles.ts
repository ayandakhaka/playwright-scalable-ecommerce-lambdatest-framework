import fs from 'fs';
import path from 'path';

const allureResultsPath = path.join(process.cwd(), 'allure-results');
const tempBackupPath = path.join(process.cwd(), 'allure-temp-backup');

// Ensure backup folder exists
if (!fs.existsSync(tempBackupPath)) {
    fs.mkdirSync(tempBackupPath);
}

// List of files to preserve
const filesToPreserve = ['environment.properties', 'execute.json'];

// Backup files if they exist
filesToPreserve.forEach(file => {
    const src = path.join(allureResultsPath, file);
    const dest = path.join(tempBackupPath, file);

    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Backed up ${file}`);
    }
});

// Here you can run your cleaning or report generation logic
// Example: cleaning allure-results (optional)
// fs.rmSync(allureResultsPath, { recursive: true, force: true });
// fs.mkdirSync(allureResultsPath);

// Restore the preserved files
filesToPreserve.forEach(file => {
    const backupFile = path.join(tempBackupPath, file);
    const dest = path.join(allureResultsPath, file);

    if (fs.existsSync(backupFile)) {
        fs.copyFileSync(backupFile, dest);
        console.log(`Restored ${file}`);
    }
});

// Optional: remove temporary backup folder
// fs.rmSync(tempBackupPath, { recursive: true, force: true });

console.log('Allure files preservation completed!');
