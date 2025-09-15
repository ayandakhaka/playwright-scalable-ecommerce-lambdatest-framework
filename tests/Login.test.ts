import { LogoutPage } from "pages/LogoutPage";
import {test, expect} from "../fixtures/TestBase";
import { faker } from "@faker-js/faker";

const email: string = "khakaalwande@gmail.com";
const password: string = "hlongwane@2011";
test.describe("Login Tests", () => {
  test.beforeEach(async ({ actionHelper, homePage, loginPage}) => {
   
    // Navigate to the login page
    await actionHelper.navigateTo(
      "https://ecommerce-playground.lambdatest.io/index.php?route=common/home"
    );
  });

  test("Login with valid credentials", async ({ loginPage, homePage, logoutPage }) => {
    await homePage.hoverMyAccountMenu();
    // Navigate to login
    await homePage.clickLoginLink();

    // Perform login
    await loginPage.login(email, password);


    // Verify login success
    await loginPage.verifyLoginSuccess();
  });

    test("Login with invalid credentials", async ({ loginPage, homePage}) => {
        await homePage.hoverMyAccountMenu();
        // Navigate to login
        await homePage.clickLoginLink();
        // Perform login with invalid credentials
        await loginPage.login(faker.internet.email(), faker.internet.password());
        // Verify login error message
        await loginPage.verifyLoginError(
            "Warning: No match for E-Mail Address and/or Password."
        );
    })

    test("Logout after login", async ({ loginPage, homePage, logoutPage }) => {
        await homePage.hoverMyAccountMenu();
        // Navigate to login
        await homePage.clickLoginLink();    
        // Perform login
        await loginPage.login(email, password);
        // Verify login success
        await loginPage.verifyLoginSuccess();
        await homePage.hoverMyAccountMenu();
        // Perform logout
        await logoutPage.clickLogoutLink();
        // Verify logout success by checking if redirected to home page
        await logoutPage.verifyLogoutSuccess();
    });  

    test ("Login with empty credentials", async ({ loginPage, homePage}) => {
        await homePage.hoverMyAccountMenu();    
        // Navigate to login
        await homePage.clickLoginLink();
        // Perform login with empty credentials
        await loginPage.login("", "");
        // Verify login error message
        await loginPage.verifyLoginError(
            "Warning: No match for E-Mail Address and/or Password."
        );
    });
});