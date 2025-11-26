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
    private companyNameInput = '#input-company';
    private websiteInput = '#input-website';
    private taxIdInput = '#input-tax';
    private paymentMethodSelect = '#input-payment-method';
    private chequeRadioButton = 'input[type="radio"][name="payment"][value="cheque"]';
    private paypalRadioButton = 'input[type="radio"][name="payment"][value="paypal"]';
    private bankTransferRadioButton = 'input[type="radio"][name="payment"][value="bank"]'
    //private agreeCheckbox = 'input[name="agree"]';
    private checkPayeeNameInput = '#input-cheque';
    private paypalPayeeNameInput = '#input-paypal';
    private bankNameInput = '#input-bank-name';
    private bankBranchNumberInput = '#input-bank-branch-number';
    private bankSwiftCodeInput = '#input-bank-swift-code';
    private bankAccountNameInput = '#input-bank-account-name';
    private bankAccountNumberInput = '#input-bank-account-number';
    private agreeTermsCheckbox = 'input[type="checkbox"][name="agree"]';
    private continueButton = 'input[value="Continue"]';
    private affiliateRegistration = 'text=Register for an affiliate account';
    private affiliateSuccessMessage = 'div.alert-success';
    private fieldValidationError = '.text-danger';
    private agreeTermsErrorMessage = 'div.alert.alert-danger.alert-dismissible';

    // ------------------------------
    // Methods
    // ------------------------------
    async selectPaymentMethod(paymentMethod: string,
        checkPayeeName?: string,
        payPalEmailAccount?: string,
        bankBranchNumber?: string,
        bankName?: string,
        swiftCode?: string,
        accountName?: string,
        accountNumber?: string) {
        switch (paymentMethod) {
            case "cheque":
                await this.actionHelper.click(this.chequeRadioButton,
                    "Selecting Cheque Payment Method");
                await this.actionHelper.type(this.checkPayeeNameInput, checkPayeeName,
                    "Cheque Payee Name Input Field");
                break;
            case "paypal":
                await this.actionHelper.click(this.paypalRadioButton,
                    "Selecting PayPal Payment Method");
                await this.actionHelper.type(this.paypalPayeeNameInput, payPalEmailAccount,
                    "PayPal Payee Name Input Field");
                break;
            case "bank":
                await this.actionHelper.click(this.bankTransferRadioButton,
                    "Selecting Bank Transfer Payment Method");
                await this.actionHelper.type(this.bankNameInput, bankName,
                    "Bank Name Input Field");
                await this.actionHelper.type(this.bankBranchNumberInput, bankBranchNumber,
                    "Bank Branch Number Input Field");
                await this.actionHelper.type(this.bankSwiftCodeInput, swiftCode,
                    "Bank SWIFT Code Input Field");
                await this.actionHelper.type(this.bankAccountNameInput, accountName,
                    "Bank Account Name Input Field");
                await this.actionHelper.type(this.bankAccountNumberInput, accountNumber,
                    "Bank Account Number Input Field");
                break;
            default:
                throw new Error(`Unsupported payment method: ${paymentMethod}`);
        }
    }

    async verifyAccountNameError(expectedMessage: string) {
        await this.actionHelper.verifyText(
            this.fieldValidationError,
            expectedMessage,
            "Account Name Error Message"
        );
    }

    async verifyCheckPayeeNameError(expectedMessage: string) {
        await this.actionHelper.verifyText(
            this.fieldValidationError,
            expectedMessage,
            "Cheque Payee Name Error Message"
        );
    }

    async verifyAccountNumberError(expectedMessage: string) {
        await this.actionHelper.verifyText(
            this.fieldValidationError,
            expectedMessage,
            "Account Number Error Message"
        );
    }

    async verifyAgreeTermsErrorMessage(expectedMessage: string) {
        await this.actionHelper.verifyText(
            this.agreeTermsErrorMessage,
            expectedMessage,
            "Agree to Terms Error Message"
        );
    }

    async enterCompanyName(company: string) {
        await this.actionHelper.type(this.companyNameInput, company, "Company Name Input Field");
    }

    async enterWebsite(website: string) {
        await this.actionHelper.type(this.websiteInput, website, "Website Input Field");
    }

    async enterTaxId(taxId: string) {
        await this.actionHelper.type(this.taxIdInput, taxId, "Tax ID Input Field");
    }

    async enterPaymentDetails(
        paymentMethod: string,
        checkPayeeName?: string,
        payPalEmailAccount?: string,
        bankBranchNumber?: string,
        bankName?: string) {
        switch (paymentMethod) {
            case "cheque":
                await this.actionHelper.type(this.checkPayeeNameInput,
                    checkPayeeName, "Cheque Payee Name Input Field");
                break;
            case "paypal":
                await this.actionHelper.type(this.paypalPayeeNameInput,
                    payPalEmailAccount, "PayPal Payee Name Input Field");
                break;
            case "bank":
                await this.actionHelper.type(this.bankNameInput, bankName,
                    "Bank Name Input Field");
                await this.actionHelper.type(this.bankBranchNumberInput,
                    bankBranchNumber, "Bank Branch Number Input Field");
                break;
            default:
                throw new Error(`Unsupported payee name type: ${paymentMethod}`);
        }
    }

    async clickContinueButton() {
        await this.actionHelper.click(this.continueButton, "Continue Button");
    }

    async agreeToTerms() {
        await this.actionHelper.click(this.agreeTermsCheckbox, "Agree to Terms Checkbox");
    }

    // Scroll the affiliate registration link into view before interacting with it
    async scrollToAffiliateRegistrationLink() {
        await this.page.locator(this.affiliateRegistration).scrollIntoViewIfNeeded();
    }

    async navigateToAffiliateRegistration() {
        await this.scrollToAffiliateRegistrationLink();
        await this.actionHelper.click(this.affiliateRegistration, "Navigate to Affiliate Registration Page");
    }

    async clickContinueButtonForAffiliate() {
        await this.page.getByRole('button', { name: 'Continue' }).click();
    }

    async verifyAffiliateSuccessMessage(expectedMessage: string) {
        const successMessageLocator = this.page.locator(this.affiliateSuccessMessage);
        await this.actionHelper.verifyText(successMessageLocator, expectedMessage, "Affiliate Success Message");
    }


}