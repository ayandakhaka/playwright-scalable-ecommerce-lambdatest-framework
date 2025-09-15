import { test } from "../fixtures/TestBase";
import { faker } from "@faker-js/faker";

test.describe("Register Account Tests", () => {
    test.beforeEach(async ({ actionHelper, registerAccountPage }) => {
        // Navigate to the registration page
        await actionHelper.navigateTo("https://ecommerce-playground.lambdatest.io/index.php?route=common/home");
        await registerAccountPage.hoverMyAccountMenu();
        await registerAccountPage.clickRegisterLink();
    });

    test("Register a new account successfully", async ({ 
        actionHelper,
         registerAccountPage 
    }) => {
        // Generate random user data using faker
        const firstName = faker.person.firstName();  
        const lastName = faker.person.lastName();
        const email = faker.internet.email({firstName, lastName});
        const phone = faker.phone.number({ style: 'national' }); // ✅ Works
        console.log(phone);
        const password = faker.internet.password("hlongwane@2011"); // 12 character password

        // Fill out the registration form
        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);
        await registerAccountPage.submitRegistration();
        // Verify successful registration
        await registerAccountPage.verifyRegistrationSuccess();
    });

    test("Attempt to register without agreeing to the privacy policy", async ({ 
        actionHelper,
         registerAccountPage
        }) => {
        // Generate random user data using faker
        const firstName = faker.person.firstName();  
        const lastName = faker.person.lastName();
        const email = faker.internet.email({firstName, lastName});
        const phone = faker.phone.number({ style: 'national' }); // ✅ Works
        console.log(phone);
        const password = faker.internet.password("hlongwane@2011"); // 12 character password            
        // Fill out the registration form
        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);
        // Intentionally do not agree to the privacy policy
        await registerAccountPage.clickContinueButton();
        // Verify error message for not agreeing to the privacy policy
        await actionHelper.verifyText('div.alert.alert-danger.alert-dismissible', 'Warning: You must agree to the Privacy Policy!', 'Privacy Policy Warning');
    });
    
});
