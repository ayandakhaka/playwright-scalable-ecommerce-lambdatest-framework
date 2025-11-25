import { test as base, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { ActionHelper } from '../utils/ActionHelper.js';
import { registerAccountPage as RegisterAccountPage } from '../pages/RegisterAccountPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { LogoutPage } from '../pages/LogoutPage.js';
import EditAccountPage from '../pages/EditAccountPage.js';
import ChangePassword from '../pages/ChangePasswordPage.js';
import ComponentsPage from '../pages/ComponentsPage.js'
import BlogPage from '../pages/BlogPage.js';
import AffiliatePage from '../pages/AffiliatePage .js';
import fs from "fs";
import path from "path";
import { generateFakeUser, saveRegisteredUser, getRegisteredUsers } from "../utils/FakeDataGenerator.js";

/**
 * Define custom fixtures for Playwright tests.
 * Fixtures allow us to provide page objects, helpers, and data to tests in a clean, reusable way.
 */
type MyFixtures = {
  homePage: HomePage;                // Page object for Home page actions
  actionHelper: ActionHelper;        // Utility for generic actions like click, type, hover
  registerAccountPage: RegisterAccountPage; // Page object for Register Account page
  loginPage: LoginPage;              // Page object for Login page
  logoutPage: LogoutPage;            // Page object for Logout page
  page: Page;                        // Playwright's Page object for browser interactions
  editAccountPage: EditAccountPage;  // Page object for Edit Account page
  changePasswordPage: ChangePassword; // Page object for Change password page
  componentsPage: ComponentsPage;     // Page object for ComponentsPage
  blogPage: BlogPage;                // Page object for Blog page
  affiliatePage: AffiliatePage;    // Page object for Affiliate page
};

/**
 * Extend Playwright's base test with custom fixtures.
 */
export const test = base.extend<MyFixtures>({
  /**
   * Fixture for HomePage object.
   * Instantiates HomePage with the current page and actionHelper.
   */
  homePage: async ({ page, actionHelper }, use) => {
    await use(new HomePage(page, actionHelper));
  },

  /**
   * Fixture for ActionHelper.
   * Provides generic action methods to all tests.  
   */
  actionHelper: async ({ page }, use) => {
    await use(new ActionHelper(page));
  },

  /**
   * Fixture for RegisterAccountPage object.
   * Instantiates page object for registration page.
   */
  registerAccountPage: async ({ page, actionHelper }, use) => {
    await use(new RegisterAccountPage(page, actionHelper));
  },

  /**
   * Fixture for LoginPage object.
   * Provides login page actions like login, verifyLoginSuccess, etc.
   */
  loginPage: async ({ page, actionHelper }, use) => {
    await use(new LoginPage(page, actionHelper));
  },

  /**
   * Fixture for LogoutPage object.
   * Provides logout page actions like clickLogoutLink, clickContinue, etc.
   */
  logoutPage: async ({ page, actionHelper }, use) => {
    await use(new LogoutPage(page, actionHelper));
  },

  /**
   * Fixture for EditAccountPage object.
   * Provides methods to interact with the Edit Account page.
   */
  editAccountPage: async ({ page, actionHelper }, use) => {
    await use(new EditAccountPage(page, actionHelper));
  },

  changePasswordPage: async ({page, actionHelper }, use) => {
    await use(new ChangePassword(page, actionHelper))
  },

  componentsPage: async ({page, actionHelper}, use) => {
    await use(new ComponentsPage(page, actionHelper))
  },

  blogPage: async ({ page, actionHelper }, use) => {
    await use(new BlogPage(page, actionHelper));
  },

  affiliatePage: async ({ page, actionHelper }, use) => {
    await use(new AffiliatePage(page, actionHelper));
  },
});

// Re-export Playwright's expect function for assertions in tests
export { expect } from '@playwright/test';
