import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ActionHelper } from '../utils/ActionHelper';
import { Database } from '../utils/Database';
import { registerAccountPage as RegisterAccountPage } from '../pages/RegisterAccountPage';
import { LoginPage } from '../pages/LoginPage';
import { LogoutPage } from '../pages/LogoutPage';

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
  data: typeof Database;             // Reference to database helper class for test data
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
   * Fixture for Database helper.
   * Provides access to database-related methods and test data.
   * No need to instantiate because Database is static.
   */
  data: async ({}, use) => {
    await use(Database);
  },
});

// Re-export Playwright's expect function for assertions in tests
export { expect } from '@playwright/test';
