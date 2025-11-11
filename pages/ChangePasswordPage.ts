import { Page, expect } from '@playwright/test';
import { ActionHelper } from '../utils/ActionHelper.js';

export default class ChangePassword {
    private page: Page;                 // Playwright page object for browser interactions
    private actionHelper: ActionHelper; // Helper for common actions like click, type, wait, verify 
    constructor(page: Page, actionHelper: ActionHelper) {
        this.page = page;
        this.actionHelper = actionHelper;
    }

    // ------------------------------
    // Locators
    // ------------------------------
    private passwordInput = '#input-password';
    private passwordConfirm = '#input-confirm';
    private continueButton = 'input[value="Continue"]';
    private successText = 'div.alert-success:has-text("Your password has been successfully updated")';
    private fieldValidationMessage = '.text-danger';

    async fillForgotPasswordDetails(password: string, passwordConfirm: string) {
        await this.actionHelper.type(this.passwordInput, password, "Password Input Field");
        await this.actionHelper.type(this.passwordConfirm, passwordConfirm, "Password Confirm Input Field");
    }

    async clickContinue() {
        await this.actionHelper.click(this.continueButton, 'Continue Button');
    }

    async verifyChangePasswordSuccessMessage(expectedMessage: string) {
       // await this.actionHelper.waitForVisible(this.successText, 'Success Message');
        await this.actionHelper.verifyText(this.successText, expectedMessage, 'Success Message');
    }

    async verifyChangePasswordErrorMessage(expectedMessage: string) {
       // await this.actionHelper.waitForVisible(this.successText, 'Success Message');
        await this.actionHelper.verifyText(this.fieldValidationMessage, expectedMessage, 'Mismatch password text');
    }


}
