import { test } from "../fixtures/TestBase";
import { faker } from "@faker-js/faker";

test.describe("Register Account Tests", () => {
    test("Register a new account successfully", async ({ actionHelper, registerAccountPage }) => {
        // Generate random user data using faker
        const firstName = faker.name.firstName();  
        const lastName = faker.name.lastName();
        const email = faker.internet.email({firstName, lastName});
        const phone = faker.phone.number({ style: 'national' }); // ✅ Works
        console.log(phone);
        const password = faker.internet.password("hlongwane@2011"); // 12 character password

        // Navigate to the registration page
        await actionHelper.navigateTo("https://ecommerce-playground.lambdatest.io/index.php?route=common/home");
        await registerAccountPage.hoverMyAccountMenu();
        await registerAccountPage.clickRegisterLink();
        // Fill out the registration form
        await registerAccountPage.fillRegistrationForm(firstName, lastName, email, phone, password);
        await registerAccountPage.submitRegistration();
        // Verify successful registration
        await registerAccountPage.verifyRegistrationSuccess();
    });
});
