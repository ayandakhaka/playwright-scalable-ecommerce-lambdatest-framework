import { Page, expect } from '@playwright/test';
import { ActionHelper } from '../utils/ActionHelper.js';


export default class EditAccountPage {
    private page: Page;                 // Playwright page object for browser interactions
    private actionHelper: ActionHelper; // Helper for common actions like click, type, wait, verify 
    constructor(page: Page, actionHelper: ActionHelper) {
        this.page = page;
        this.actionHelper = actionHelper;
    }

    // ------------------------------
    // Locators
    // ------------------------------
    private firstNameInput = 'input[name="firstname"]';               // First Name input field
    private lastNameInput = 'input[name="lastname"]';                 // Last Name input field
    private emailInput = 'input[name="email"]';                       // Email input field
    private telephoneInput = 'input[name="telephone"]';                 // Telephone input field
    private continueButton = 'input[type="submit"][value="Continue"]';               // Continue button
    private backButton = 'a:has-text("Back")';                        // Back button
    private successMessage = '.alert.alert-success.alert-dismissible'; // Success message after form submission
    private warningMessage = '.alert.alert-danger.alert-dismissible';  // Warning message for errors  
    private editAccountLink = 'a:has-text("Edit your account information")'; // Edit Account Information link  
    private editMessageError = 'div.alert.alert-danger.alert-dismissible'; // Error message for edit account failures
    private fieldValidationMessage = '.text-danger';

    // ------------------------------
    // Methods
    // ------------------------------   
    /**
     * @param firstName - User's first name 
     * @param lastName - User's last name
     * @param email - User's email address
     * @param telephone - User's telephone number
     */
    async fillMyAccountDetails(
        firstName: string, lastName: string, email: string, telephone: string) {
        this.page.setDefaultTimeout(60000); // set default timeout for page actions

        // ✅ Use your action helper to fill fields (it already waits internally)
        await this.actionHelper.type(this.firstNameInput, firstName, 'First Name Input');
        await this.actionHelper.type(this.lastNameInput, lastName, 'Last Name Input');
        await this.actionHelper.type(this.emailInput, email, 'Email Input');
        await this.actionHelper.type(this.telephoneInput, telephone, 'Telephone Input');

        // ✅ Optionally verify that fields are correctly populated (optional validation step)
        await this.page.waitForTimeout(500); // small stability pause
        await this.actionHelper.verifyText(
            this.firstNameInput, firstName, 'First Name Verification');
    }

    /**
     * Click the Continue button to submit the form
     */
    async clickContinueButton() {
        await this.actionHelper.click(this.continueButton, 'Continue Button');
    }

    async clickEditAccountLink() {
        await this.actionHelper.click(this.editAccountLink, 'Edit Account Link');
    }
    /**
     * Click the Back button to return to the previous page
     */
    async clickBackButton() {
        await this.actionHelper.click(this.backButton, 'Back Button');
    }
    /*
     Verify the success message after form submission
    */
    async verifyUpdateSuccessMessage(expectedMessage: string) {
        await this.actionHelper.waitForVisible(
            this.successMessage, 'Success Message');
        await this.actionHelper.verifyText(
            this.successMessage, expectedMessage, 'Success Message');
    }

    async verifyFirstNameFieldErrorMessage() {
        await this.actionHelper.waitForVisible(
            this.fieldValidationMessage, "First Name field error message");
        await this.actionHelper.verifyText(
            this.fieldValidationMessage, "First Name must be between 1 and 32 characters!");
    }

    /*
     Verify the warning message for errors
    */
    async verifyUpdateWarningMessage(expectedMessage: string) {
        await this.actionHelper.waitForVisible(
            this.editMessageError, 'Account Update Warning');
        await this.actionHelper.verifyText(
            this.editMessageError, expectedMessage, 'Account Update Warning');
    }
}