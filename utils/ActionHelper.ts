import { Page, Locator, expect } from "@playwright/test";

export class ActionHelper {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private log(message: string) {
        console.log(`[ActionHelper] ${message}`);
    }   

    async navigateTo(url: string) {
        this.log(`Navigating to URL: ${url}`);
        await this.page.goto(url);
    }   

    async click(locator: Locator | string, description?: string) {
        this.log(`Clicking on ${description || locator}`);
        if (typeof locator === 'string') {
            await this.page.locator(locator).click();
        } else {
            await locator.click();
        }
    }

    async type(locator: Locator | string, text: string, description?: string) {
        this.log(`Typing "${text}" into ${description || locator}`);
        if (typeof locator === 'string') {
            await this.page.locator(locator).fill(text);
        } else {
            await locator.fill(text);
        }
    }

    async getText(locator: Locator | string, description?: string): Promise<string> {
        this.log(`Getting text from ${description || locator}`);
        if (typeof locator === 'string') {
            return await this.page.locator(locator).innerText();
        } else {
            return await locator.innerText();
        }
    }

    async verifyText(locator: Locator | string, expected: string, description?: string) {
        this.log(`Verifying text of ${description || locator} is "${expected}"`);
        if (typeof locator === 'string') {
            await expect(this.page.locator(locator)).toHaveText(expected);
        } else {
            await expect(locator).toHaveText(expected);
        }
    }

    async waitForVisible(locator: Locator | string, description?: string) {
        this.log(`Waiting for visibility of ${description || locator}`);
        if (typeof locator === 'string') {
            await this.page.locator(locator).waitFor({ state: 'visible' });
        } else {
            await locator.waitFor({ state: 'visible' });
        }
    }

    async hover(locator: Locator | string, description?: string, timeout = 5000) {
        this.log(`Hovering over ${description || locator}`);
        if (typeof locator === 'string') {
            const element = this.page.locator(locator);
            await element.waitFor({ state: 'visible', timeout });
            await element.first().hover();
        } else {
            await locator.waitFor({ state: 'visible', timeout });
            await locator.first().hover();
        }
    }
}
