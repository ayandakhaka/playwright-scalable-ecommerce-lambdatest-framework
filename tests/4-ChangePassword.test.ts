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

test.describe("Change Password Test", () => {

    test.beforeEach(async ({ page, homePage, actionHelper, loginPage }, testInfo) => {
        await step("Navigate to home page and open login", async () => {
            await actionHelper.navigateToFullUrl("/index.php?route=common/home");
            await homePage.hoverMyAccountMenu();
            await homePage.clickLoginLink();
            user = registeredUsers[0];
            if (!user || !user.email || !user.password)
                throw new Error("Invalid or missing user data in JSON");
            await step(`Login with valid credentials: ${user.email}`, async () => {
                await loginPage.login(user.email, user.password);
            })

        });
    });

    test("Change password successfully", async ({ changePasswordPage, loginPage }, testInfo) => {
        await step("Click Forgot Password Link", async () => {
            await loginPage.clickForgotPasswordLink();
        });

        await step("Fill in password and confirm password fields", async () => {
            await changePasswordPage.fillForgotPasswordDetails(user.password, user.password)
        })

        await step("Clicking continue button", async () => {
            await changePasswordPage.clickContinue();
        })

        await step("Verify change password success message", async () => {
            await changePasswordPage
                .verifyChangePasswordSuccessMessage(" Success: Your password has been successfully updated.");
        });

    })

    test("Change password with mismatch password ", async ({ changePasswordPage, loginPage }, testInfo) => {
        await step("Click Forgot Password Link", async () => {
            await loginPage.clickForgotPasswordLink();
        });

        await step("Fill in password and mismatch password", async () => {
            await changePasswordPage.fillForgotPasswordDetails(user.password, "Hlongwane@2012")
        })

        await step("Clicking continue button", async () => {
            await changePasswordPage.clickContinue();
        })

        await step("Verify password confirmation does not match", async () => {
            await changePasswordPage
                .verifyChangePasswordErrorMessage("Password confirmation does not match password!");
        });

    })
    
})