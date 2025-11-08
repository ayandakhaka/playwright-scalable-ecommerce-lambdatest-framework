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

```bash
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


