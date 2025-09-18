import { test, expect } from "../fixtures/TestBase";
import { faker } from "@faker-js/faker";
import { Page } from "@playwright/test";
//import * as loginData from "../test-data/login.test.data.json";
import { ConfigManager } from "utils/ConfigManager";


// Test data
//const email = "khakaalwande@gmail.com";
//const password = "hlongwane@2011";
/**
 * Test suite for editing account information.
 */
test.describe("Register Account Tests", () => {
    // ✅ Runs before each test case to ensure a clean state
    test.beforeEach(async ({ actionHelper, registerAccountPage, homePage, loginPage, editAccountPage }) => {
        // Navigate to homepage
        await actionHelper.navigateTo(
            "https://ecommerce-playground.lambdatest.io/index.php?route=common/home"
        );

        // Open login page
        await homePage.hoverMyAccountMenu();
        await homePage.clickLoginLink();
        await loginPage.login(ConfigManager.username(), ConfigManager.password()); // Perform login
        await loginPage.clickEditAccountLink(); // Navigate to Edit Account page
    });
    /**
     * ✅ Positive Test
     * Edits account information successfully with valid details.
     * Expects: Account update success message is displayed.
     */
    test("Edit Account Information successfully", async ({ editAccountPage, actionHelper, loginPage, homePage }) => {


        // Navigate to Edit Account page

        const newFirstName = faker.person.firstName();
        const newLastName = faker.person.lastName();
        const newEmail = faker.internet.email({ firstName: newFirstName, lastName: newLastName });
        const phone = faker.phone.number({ style: "national" });
        console.log(`Generated phone: ${phone}, email: ${newEmail}`);
        await editAccountPage.fillMyAccountDetails(newFirstName, newLastName, newEmail, phone);
        await editAccountPage.clickContinueButton();

        // Verify success message
        await editAccountPage.verifyUpdateSuccessMessage('Success: Your account has been successfully updated.');

    });
    
    /**
     * ❌ Negative Test
     * Attempts to edit account information with invalid details.   
     * Expects: Warning message is displayed for invalid input.
     */
    // test("Attempt to edit account information with invalid details", async ({ editAccountPage, actionHelper, loginPage, homePage }) => {
    //     // Navigate to Edit Account page       
    //     const newFirstName = ""; // Invalid first name  
    //     const newLastName = faker.person.lastName();
    //     const newEmail = "invalid-email-format"; // Invalid email
    //     const phone = faker.phone.number({ style: "national" });
    //     console.log(`Generated phone: ${phone}, email: ${loginData.email}`);
    //     await editAccountPage.fillMyAccountDetails(newFirstName, newLastName, newEmail, phone);
    //     await editAccountPage.clickContinueButton();
    //     // Verify warning message
    //     await editAccountPage.verifyUpdateWarningMessage('Warning: Please check the form carefully for errors!'); 
    // });

});