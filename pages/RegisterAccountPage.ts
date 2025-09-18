import { Page, expect } from '@playwright/test';
import { ActionHelper } from '../utils/ActionHelper';
import { faker } from '@faker-js/faker';

/**
 * Page Object Model for the "Register Account" page
 * Encapsulates all interactions with registration form elements and actions.
 */
export class registerAccountPage {
    private page: Page;                 // Playwright page object for interacting with the browser
    private actionHelper: ActionHelper; // Helper for common actions like click, type, wait

    constructor(page: Page, actionHelper: ActionHelper) {
        this.page = page;
        this.actionHelper = actionHelper;
    }

    // ------------------------------
    // Locators for registration page elements
    // ------------------------------
    private firstNameInput = '#input-firstname';
    private lastNameInput = '#input-lastname';
    private emailInput = '#input-email';
    private telephoneInput = '#input-telephone';
    private passwordInput = '#input-password';
    private confirmPasswordInput = '#input-confirm';
    private privacyPolicyCheckbox = "//label[@for='input-agree']";
    private continueButton = 'input[value="Continue"]';
    private successMessage = 'h1:has-text("Your Account Has Been Created!")';
    private logoutLink = 'a:has-text("Logout")';
    private emailInvalidFormatWarning = 'div.alert.alert-danger.alert-dismissible';
    private fieldValidationMessage = '.text-danger';

    // ------------------------------
    // Methods to interact with elements
    // ------------------------------

    /**
     * Fill the registration form with provided data
     */
    async fillRegistrationForm(firstName: string, lastName: string, email: string, telephone: string, password: string) {
        await this.actionHelper.type(this.firstNameInput, firstName, 'First Name Input');
        await this.actionHelper.type(this.lastNameInput, lastName, 'Last Name Input');
        await this.actionHelper.type(this.emailInput, email, 'Email Input');
        await this.actionHelper.type(this.telephoneInput, telephone, 'Telephone Input');
        await this.actionHelper.type(this.passwordInput, password, 'Password Input');
        await this.actionHelper.type(this.confirmPasswordInput, password, 'Confirm Password Input');
    }

    /**
    * Fill the registration form with provided data
    */
    async fillRegistrationWithDifferentPassword(firstName: string, lastName: string, email: string, telephone: string, password: string, confirmPassword: string) {
        await this.actionHelper.type(this.firstNameInput, firstName, 'First Name Input');
        await this.actionHelper.type(this.lastNameInput, lastName, 'Last Name Input');
        await this.actionHelper.type(this.emailInput, email, 'Email Input');
        await this.actionHelper.type(this.telephoneInput, telephone, 'Telephone Input');
        await this.actionHelper.type(this.passwordInput, password, 'Password Input');
        await this.actionHelper.type(this.confirmPasswordInput, confirmPassword, 'Confirm Password Input');
    }

    /**
     * Submit the registration form by clicking the privacy policy checkbox and continue button
     */
    async submitRegistration() {
        await this.actionHelper.click(this.privacyPolicyCheckbox, 'Privacy Policy Checkbox');
        await this.actionHelper.click(this.continueButton, 'Continue Button');
    }

    /**
     * Click the privacy policy checkbox separately if needed
     */
    async clickPrivacyPolicyCheckbox() {
        await this.actionHelper.click(this.privacyPolicyCheckbox, 'Privacy Policy Checkbox');
    }

    /**
     * Click the continue button separately if needed
     */
    async clickContinueButton() {
        await this.actionHelper.click(this.continueButton, 'Continue Button');
    }

    /**
     * Verify that registration was successful
     * Waits for the success message to be visible and checks its text
     */
    async verifyRegistrationSuccess() {
        await this.actionHelper.waitForVisible(this.successMessage, 'Success Message');
        await this.actionHelper.verifyText(
            this.successMessage,
            'Your Account Has Been Created!',
            'Success Message'
        );
    }

    async verifyEmailAlreadyRegisteredError() {
        await this.actionHelper.waitForVisible(this.emailInvalidFormatWarning, 'Duplicate Email Warning');
        await this.actionHelper.verifyText(
            this.emailInvalidFormatWarning,
            'Warning: E-Mail Address is already registered!',
            'Duplicate Email Warning'
        );
    }

    async verifyInvalidEmailFormatError() {
        const validationMessage = await this.page.locator(this.emailInput).evaluate((el) => (el as HTMLInputElement).validationMessage);
        expect(validationMessage).toContain("invalid-email-format");
    }

    async verifyPasswordValidationMessage(expectedMessage: string) {
        await this.actionHelper.waitForVisible(this.fieldValidationMessage, 'Password Validation Message');
        await this.actionHelper.verifyText(
            this.fieldValidationMessage,
            expectedMessage,
            'Password Validation Message'
        );
    }

    async verifyFieldValidationMessage(expectedMessage: string) {
        await this.actionHelper.waitForVisible(this.fieldValidationMessage, 'Field Validation Message');
        await this.actionHelper.verifyText(
            this.fieldValidationMessage,
            expectedMessage,
            'Field Validation Message'
        );
    }

    async verifyFieldValidationMessages(expectedMessages: string[]) {
        // Wait until at least one validation message is visible
        await this.page.locator('.text-danger').first().waitFor({ state: 'visible', timeout: 5000 });

        const actualMessages = await this.page.locator('.text-danger').allTextContents();
        console.log('Actual validation messages:', actualMessages);
        expect(actualMessages).toEqual(expectedMessages);
    }


}
