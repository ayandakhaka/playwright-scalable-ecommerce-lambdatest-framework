import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ActionHelper } from '../utils/ActionHelper';
import { Database } from '../utils/Database';
import { registerAccountPage as RegisterAccountPage } from '../pages/RegisterAccountPage';
import { LoginPage } from '../pages/LoginPage';
import { LogoutPage } from '../pages/LogoutPage';

type MyFixtures = {
  homePage: HomePage;
  actionHelper: ActionHelper;
  registerAccountPage: RegisterAccountPage;
  loginPage: LoginPage;
  logoutPage: LogoutPage;
  data: typeof Database; // Pass class itself
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page, actionHelper }, use) => {
    await use(new HomePage(page, actionHelper));
  },
  actionHelper: async ({ page }, use) => {
    await use(new ActionHelper(page));
  },
  registerAccountPage: async ({ page, actionHelper }, use) => {
    await use(new RegisterAccountPage(page, actionHelper));
  },
  loginPage: async ({ page, actionHelper }, use) => {
    await use(new LoginPage(page, actionHelper));
  },
  logoutPage: async ({ page, actionHelper }, use) => {
    await use(new LogoutPage(page, actionHelper));
  },
  data: async ({}, use) => {
    await use(Database); // no need to instantiate static class
  },
});

export { expect } from '@playwright/test';
