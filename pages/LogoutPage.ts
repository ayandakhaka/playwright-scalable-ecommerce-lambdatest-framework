import { Page } from '@playwright/test';
import { ActionHelper } from '../utils/ActionHelper';

/**
 * Page Object Model for the "Logout" page
 * Encapsulates interactions related to logging out and verifying logout success.
 */
export class LogoutPage {
    private page: Page;                 // Playwright page object for browser interactions
    private actionHelper: ActionHelper; // Helper for common actions like click, wait, verify

    constructor(page: Page, actionHelper: ActionHelper) {
        this.page = page;
        this.actionHelper = actionHelper;
    }

    // ------------------------------
    // Locators for logout page elements
    // ------------------------------
    private continueButton = 'h1.page-title:has-text("Account Logout")'; // The "Continue" button after logout
    private logoutLink = 'span.title:text("Logout")';                   // The "Logout" link/menu item

    // ------------------------------
    // Methods to interact with elements
    // ------------------------------

    /**
     * Click the "Logout" link
     * Waits until the link is visible before clicking
     */
    async clickLogoutLink() {
        await this.actionHelper.waitForVisible(this.logoutLink, 'Logout Link');
        await this.actionHelper.click(this.logoutLink, 'Logout Link');
    }

    /**
     * Click the "Continue" button after logout
     * Waits for the button to be visible before clicking
     */
    async clickContinue() {
        await this.actionHelper.waitForVisible(this.continueButton, 'Continue Button');
        await this.actionHelper.click(this.continueButton, 'Continue Button');
    }

    /**
     * Verify that logout was successful
     * Waits for the logout success message and verifies its text
     */
    async verifyLogoutSuccess() {
        await this.actionHelper.waitForVisible(this.continueButton, 'Logout Message');
        await this.actionHelper.verifyText(this.continueButton, 'Account Logout', 'Logout Message');
    }
}
