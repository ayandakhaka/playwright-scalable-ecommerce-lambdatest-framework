import { Page, expect } from "@playwright/test";
import { ActionHelper } from "../utils/ActionHelper.js";

// ✅ Use 'assert { type: "json" }' instead of 'with { type: "json" }'
import loginJson from "../test-data/login.test.data.json" with { type: "json" };

/**
 * Page Object Model for the Login page
 * Handles all interactions related to login and logout
 */
export class LoginPage {
  private page: Page; // Playwright page object for browser interactions
  private actionHelper: ActionHelper; // Helper for common actions like click, type, wait, verify

  constructor(page: Page, actionHelper: ActionHelper) {
    this.page = page;
    this.actionHelper = actionHelper;
  }

  // ------------------------------
  // Locators
  // ------------------------------
  private emailInput = 'input[name="email"]';
  private passwordInput = 'input[name="password"]';
  private loginButton = 'input[value="Login"]';
  private logoutLink = 'a:has-text("Logout")';
  private loginErrorMessage = ".alert.alert-danger.alert-dismissible";
  private editAccountLink = 'a.list-group-item:has-text("Edit Account")';
  private loginData = loginJson;

  // ------------------------------
  // Methods
  // ------------------------------

  async login(email: string, password: string) {
    await this.actionHelper.type(this.emailInput, email, "Email Input");
    await this.actionHelper.type(this.passwordInput, password, "Password Input");
    await this.actionHelper.click(this.loginButton, "Login Button");
  }

  async clickContinueButton() {
    await this.actionHelper.click('input[value="Continue"]', "Continue Button");
  }

  async verifyLoginSuccess() {
    console.log("Current URL:", this.page.url());
    await expect(this.page).toHaveURL(this.loginData.url);
  }

    // ✅ Add this helper
  async waitForLoginPageToLoad() {
    await expect(this.page.locator(this.emailInput)).toBeVisible({ timeout: 15000 });
    await expect(this.page.locator(this.passwordInput)).toBeVisible();
    console.log("✅ Login page loaded and ready");
  }


  async verifyLoginError(expectedMessage: string) {
    await this.actionHelper.waitForVisible(this.loginErrorMessage, "Login Error Message");
    await this.actionHelper.verifyText(this.loginErrorMessage, expectedMessage, "Login Error Message");
  }

  async logout() {
    await this.actionHelper.click(this.logoutLink, "Logout Link");
  }

  async clickEditAccountLink() {
    await this.actionHelper.waitForVisible(this.editAccountLink, "Edit Account Link");
    await this.actionHelper.click(this.editAccountLink, "Edit Account Link");
  }
}
