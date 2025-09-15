import { test as base } from '@playwright/test';
import { ActionHelper } from '../utils/ActionHelper';
import { registerAccountPage as RegisterAccountPage } from '../pages/RegisterAccountPage'; // ✅ Import the class

type MyFixtures = {
  actionHelper: ActionHelper;
  registerAccountPage: RegisterAccountPage; // ✅ Use class type
};

export const test = base.extend<MyFixtures>({
  actionHelper: async ({ page }, use) => {
    const actionHelper = new ActionHelper(page);
    await use(actionHelper);
  },
  registerAccountPage: async ({ page, actionHelper }, use) => {
    const pageInstance = new RegisterAccountPage(page, actionHelper); // ✅ Variable can be named differently
    await use(pageInstance);
  },
});

export { expect } from '@playwright/test';
