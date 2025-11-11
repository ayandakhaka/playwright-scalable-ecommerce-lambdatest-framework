import nodemailer from "nodemailer";
import fs from "fs";

export default async function sendTestReportEmail() {
  const reportPath = "./playwright-report/index.html";
  if (!fs.existsSync(reportPath)) {
    console.log("❌ No report found to attach.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"QA Automation" <${process.env.EMAIL_USER}>`,
    to: "team@yourcompany.com",
    subject: "✅ Playwright Test Execution Report",
    html: `<p>Test completed. Environment: ${process.env.PROVIDER}</p>`,
    attachments: [{ filename: "playwright-report.html", path: reportPath }],
  };

  await transporter.sendMail(mailOptions);
  console.log("📧 Test report email sent successfully!");
}
