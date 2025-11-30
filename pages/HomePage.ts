import { Page } from '@playwright/test';
import { ActionHelper } from '../utils/ActionHelper.js';

/**
 * Page Object Model for the Home Page
 * Handles interactions with elements like My Account menu, Register, and Login links
 */
export class HomePage {
    private page: Page;                 // Playwright page object
    private actionHelper: ActionHelper; // Helper for common actions (click, type, hover, etc.)

    constructor(page: Page, actionHelper: ActionHelper) {
        this.page = page;
        this.actionHelper = actionHelper;
    }

    // ------------------------------
    // Locators
    // ------------------------------
    private myAccountMenu = "//a[@data-toggle='dropdown']//span[contains(.,'My account')]"; // "My Account" dropdown menu
    private registerLink = 'a:has-text("Register")';                                        // Register link under My Account menu
    private loginLink = 'a:has-text("Login")';                                              // Login link under My Account menu
    private megaMenuLink = 'span.title:has-text("Mega Menu")'
    private headphonesLinkLocator = 'a[title="Headphones"]';
    private megaMenuLocator = '.title';
    // ------------------------------
    // Methods
    // ------------------------------

    /**
     * Hover over "My Account" menu to reveal dropdown options
     */
    async hoverMyAccountMenu() {
        await this.actionHelper.hover(this.myAccountMenu, 'My Account Menu');
    }

    async clickHeadphonesCategory() {
        const headphonesLink = this.page.locator(this.headphonesLinkLocator);
        await headphonesLink.waitFor({ state: 'visible', timeout: 5000 });
        await headphonesLink.click();
    }


    async hoverMegaMenu() {
        const megaMenu = this.page.locator(this.megaMenuLocator, { hasText: 'Mega Menu' });
        await megaMenu.hover();

    }

    /**
     * Click the "Register" link in the My Account dropdown
     */
    async clickRegisterLink() {
        await this.actionHelper.click(this.registerLink, 'Register Link');
    }

    async clickLoginLinkAfterRegister() {
        const loginLocator = this.page.getByRole('link', { name: 'Login', exact: true }).first();
        await loginLocator.waitFor({ state: 'visible' });
        await loginLocator.click();
    }


    /**
     * Click the "Login" link in the My Account dropdown
     * Uses clickForVisibility to ensure the element is visible before clicking
     */
    async clickLoginLink() {
        await this.actionHelper.clickForVisibility(this.loginLink, 'Login Link');
    }
}
