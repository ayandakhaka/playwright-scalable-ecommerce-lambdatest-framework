import sendTestReportEmail from "./utils/sendEmail"; // default import

async function globalTeardown() {
  console.log("📤 Sending test report via email...");
  await sendTestReportEmail();
}

export default globalTeardown;
