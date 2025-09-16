import { test, expect } from "../fixtures/TestBase";
import { faker } from "@faker-js/faker";
import { Page } from "@playwright/test";

test.describe("Register Account Tests", () => {

    // ✅ Runs before each test case to ensure a clean state
    test.beforeEach(async ({ actionHelper, registerAccountPage, homePage }) => {
        // Navigate to homepage
        await actionHelper.navigateTo(
            "https://ecommerce-playground.lambdatest.io/index.php?route=common/home"
        );

        // Open registration page via "My Account" → "Register"
        await homePage.hoverMyAccountMenu();
        await homePage.clickRegisterLink();
    });

    /**
     * ✅ Positive Test
     * Registers a new user successfully with valid details.
     * Expects: Registration success message/page is displayed.
     */
    test("Register a new account successfully", async ({ registerAccountPage }) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const phone = faker.phone.number({ style: "national" });
        const password = faker.internet.password({ length: 12 }) + "@2025"; // Enforces strong password

        console.log(`Generated phone: ${phone}, email: ${email}`);

        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);
        await registerAccountPage.submitRegistration();

        await registerAccountPage.verifyRegistrationSuccess();
    });

    /**
     * ❌ Negative Test
     * User tries to register without agreeing to Privacy Policy.
     * Expects: "Warning: You must agree to the Privacy Policy!" alert.
     */
    test("Attempt to register without agreeing to the privacy policy", async ({ registerAccountPage, actionHelper }) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const phone = faker.phone.number({ style: "national" });
        const password = faker.internet.password({ length: 12 }) + "@2025";

        console.log(`Generated phone: ${phone}, email: ${email}`);

        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);
        await registerAccountPage.clickContinueButton();

        await actionHelper.verifyText(
            "div.alert.alert-danger.alert-dismissible",
            "Warning: You must agree to the Privacy Policy!",
            "Privacy Policy Warning"
        );
    });

    /**
     * ❌ Negative Test
     * User tries to register using an already registered email.
     * Expects: "E-Mail Address is already registered!" error message.
     */
    test("Attempt to register with an already registered email", async ({ registerAccountPage }) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = "khakaalwande@gmail.com"; // Pre-registered email
        const phone = faker.phone.number({ style: "national" });
        const password = faker.internet.password({ length: 12 }) + "@2025";

        console.log(`Generated phone: ${phone}, email: ${email}`);

        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);
        await registerAccountPage.clickPrivacyPolicyCheckbox();
        await registerAccountPage.clickContinueButton();

        await registerAccountPage.verifyEmailAlreadyRegisteredError();
    });

    /**
     * ❌ Negative Test
     * User enters an invalid email format (missing "@").
     * Expects: "Please include an '@' in the email address" error.
     */
    test("Attempt to register with invalid email format", async ({ registerAccountPage }) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = "invalid-email-format"; // Invalid format
        const phone = faker.phone.number({ style: "national" });
        const password = faker.internet.password({ length: 12 }) + "@2025";

        console.log(`Generated phone: ${phone}, email: ${email}`);

        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);
        await registerAccountPage.clickPrivacyPolicyCheckbox();
        await registerAccountPage.clickContinueButton();

        await registerAccountPage.verifyInvalidEmailFormatError();
    });

    /**
     * ❌ Negative Test
     * User enters a weak password ("123").
     * Expects: "Password must be between 4 and 20 characters!" error.
     */
    test("Attempt to register with weak password", async ({ registerAccountPage }) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const phone = faker.phone.number({ style: "national" });
        const password = "123"; // Too short

        console.log(`Generated phone: ${phone}, email: ${email}`);

        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);
        await registerAccountPage.clickPrivacyPolicyCheckbox();
        await registerAccountPage.clickContinueButton();

        await registerAccountPage.verifyPasswordValidationMessage(
            "Password must be between 4 and 20 characters!"
        );
    });

    /**
     * ❌ Negative Test
     * User submits form without filling any mandatory fields.
     * Expects: Validation errors for first name, last name, email, telephone, password.
     */
    test("Attempt to register with missing mandatory fields", async ({ registerAccountPage }) => {
        await registerAccountPage.clickPrivacyPolicyCheckbox();
        await registerAccountPage.clickContinueButton();

        await registerAccountPage.verifyFieldValidationMessages([
            "First Name must be between 1 and 32 characters!",
            "Last Name must be between 1 and 32 characters!",
            "E-Mail Address does not appear to be valid!",
            "Telephone must be between 3 and 32 characters!",
            "Password must be between 4 and 20 characters!"
        ]);
    });

    /**
     * ❌ Negative Test
     * User enters mismatched password and confirm password.
     * Expects: "Password confirmation does not match password!" error.
     */
    test("Attempt to register with mismatched password and confirm password", async ({ registerAccountPage, actionHelper }) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const phone = faker.phone.number({ style: "national" });

        const password = "Password@2025";
        const confirmPassword = "DifferentPassword@2025"; // Does not match

        console.log(`Generated phone: ${phone}, email: ${email}`);

        // Page Object method updated to accept confirmPassword separately
        await registerAccountPage.fillRegistrationWithDifferentPassword(
            firstName,
            lastName,
            email,
            phone,
            password,
            confirmPassword
        );

        await registerAccountPage.clickPrivacyPolicyCheckbox();
        await registerAccountPage.clickContinueButton();

        await actionHelper.verifyText(
            "div.text-danger",
            "Password confirmation does not match password!",
            "Confirm Password Mismatch Warning"
        );
    });
});
