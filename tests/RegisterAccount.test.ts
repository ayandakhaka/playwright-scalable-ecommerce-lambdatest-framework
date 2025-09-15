import { test, expect } from "../fixtures/TestBase";
import { faker } from "@faker-js/faker";

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

});
