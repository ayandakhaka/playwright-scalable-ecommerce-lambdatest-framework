import { Page, expect } from '@playwright/test';
import { ActionHelper } from '../utils/ActionHelper';

/**
 * Page Object Model for the Login page
 * Handles all interactions related to login and logout
 */
export class LoginPage {
    private page: Page;                 // Playwright page object for browser interactions
    private actionHelper: ActionHelper; // Helper for common actions like click, type, wait, verify

    constructor(page: Page, actionHelper: ActionHelper) {
        this.page = page;
        this.actionHelper = actionHelper;
    }

    // ------------------------------
    // Locators
    // ------------------------------
    private emailInput = 'input[name="email"]';                       // Email input field
    private passwordInput = 'input[name="password"]';                 // Password input field
    private loginButton = 'input[value="Login"]';                     // Login button
    private logoutLink = 'a:has-text("Logout")';                      // Logout link
    private myAccountHeader = "'heading', { name: 'My Account' }";   // Account header (role-based locator)
    private loginErrorMessage = '.alert.alert-danger.alert-dismissible'; // Error message for invalid login
    private editAccountLink = 'a.list-group-item:has-text("Edit Account")'; // Edit Account link in My Account menu
    // ------------------------------
    // Methods
    // ------------------------------

    /**
     * Perform login with given email and password
     * @param email - user email
     * @param password - user password
     */
    async login(email: string, password: string) {
        await this.actionHelper.type(this.emailInput, email, 'Email Input');
        await this.actionHelper.type(this.passwordInput, password, 'Password Input');
        await this.actionHelper.click(this.loginButton, 'Login Button');
    }

    async clickContinueButton() {
        await this.actionHelper.click('input[value="Continue"]', 'Continue Button');
    }

    /**
     * Verify successful login by checking URL
     */
    async verifyLoginSuccess() {
        console.log('Current URL:', this.page.url());
        // Wait until account page loads after login
        await expect(this.page).toHaveURL(/.*route=account\/account.*/);
    }

    /**
     * Verify login error message
     * @param expectedMessage - Expected error text
     */
    async verifyLoginError(expectedMessage: string) {
        await this.actionHelper.waitForVisible(this.loginErrorMessage, 'Login Error Message');
        await this.actionHelper.verifyText(this.loginErrorMessage, expectedMessage, 'Login Error Message');
    }

    /**
     * Logout from the application
     */
    async logout() {
        await this.actionHelper.click(this.logoutLink, 'Logout Link');
    }

    async clickEditAccountLink() {
        await this.actionHelper.waitForVisible(this.editAccountLink, 'Edit Account Link');
        await this.actionHelper.click(this.editAccountLink, 'Edit Account Link');
    }
}
