import { test, expect, } from "../fixtures/TestBase";
import { faker } from "@faker-js/faker";
import { Page } from '@playwright/test';

test.describe("Register Account Tests", () => {

    // Run before each test
    test.beforeEach(async ({ actionHelper, registerAccountPage, homePage }) => {
        // Navigate to the homepage
        await actionHelper.navigateTo(
            "https://ecommerce-playground.lambdatest.io/index.php?route=common/home"
        );

        // Hover over 'My Account' menu and click 'Register'
        await homePage.hoverMyAccountMenu();
        await homePage.clickRegisterLink();
    });

    // Test case: Register a new account successfully
    test("Register a new account successfully", async ({ registerAccountPage }) => {
        // Generate random user data using faker
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const phone = faker.phone.number({ style: 'national' });
        const password = faker.internet.password({ length: 12 }) + "@2025"; // Ensure password meets site requirements

        console.log(`Generated phone: ${phone}, email: ${email}`);

        // Fill out the registration form
        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);
        await registerAccountPage.submitRegistration();

        // Verify successful registration
        await registerAccountPage.verifyRegistrationSuccess();
    });

    // Test case: Attempt registration without agreeing to privacy policy
    test("Attempt to register without agreeing to the privacy policy", async ({ registerAccountPage, actionHelper }) => {
        // Generate random user data
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const phone = faker.phone.number({ style: 'national' });
        const password = faker.internet.password({ length: 12 }) + "@2025";

        console.log(`Generated phone: ${phone}, email: ${email}`);

        // Fill out the registration form but do NOT agree to privacy policy
        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);

        // Attempt to continue without checking privacy policy
        await registerAccountPage.clickContinueButton();

        // Verify that the proper error message is displayed
        await actionHelper.verifyText(
            'div.alert.alert-danger.alert-dismissible',
            'Warning: You must agree to the Privacy Policy!',
            'Privacy Policy Warning'
        );
    });

    test ("Attempt to register with an already registered email", async ({ registerAccountPage, actionHelper }) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = "khakaalwande@gmail.com"; // Known registered email
        const phone = faker.phone.number({ style: 'national' });
        const password = faker.internet.password({ length: 12 }) + "@2025";
        console.log(`Generated phone: ${phone}, email: ${email}`);
        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);
        await registerAccountPage.clickPrivacyPolicyCheckbox();
        await registerAccountPage.clickContinueButton();
        await registerAccountPage.verifyEmailAlreadyRegisteredError();
    });

    test ("Attempt to register with invalid email format", async ({ registerAccountPage, actionHelper }) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = "invalid-email-format"; // Invalid email format
        const phone = faker.phone.number({ style: 'national' });
        const password = faker.internet.password({ length: 12 }) + "@2025";
        console.log(`Generated phone: ${phone}, email: ${email}`);
        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);
        await registerAccountPage.clickPrivacyPolicyCheckbox();
        await registerAccountPage.clickContinueButton();
        await registerAccountPage.verifyInvalidEmailFormatError();
    });

    test ("Attempt to register with weak password", async ({ registerAccountPage, actionHelper }) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const phone = faker.phone.number({ style: 'national' });
        const password = "123"; // Weak password
        console.log(`Generated phone: ${phone}, email: ${email}`);
        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);
        await registerAccountPage.clickPrivacyPolicyCheckbox();
        await registerAccountPage.clickContinueButton();
        await registerAccountPage.verifyPasswordValidationMessage("Password must be between 4 and 20 characters!");
    });

    test("Attempt to register with missing mandatory fields", async ({ registerAccountPage, actionHelper }) => {
        // Attempt to submit the form without filling any fields
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

    test("Attempt to register with mismatched password and confirm password", 
        async ({ registerAccountPage, actionHelper }) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const phone = faker.phone.number({ style: 'national' });
        const password = "Password@2025";
        const confirmPassword = "DifferentPassword@2025";   // Mismatched confirm password
        console.log(`Generated phone: ${phone}, email: ${email}`);

        // Fill form but pass both password and confirmPassword (you may need to update your page object)
        await registerAccountPage.fillRegistrationWithDifferentPassword(firstName, lastName, email, phone, password, confirmPassword);

        await registerAccountPage.clickPrivacyPolicyCheckbox();
        await registerAccountPage.clickContinueButton();

        await actionHelper.verifyText(
            'div.text-danger',
            'Password confirmation does not match password!',
            'Confirm Password Mismatch Warning'
        );
    });
});
