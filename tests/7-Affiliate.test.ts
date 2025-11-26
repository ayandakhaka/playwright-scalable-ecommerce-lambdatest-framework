import { test, expect } from "../fixtures/TestBase.js";
import registeredUsers from "../test-data/registeredUsers.json";
import { step } from "../utils/testStepHelper.js";
import { generateFakeUser, saveRegisteredUser } from "../utils/FakeDataGenerator.js";

let user: any;

// Increase timeout for slow UI
test.setTimeout(60000);

test.describe.configure({ mode: 'parallel' });

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
    test.describe("Positive Tests for Affiliate Registration", () => {
        test("Register  as an affiliate", async ({ affiliatePage }) => {

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
    test.describe("Negative Tests for Check payment method Affiliate Registration", () => {

        test("Attempt to register as an affiliate without cheque payee name", async ({ affiliatePage }) => {

            await step("Navigate to Affiliate Registration Page", async () => {
                await affiliatePage.navigateToAffiliateRegistration();
            });
            await step("Fill Affiliate Registration Form without Cheque Payee Name", async () => {
                await affiliatePage.enterCompanyName(user.companyName);
                await affiliatePage.enterWebsite("www." + user.companyName.toLowerCase() + "affiliates.com");
                await affiliatePage.enterTaxId(user.taxId);
                await affiliatePage.selectPaymentMethod("cheque", "");
            });
            await step("Agree to terms and conditions", async () => {
                await affiliatePage.agreeToTerms();
            });
            await step("Submit Affiliate Registration", async () => {
                await affiliatePage.clickContinueButtonForAffiliate();
            });
            await step("Verify Cheque Payee Name Error Message", async () => {
                await affiliatePage.verifyCheckPayeeNameError("Cheque Payee Name required!");
            });
        });

        test("Attempt to register as an affiliate without agreeing to terms in check payment method", async ({ affiliatePage }) => {
            await step("Navigate to Affiliate Registration Page", async () => {
                await affiliatePage.navigateToAffiliateRegistration();
            });
            await step("Fill Affiliate Registration Form with Cheque Payment Method", async () => {
                await affiliatePage.enterCompanyName(user.companyName);
                await affiliatePage.enterWebsite("www." + user.companyName.toLowerCase() + "affiliates.com");
                await affiliatePage.enterTaxId(user.taxId);
                await affiliatePage.selectPaymentMethod("cheque", user.firstName + " " + user.lastName);
            });
            await step("Submit Affiliate Registration without agreeing to terms", async () => {
                await affiliatePage.clickContinueButtonForAffiliate();
            });
            await step("Verify Agree to Terms Error Message", async () => {
                await affiliatePage.verifyAgreeTermsErrorMessage("Warning: You must agree to the About Us!");
            });
        });
    });

    test.describe("Negative Tests for PayPal payment method Affiliate Registration", () => {

        test("Attempt to register as an affiliate without agreeing to terms in PayPal payment method", async ({ affiliatePage }) => {
            await step("Navigate to Affiliate Registration Page", async () => {
                await affiliatePage.navigateToAffiliateRegistration();
            });
            await step("Fill Affiliate Registration Form with PayPal Payment Method", async () => {
                await affiliatePage.enterCompanyName(user.companyName);
                await affiliatePage.enterWebsite("www." + user.companyName.toLowerCase() + "affiliates.com");
                await affiliatePage.enterTaxId(user.taxId);
                await affiliatePage.selectPaymentMethod("paypal", undefined, user.email);
            });
            await step("Submit Affiliate Registration without agreeing to terms", async () => {
                await affiliatePage.clickContinueButtonForAffiliate();
            });
            await step("Verify Agree to Terms Error Message", async () => {
                await affiliatePage.verifyAgreeTermsErrorMessage("Warning: You must agree to the About Us!");
            });
        });

        test("Attempt to register as an affiliate without paypal email account", async ({ affiliatePage }) => {
            await step("Navigate to Affiliate Registration Page", async () => {
                await affiliatePage.navigateToAffiliateRegistration();
            });
            await step("Fill Affiliate Registration Form without PayPal Email Account", async () => {
                await affiliatePage.enterCompanyName(user.companyName);
                await affiliatePage.enterWebsite("www." + user.companyName.toLowerCase() + "affiliates.com");
                await affiliatePage.enterTaxId(user.taxId);
                await affiliatePage.selectPaymentMethod("paypal", undefined, "");
            });
            await step("Agree to terms and conditions", async () => {
                await affiliatePage.agreeToTerms();
            });
            await step("Submit Affiliate Registration", async () => {
                await affiliatePage.clickContinueButtonForAffiliate();
            });
            await step("Verify Agree to Terms Error Message", async () => {
                await affiliatePage.verifyCheckPayeeNameError("PayPal Email Address does not appear to be valid!");
            });
        });
    });

    test.describe("Negative Tests for Bank Transfer payment method Affiliate Registration", () => {

        test("Attempt to register as an affiliate without agreeing to terms in Bank Transfer payment method", async ({ affiliatePage }) => {
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
            await step("Submit Affiliate Registration without agreeing to terms", async () => {
                await affiliatePage.clickContinueButtonForAffiliate();
            });
            await step("Verify Agree to Terms Error Message", async () => {
                await affiliatePage.verifyAgreeTermsErrorMessage("Warning: You must agree to the About Us!");
            });
        });

        test("Attempt to register as an affiliate without account name", async ({ affiliatePage }) => {
            await step("Navigate to Affiliate Registration Page", async () => {
                await affiliatePage.navigateToAffiliateRegistration();
            });
            await step("Fill Affiliate Registration Form without Account Name", async () => {
                await affiliatePage.enterCompanyName(user.companyName);
                await affiliatePage.enterWebsite("www." + user.companyName.toLowerCase() + "affiliates.com");
                await affiliatePage.enterTaxId(user.taxId);
                await affiliatePage.selectPaymentMethod("bank",
                    undefined,
                    undefined,
                    user.taxId,
                    "Bank of Testing", "SWIFT-" + user.swiftCode,
                    "",
                    user.accountNumber);
            });
            await step("Agree to terms and conditions", async () => {
                await affiliatePage.agreeToTerms();
            });
            await step("Submit Affiliate Registration", async () => {
                await affiliatePage.clickContinueButtonForAffiliate();
            });
            await step("Verify Account Name Error Message", async () => {
                await affiliatePage.verifyCheckPayeeNameError("Account Name required!");
            });
        });

        test("Attempt to register as an affiliate without account number", async ({ affiliatePage }) => {
            await step("Navigate to Affiliate Registration Page", async () => {
                await affiliatePage.navigateToAffiliateRegistration();
            });
            await step("Fill Affiliate Registration Form without Account Number", async () => {
                await affiliatePage.enterCompanyName(user.companyName);
                await affiliatePage.enterWebsite("www." + user.companyName.toLowerCase() + "affiliates.com");
                await affiliatePage.enterTaxId(user.taxId);
                await affiliatePage.selectPaymentMethod("bank",
                    undefined,
                    undefined,
                    user.taxId,
                    "Bank of Testing", "SWIFT-" + user.swiftCode,
                    user.accountName,
                    "");
            });
            await step("Agree to terms and conditions", async () => {
                await affiliatePage.agreeToTerms();
            });
            await step("Submit Affiliate Registration", async () => {
                await affiliatePage.clickContinueButtonForAffiliate();
            });
            await step("Verify Account Number Error Message", async () => {
                await affiliatePage.verifyAccountNumberError("Account Number required!");
            });
        });      
    });
});


