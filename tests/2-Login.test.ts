import fs from "fs";
import path from "path";
import { test, expect } from "../fixtures/TestBase.js";
import { ConfigManager } from "../utils/ConfigManager.js";
import { generateFakeUser, saveRegisteredUser } from "../utils/FakeDataGenerator.js";
import { step } from "../utils/testStepHelper.js";
import loginJson from "../test-data/login.test.data.json";



const registeredUsersFile = path.resolve(process.cwd(), "test-data/registeredUsers.json");

test.setTimeout(60000);
test.describe("Ecommerce Smoke Tests", () => {

  let user: any;
  let isInitialized = false;

  test.beforeEach(async ({
    page,
    homePage,
    registerAccountPage,
    logoutPage,
    actionHelper
  }) => {

    if (!isInitialized) {
      // Reset JSON file
      fs.writeFileSync(registeredUsersFile, JSON.stringify([], null, 2), "utf-8");

      // Generate fake user
      user = generateFakeUser();

      // Register user
      await actionHelper.navigateToFullUrl("/index.php?route=account/register");
      await registerAccountPage.fillRegistrationForm(
        user.firstName,
        user.lastName,
        user.email,
        user.phone,
        user.password
      );
      await registerAccountPage.submitRegistration();

      // Save user locally
      saveRegisteredUser(user);

      // Logout to prepare for next tests
      await homePage.hoverMyAccountMenu();
      await logoutPage.clickLogoutLink();

      isInitialized = true;
    } else {
      // For all other tests
      await actionHelper.navigateToFullUrl("/index.php?route=common/home");
    }

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
