import { Page } from '@playwright/test';
import { ActionHelper } from '../utils/ActionHelper';

export class LogoutPage {
    private page: Page;
    private actionHelper: ActionHelper;

    constructor(page: Page, actionHelper: ActionHelper) {
        this.page = page;
        this.actionHelper = actionHelper;
    }

    // Locators
    private continueButton = 'h1.page-title:has-text("Account Logout")';
    private logoutLink = 'span.title:text("Logout")';

    // Methods

    async clickLogoutLink() {
        await this.actionHelper.waitForVisible(this.logoutLink, 'Logout Link');
        await this.actionHelper.click(this.logoutLink, 'Logout Link');
    }

    async clickContinue() {
        await this.actionHelper.waitForVisible(this.continueButton, 'Continue Button');
        await this.actionHelper.click(this.continueButton, 'Logout Link');
    }

    async verifyLogoutSuccess() {
        await this.actionHelper.waitForVisible(this.continueButton, 'Logout Message');
        await this.actionHelper.verifyText(this.continueButton, 'Account Logout', 'Logout Message');
    }
}