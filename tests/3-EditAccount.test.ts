import fs from "fs";
import path from "path";
import { test, expect } from "../fixtures/TestBase.js";
import { ConfigManager } from "../utils/ConfigManager.js";
import { generateFakeUser, saveRegisteredUser, getOrCreateTestUser } from "../utils/FakeDataGenerator.js";
import registeredUsers from "../test-data/registeredUsers.json";
import { faker } from "@faker-js/faker";
import { step } from "../utils/testStepHelper.js";


const registeredUsersFile = path.resolve(process.cwd(), "test-data/registeredUsers.json");

let user: any;

// ✅ Increase timeout for slower test environments
test.setTimeout(60000);

test.describe("Edit Account Tests", () => {

  test.beforeEach(async ({ page, homePage, actionHelper }, testInfo) => {
    await step("Navigate to home page and open login", async () => {
      await actionHelper.navigateToFullUrl("/index.php?route=common/home");
      await homePage.hoverMyAccountMenu();
      await homePage.clickLoginLink();
    });
  });

  test("Edit Account Information successfully", async ({ editAccountPage, loginPage }, testInfo) => {
    user = registeredUsers[0];
    if (!user || !user.email || !user.password)
      throw new Error("Invalid or missing user data in JSON");

    await step(`Login with valid user: ${user.email}`, async () => {
      await loginPage.login(user.email, user.password);
    });

    await step("Open Edit Account page", async () => {
      await loginPage.clickEditAccountLink();
    });

    await step("Edit and save account information", async () => {
      await editAccountPage.fillMyAccountDetails("Elihle", "Khaka", user.email, "073 6409898");
      await editAccountPage.clickContinueButton();
    });

    await step("Verify success message", async () => {
      await editAccountPage.verifyUpdateSuccessMessage(
        "Success: Your account has been successfully updated."
      );
    });
  });

  test("Attempt to edit account with invalid email address", async ({ editAccountPage, loginPage, registerAccountPage }, testInfo) => {
    user = registeredUsers[0];
    if (!user) throw new Error("User data not initialized");

    await step("Login with valid user", async () => {
      await loginPage.login(user.email, user.password);
    });

    await step("Try editing with invalid email format", async () => {
      await loginPage.clickEditAccountLink();
      await editAccountPage.fillMyAccountDetails("Elihle", "Khaka", "invalid-email", "0736723126");
      await editAccountPage.clickContinueButton();
    });

    await step("Verify invalid email error message", async () => {
      await registerAccountPage.verifyInvalidEmailFormatError();
    });
  });

  test("Attempt to edit account without first name", async ({ editAccountPage, loginPage }, testInfo) => {
    user = registeredUsers[0];
    if (!user) throw new Error("User data not initialized");

    await step("Login user", async () => {
      await loginPage.login(user.email, user.password);
    });

    await step("Try saving without first name", async () => {
      await loginPage.clickEditAccountLink();
      await editAccountPage.fillMyAccountDetails("", "Khaka", user.email, "0736723126");
      await editAccountPage.clickContinueButton();
    });

    await step("Verify first name field error", async () => {
      await editAccountPage.verifyFirstNameFieldErrorMessage();
    });
  });

  test("Attempt to edit account with existing email", async ({ editAccountPage, loginPage }, testInfo) => {
    user = registeredUsers[0];
    if (!user) throw new Error("User data not initialized");

    await step("Login user", async () => {
      await loginPage.login(user.email, user.password);
    });

    await step("Attempt to change to existing email", async () => {
      await loginPage.clickEditAccountLink();
      await editAccountPage.fillMyAccountDetails("Elihle", "Khaka", "khakaalwande@gmail.com", "0736723126");
      await editAccountPage.clickContinueButton();
    });

    await step("Verify duplicate email warning", async () => {
      await editAccountPage.verifyUpdateWarningMessage("Warning: E-Mail address is already registered!");
    });
  });
});
