import { test, expect } from "../fixtures/TestBase.js";
import registeredUsers from "../test-data/registeredUsers.json";
import { step } from "../utils/testStepHelper.js";
import { generateFakeUser, saveRegisteredUser } from "../utils/FakeDataGenerator.js";

let user: any;

// Increase timeout for slow UI
test.setTimeout(60000);

test.describe("Affiliation Registration tests", () => {

    test.beforeEach(async ({ homePage, actionHelper, loginPage, registerAccountPage }) => {

        // Generate a new user before each test
        user = generateFakeUser();

        await step("Navigate to registration page", async () => {
            await actionHelper.navigateToFullUrl("/index.php?route=common/home");
            await homePage.hoverMyAccountMenu();
            await homePage.clickRegisterLink();
        });

        await step("Fill the user registration form", async () => {
            await registerAccountPage.fillRegistrationForm(
                user.firstName,
                user.lastName,
                user.email,
                user.phone,
                user.password
            );
        });

        await step("Submit the registration form", async () => {
            await registerAccountPage.submitRegistration();
        });

        await step("Click Continue after account creation", async () => {
            await loginPage.clickContinueAfterAccountCreation();
        });

        await step("Save newly registered user data", async () => {
            saveRegisteredUser(user);
        });

    });

    test("Register as an affiliate", async ({ affiliatePage }) => {

        await step("Navigate to Affiliate Registration Page", async () => {
            await affiliatePage.navigateToAffiliateRegistration();
        });

        await step("Fill Affiliate Registration Form", async () => {
            await affiliatePage.enterCompanyName(user.companyName);
            await affiliatePage.enterWebsite("www." + user.companyName.toLowerCase() + "affiliates.com");
            await affiliatePage.enterTaxId(user.taxId);
            await affiliatePage.selectPaymentMethod("paypal", undefined, user.email);
        });

        await step("Agree to terms and conditions", async () => {
            await affiliatePage.agreeToTerms();
        });

        await step("Submit Affiliate Registration", async () => {
            await affiliatePage.clickContinueButtonForAffiliate();
        });

        await step("Verify Affiliate Registration Success Message", async () => {
            await affiliatePage.verifyAffiliateSuccessMessage("Success: Your account has been successfully updated.");
        });
    });

    test("Register as an affiliate with cheque payment method", async ({ affiliatePage }) => {

        await step("Navigate to Affiliate Registration Page", async () => {
            await affiliatePage.navigateToAffiliateRegistration();
        });
        await step("Fill Affiliate Registration Form with Cheque Payment Method", async () => {
            await affiliatePage.enterCompanyName(user.companyName);
            await affiliatePage.enterWebsite("www." + user.companyName.toLowerCase() + "affiliates.com");
            await affiliatePage.enterTaxId(user.taxId);
            await affiliatePage.selectPaymentMethod("cheque", user.firstName + " " + user.lastName);
        });

        await step("Agree to terms and conditions", async () => {
            await affiliatePage.agreeToTerms();
        });
        await step("Submit Affiliate Registration", async () => {
            await affiliatePage.clickContinueButtonForAffiliate();
        });

        await step("Verify Affiliate Registration Success Message", async () => {
            await affiliatePage.verifyAffiliateSuccessMessage("Success: Your account has been successfully updated.");
        });
    });

    test("Register as an affiliate with bank transfer payment method", async ({ affiliatePage }) => {
        await step("Navigate to Affiliate Registration Page", async () => {
            await affiliatePage.navigateToAffiliateRegistration();
        });

        await step("Fill Affiliate Registration Form with Bank Transfer Payment Method", async () => {
            await affiliatePage.enterCompanyName(user.companyName);
            await affiliatePage.enterWebsite("www." + user.companyName.toLowerCase() + "affiliates.com");
            await affiliatePage.enterTaxId(user.taxId);
            await affiliatePage.selectPaymentMethod("bank", 
                undefined, 
                undefined, 
                user.taxId, 
                "Bank of Testing", "SWIFT-" + user.swiftCode, 
                user.accountName, 
                user.accountNumber);
        });

        await step("Agree to terms and conditions", async () => {
            await affiliatePage.agreeToTerms();
        });
        await step("Submit Affiliate Registration", async () => {
            await affiliatePage.clickContinueButtonForAffiliate();
        });

        await step("Verify Affiliate Registration Success Message", async () => {
            await affiliatePage.verifyAffiliateSuccessMessage("Success: Your account has been successfully updated.");
        });
    });
    
});


