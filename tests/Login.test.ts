import { LogoutPage } from "pages/LogoutPage";
import { test, expect } from "../fixtures/TestBase";
import { faker } from "@faker-js/faker";

// Test data
const email: string = "khakaalwande@gmail.com";
const password: string = "hlongwane@2011";

test.describe("Login Tests", () => {

  // Runs before each test
  test.beforeEach(async ({ actionHelper, homePage, loginPage }) => {
    // Navigate to the homepage
    await actionHelper.navigateTo(
      "https://ecommerce-playground.lambdatest.io/index.php?route=common/home"
    );
  });

  // Test case: Login with valid credentials
  test("Login with valid credentials", async ({ loginPage, homePage, logoutPage }) => {
    await homePage.hoverMyAccountMenu(); // Hover to reveal menu
    await homePage.clickLoginLink();     // Click Login link

    await loginPage.login(email, password); // Perform login

    await loginPage.verifyLoginSuccess();   // Verify successful login
  });

  // Test case: Login with invalid credentials
  test("Login with invalid credentials", async ({ loginPage, homePage }) => {
    await homePage.hoverMyAccountMenu();
    await homePage.clickLoginLink();

    // Use random credentials
    await loginPage.login(faker.internet.email(), faker.internet.password());

    // Verify error message
    await loginPage.verifyLoginError(
      "Warning: No match for E-Mail Address and/or Password."
    );
  });

  // Test case: Logout after login
  test("Logout after login", async ({ loginPage, homePage, logoutPage }) => {
    await homePage.hoverMyAccountMenu();
    await homePage.clickLoginLink();

    await loginPage.login(email, password); // Login
    await loginPage.verifyLoginSuccess();   // Verify login

    await homePage.hoverMyAccountMenu();
    await logoutPage.clickLogoutLink();     // Perform logout

    // Verify logout success by checking logout page
    await logoutPage.verifyLogoutSuccess();
  });

  // Test case: Login with empty credentials
  test("Login with empty credentials", async ({ loginPage, homePage }) => {
    await homePage.hoverMyAccountMenu();
    await homePage.clickLoginLink();

    // Login with empty email and password
    await loginPage.login("", "");

    // Verify error message
    await loginPage.verifyLoginError(
      "Warning: No match for E-Mail Address and/or Password."
    );
  });

});
