import { test, expect } from "../fixtures/TestBase.js";
import { faker } from "@faker-js/faker";
import * as FakeDataGenerator from "../utils/FakeDataGenerator.js";
import { generateFakeUser, saveRegisteredUser } from "../utils/FakeDataGenerator.js";
import { step } from "../utils/testStepHelper.js";


test.setTimeout(60000);
const user = generateFakeUser();

test.describe("Register Account Tests", () => {

  test.beforeEach(async ({ actionHelper, homePage }) => {
    await step("Navigate to homepage and open Register page", async () => {
      await actionHelper.navigateToFullUrl("/index.php?route=common/home");
      await homePage.hoverMyAccountMenu();
      await homePage.clickRegisterLink();
    });
  });

  /**
   * ✅ Positive Test - Register successfully
   */
  test("Register a new account successfully", async ({ registerAccountPage }) => {
    console.log(`Generated user for test: ${JSON.stringify(user)}`);

    await step("Fill registration form with valid user details", async () => {
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

    await step("Verify registration success message", async () => {
      await registerAccountPage.verifyRegistrationSuccess();
    });

    await step("Save registered user data", async () => {
      saveRegisteredUser(user);
    });
  });

  /**
   * ❌ Negative Test - No privacy policy
   */
  test("Attempt to register without agreeing to the privacy policy", async ({ registerAccountPage, actionHelper }) => {
    await step("Fill registration form", async () => {
      await registerAccountPage.fillRegistrationForm(user.firstName, user.lastName, user.email, user.phone, user.password);
    });

    await step("Click continue without checking Privacy Policy", async () => {
      await registerAccountPage.clickContinueButton();
    });

    await step("Verify privacy policy warning message", async () => {
      await actionHelper.verifyText(
        "div.alert.alert-danger.alert-dismissible",
        "Warning: You must agree to the Privacy Policy!",
        "Privacy Policy Warning"
      );
    });
  });

  /**
   * ❌ Negative Test - Duplicate email
   */
  test("Attempt to register with an already registered email", async ({ registerAccountPage }) => {
    const email = "khakaalwande@gmail.com"; // Pre-registered email

    await step("Fill form with existing email", async () => {
      await registerAccountPage.fillRegistrationForm(user.firstName, user.lastName, email, user.phone, user.password);
      await registerAccountPage.clickPrivacyPolicyCheckbox();
      await registerAccountPage.clickContinueButton();
    });

    await step("Verify duplicate email warning", async () => {
      await registerAccountPage.verifyEmailAlreadyRegisteredError();
    });
  });

  /**
   * ❌ Negative Test - Invalid email format
   */
  test("Attempt to register with invalid email format", async ({ registerAccountPage }) => {
    const email = "invalid-email-format"; // Invalid format

    await step("Fill form with invalid email format", async () => {
      await registerAccountPage.fillRegistrationForm(user.firstName, user.lastName, email, user.phone, user.password);
      await registerAccountPage.clickPrivacyPolicyCheckbox();
      await registerAccountPage.clickContinueButton();
    });

    await step("Verify invalid email format validation message", async () => {
      await registerAccountPage.verifyInvalidEmailFormatError();
    });
  });

  /**
   * ❌ Negative Test - Weak password
   */
  test("Attempt to register with weak password", async ({ registerAccountPage }) => {
    const password = "123"; // Too short

    await step("Fill registration form with weak password", async () => {
      await registerAccountPage.fillRegistrationForm(user.firstName, user.lastName, user.email, user.phone, password);
      await registerAccountPage.clickPrivacyPolicyCheckbox();
      await registerAccountPage.clickContinueButton();
    });

    await step("Verify password validation error message", async () => {
      await registerAccountPage.verifyPasswordValidationMessage(
        "Password must be between 4 and 20 characters!"
      );
    });
  });

  /**
   * ❌ Negative Test - Missing mandatory fields
   */
  test("Attempt to register with missing mandatory fields", async ({ registerAccountPage }, testInfo) => {
    await step("Submit form without filling any fields", async () => {
      await registerAccountPage.clickPrivacyPolicyCheckbox();
      await registerAccountPage.clickContinueButton();
    });

    await step("Verify all required field validation messages", async () => {
      await registerAccountPage.verifyFieldValidationMessages([
        "First Name must be between 1 and 32 characters!",
        "Last Name must be between 1 and 32 characters!",
        "E-Mail Address does not appear to be valid!",
        "Telephone must be between 3 and 32 characters!",
        "Password must be between 4 and 20 characters!"
      ]);
    });
  });

  /**
   * ❌ Negative Test - Password mismatch
   */
  test("Attempt to register with mismatched password and confirm password", async ({ registerAccountPage, actionHelper }) => {
    const password = "Password@2025";
    const confirmPassword = "DifferentPassword@2025"; // Does not match

    await step("Fill registration form with mismatched passwords", async () => {
      await registerAccountPage.fillRegistrationWithDifferentPassword(
        user.firstName,
        user.lastName,
        user.email,
        user.phone,
        password,
        confirmPassword
      );
      await registerAccountPage.clickPrivacyPolicyCheckbox();
      await registerAccountPage.clickContinueButton();
    });

    await step("Verify password mismatch error message", async () => {
      await actionHelper.verifyText(
        "div.text-danger",
        "Password confirmation does not match password!",
        "Confirm Password Mismatch Warning"
      );
    });
  });
});
