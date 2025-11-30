# LambdaTest Playwright Automation Framework

A **scalable end-to-end test automation framework** built with **Playwright** and **TypeScript**, integrated with **LambdaTest** for cross-browser testing. Supports parallel execution, detailed reporting, and CI/CD integration for maintainable and fast web application testing.

---

## Features

- **TypeScript + Playwright**: Fully typed and modern automation.  
- **LambdaTest Integration**: Cloud-based cross-browser testing (Chrome, Firefox, Edge, Safari).  
- **Reusable Utilities**: Page objects, helpers, and fake data generation.  
- **Data-Driven Tests**: JSON-based test data for flexibility.  
- **Sequential & Parallel Execution**: Control test order or run in parallel.  
- **Detailed Reporting**: HTML reports, screenshots, and video recordings for failed tests.  
- **CI/CD Ready**: Works with GitHub Actions, Jenkins, or Azure DevOps.

---

## Prerequisites

- Node.js >= 20.x  
- npm >= 10.x  
- LambdaTest account  
- Windows, macOS, or Linux  

---

## Installation

Clone the repository:

git clone https://github.com/ayandakhaka/playwright-scalable-ecommerce-lambdatest-framework.git


cd playwright-scalable-ecommerce-lambdatest-framework

## Install dependencies:

npm install

## Install Playwright browsers:

npx playwright install

## Running Tests

npx playwright test

## Run a specific test file:

npx playwright test tests/1-register.test.ts

## Reporting
Screenshots and videos are saved in playwright-report/.
Generate HTML report:
npx playwright show-report
## CI/CD Integration
Supports GitHub Actions
1. Checkout repo

2. Install Node.js dependencies

3. Install Playwright browsers

4. Run tests (npx playwright test)

5. Publish HTML reports

🚀 How to Add Allure to Your Playwright Project
1️⃣ Install Allure dependencies

1. npm install --save-dev allure-playwright
2. npm install --save-dev allure-commandline

# 🎯 Scalable Playwright Automation Framework with Allure Reporting

This repository contains a **Playwright automation framework** with TypeScript, fully integrated with **Allure reporting**, including:

- **environment.properties**  
- **executor.json**  
- **History tracking for trends**  

This setup ensures full metadata and trends in Allure reports, suitable for both **local runs** and **CI/CD pipelines**.

---

## **📂 Folder Structure**
```markdown
Here is a folder structure:

```
.
├─ tests/
├─ utils/
│  └─ copyAllureHistory.ts
├─ global-setup.ts
├─ global-teardown.ts
├─ playwright.config.ts
├─ package.json
└─ README.md
```

```

---

## **⚙️ Configuration**

### **playwright.config.ts**

- **Output directory**: `allure-results`  
- **Reporter**: `allure-playwright`  
- **Global hooks**:
  - `globalSetup` → copies previous `history` for trends  
  - `globalTeardown` → regenerates `environment.properties` & `executor.json`

```ts
globalSetup: "./global-setup.ts",
globalTeardown: "./global-teardown.ts",
```

## 💻 Test Execution Steps (Local)

1. Run test - npx playwright test
2. Generate Allure report (keep trends) - allure generate allure-results -o allure-report
3. Open report - allure open allure-report








