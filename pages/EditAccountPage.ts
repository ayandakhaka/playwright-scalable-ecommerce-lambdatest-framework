import { Page, expect } from '@playwright/test';
import { ActionHelper } from '../utils/ActionHelper';

/**
 * Page Object Model for the Forgot Password page
 * Handles all interactions related to password recovery
 * Includes methods to fill the form, submit, and verify messages
 */
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

    // ------------------------------
    // Methods
    // ------------------------------   
    /**
     * Fill the Forgot Password form with provided details
     * @param firstName - User's first name 
     * @param lastName - User's last name
     * @param email - User's email address
     * @param telephone - User's telephone number
     */
    async fillMyAccountDetails(firstName: string, lastName: string, email: string, telephone: string) {
        await this.page.waitForSelector(this.firstNameInput, { state: 'visible' });
        await this.actionHelper.type(this.firstNameInput, firstName, 'First Name Input');
        await this.actionHelper.type(this.lastNameInput, lastName, 'Last Name Input');
        await this.actionHelper.type(this.emailInput, email, 'Email Input');
        await this.actionHelper.type(this.telephoneInput, telephone, 'Telephone Input');
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
 
    async verifyUpdateSuccessMessage(expectedMessage: string) {
        await this.actionHelper.waitForVisible(this.successMessage, 'Success Message'); 
        await this.actionHelper.verifyText(this.successMessage, expectedMessage, 'Success Message');
    }
}