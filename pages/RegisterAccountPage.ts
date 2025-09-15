import { Page } from '@playwright/test';
import { ActionHelper } from '../utils/ActionHelper';
import { faker } from '@faker-js/faker';

export class registerAccountPage {
    private page: Page;
    private actionHelper: ActionHelper; 

    constructor(page: Page, actionHelper: ActionHelper) {
        this.page = page;
        this.actionHelper = actionHelper;
    }

    // Locators
    private myAccountMenu = "//a[@data-toggle='dropdown']//span[contains(.,'My account')]";
    private registerLink = 'a:has-text("Register")';

    private firstNameInput = '#input-firstname';
    private lastNameInput = '#input-lastname';
    private emailInput = '#input-email';
    private telephoneInput = '#input-telephone';
    private passwordInput = '#input-password';
    private confirmPasswordInput = '#input-confirm';
    private privacyPolicyCheckbox = 'input[name="agree"]';
    private continueButton = 'input[value="Continue"]';
    private successMessage = 'h1:has-text("Your Account Has Been Created!")';   
    private logoutLink = 'a:has-text("Logout")';

    async fillRegistrationForm(firstName: string, lastName: string, email: string, telephone: string, password: string) {
        await this.actionHelper.type(this.firstNameInput, firstName, 'First Name Input');
        await this.actionHelper.type(this.lastNameInput, lastName, 'Last Name Input');
        await this.actionHelper.type(this.emailInput, email, 'Email Input');
        await this.actionHelper.type(this.telephoneInput, telephone, 'Telephone Input');
        await this.actionHelper.type(this.passwordInput, password, 'Password Input');
        await this.actionHelper.type(this.confirmPasswordInput, password, 'Confirm Password Input');
    }

    async submitRegistration() {
        await this.actionHelper.click(this.privacyPolicyCheckbox, 'Privacy Policy Checkbox');
        await this.actionHelper.click(this.continueButton, 'Continue Button');
    }

    async verifyRegistrationSuccess() {
        await this.actionHelper.waitForVisible(this.successMessage, 'Success Message');
        await this.actionHelper.verifyText(this.successMessage, 'Your Account Has Been Created!', 'Success Message');
    }

    async hoverMyAccountMenu() {
        await this.actionHelper.hover(this.myAccountMenu, 'My Account Menu');
    }

    async clickRegisterLink() {
        await this.actionHelper.click(this.registerLink, 'Register Link');
    }
}
