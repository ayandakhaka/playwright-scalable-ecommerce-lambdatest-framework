import fs from "fs";
import path from "path";
import { test, expect } from "../fixtures/TestBase.js";
import { ConfigManager } from "../utils/ConfigManager.js";
import { generateFakeUser, saveRegisteredUser } from "../utils/FakeDataGenerator.js";
import { resetLoginAttemptsDb } from "../utils/dbUtils.js";
import { step } from "../utils/testStepHelper.js";


const registeredUsersFile = path.resolve(process.cwd(), "test-data/registeredUsers.json");

test.setTimeout(60000);

test.describe("Login Tests with Reporting", () => {
  let user: any;
  let isInitialized = false;

  test.beforeEach(async ({ page, homePage, registerAccountPage, logoutPage, actionHelper }, testInfo) => {
    await step("Initialize test user", async () => {
      if (!isInitialized) {
        // Clear JSON file
        fs.writeFileSync(registeredUsersFile, JSON.stringify([], null, 2), "utf-8");

        // Generate a new user
        user = generateFakeUser();

        // Register user via UI
        await actionHelper.navigateToFullUrl(`${ConfigManager.url()}/index.php?route=account/register`);
        await registerAccountPage.fillRegistrationForm(user.firstName, user.lastName, user.email, user.phone, user.password);
        await registerAccountPage.submitRegistration();

        // Save user and reset DB login attempts
        saveRegisteredUser(user);
        try { await resetLoginAttemptsDb(user.email); } catch { /* ignore */ }

        // Logout after registration
        await homePage.hoverMyAccountMenu();
        await logoutPage.clickLogoutLink();

        isInitialized = true;
      } else {
        // Navigate to home page for subsequent tests
        await actionHelper.navigateToFullUrl(`${ConfigManager.url()}/index.php?route=common/home`);
      }
    });
  });

  test("Login with valid credentials", async ({ loginPage, homePage, page }, testInfo) => {
    await step("Open login menu", async () => {
      await homePage.hoverMyAccountMenu();
      await homePage.clickLoginLinkAfterRegister();
    });

    await step(`Login with valid user: ${user.email}`, async () => {
      await loginPage.login(user.email, user.password);
      await loginPage.verifyLoginSuccess();

      await testInfo.attach("Login success screenshot", {
        body: await page.screenshot(),
        contentType: "image/png"
      });
    });
  });

  test("Login with invalid credentials", async ({ loginPage, homePage, page }, testInfo) => {
    const invalidUser = generateFakeUser();

    await step("Open login menu", async () => {
      await homePage.hoverMyAccountMenu();
      await homePage.clickLoginLinkAfterRegister();
    });

    await step(`Login with invalid user: ${invalidUser.email}`, async () => {
      await loginPage.login(invalidUser.email, invalidUser.password);
      await loginPage.verifyLoginError(
        "Warning: No match for E-Mail Address and/or Password."
      );

      await testInfo.attach("Invalid login screenshot", {
        body: await page.screenshot(),
        contentType: "image/png"
      });
    });
  });

  test("Logout after login", async ({ loginPage, homePage, logoutPage, page }, testInfo) => {
    await step("Login first", async () => {
      await homePage.hoverMyAccountMenu();
      await homePage.clickLoginLink();
      await loginPage.login(user.email, user.password);
      await loginPage.verifyLoginSuccess();
    });

    await step("Logout user", async () => {
      await homePage.hoverMyAccountMenu();
      await logoutPage.clickLogoutLink();
      await logoutPage.verifyLogoutSuccess();

      await testInfo.attach("Logout screenshot", {
        body: await page.screenshot(),
        contentType: "image/png"
      });
    });
  });
});
