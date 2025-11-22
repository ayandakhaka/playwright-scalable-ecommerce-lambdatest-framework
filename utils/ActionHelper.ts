import { Page, Locator, expect } from "@playwright/test";
import { ConfigManager } from "./ConfigManager.js";

/**
 * ActionHelper is a utility class that wraps common Playwright actions
 * like click, type, hover, wait, and assertions with logging and optional descriptions.
 */
export class ActionHelper {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Internal logging method for better test debugging.
     */
    private log(message: string) {
        console.log(`[ActionHelper] ${message}`);
    }

    /**
    * Navigate to a relative URL (baseURL is handled automatically)
    * Example: /index.php?route=common/home
    */
    async navigateToFullUrl(url: string, waitForSelector?: string) {
        const baseURL = "https://ecommerce-playground.lambdatest.io";
        const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`;

        console.log(`Navigating to URL: ${fullUrl}`);

        // Navigate with network idle
        await this.page.goto(fullUrl, { timeout: 60000, waitUntil: "networkidle" });

        // Optionally wait for a specific element to ensure page is interactive
        if (waitForSelector) {
            console.log(`Waiting for selector: ${waitForSelector}`);
            const element = this.page.locator(waitForSelector);
            await element.waitFor({ state: "visible", timeout: 30000 });
        } else {
            // Fallback: wait for body to be visible
            await this.page.locator("body").waitFor({ state: "visible", timeout: 30000 });
        }

        // Optional: add a short delay to allow animations or scripts to finish
        await this.page.waitForTimeout(500);
    }

    /**
 * Scrolls an element into view and optionally clicks it
 * @param {string|Locator} locator - CSS or XPath selector or Locator
 * @param {boolean} click - whether to click the element after scrolling
 * @param {string} description - optional description for logging
 */
    async scrollToElement(locator: string | Locator, click = false, description?: string) {
        this.log(`Clicking on ${description || locator}`);

        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;

        // Ensure the element exists
        await expect(element).toHaveCount(1);

        // Scroll element into view
        await element.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));

        // Optionally click after scrolling
        if (click) {
            await element.click();
        }
    }

    async click(locator: string | Locator, description?: string) {
        this.log(`Clicking on ${description || locator}`);
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await element.waitFor({ state: 'visible', timeout: 10000 }); // wait until visible
        await element.click();
    }


    /**
     * Clicks on an element only after waiting for it to become visible.
     */
    async clickForVisibility(locator: string | Locator, description?: string) {
        this.log(`Clicking on ${description || locator}`);
        const element = typeof locator === "string" ? this.page.locator(locator) : locator;
        await element.waitFor({ state: "visible" });
        await element.click();
    }

    /**
 * Fills text into an input field safely (waits for attached, visible, enabled).
 */
    async type(locator: string | Locator, text: string, description?: string) {
        const element = typeof locator === "string" ? this.page.locator(locator) : locator;

        this.log(`Typing "${text}" into ${description || locator}`);

        // ✅ Ensure the element is attached, visible, and editable
        await element.waitFor({ state: "attached", timeout: 15000 });
        await element.waitFor({ state: "visible", timeout: 15000 });
        await expect(element).toBeEnabled({ timeout: 10000 });

        // ✅ Retry mechanism for flaky inputs
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                await element.fill(text, { timeout: 10000 });
                this.log(`Successfully typed "${text}" into ${description || locator}`);
                return;
            } catch (error) {
                if (attempt === 2) throw error;
                this.log(`Retrying typing into ${description || locator} (attempt ${attempt})...`);
                await this.page.waitForTimeout(500);
            }
        }
    }

    /**
     * Retrieves the inner text of an element.
     */
    async getText(locator: Locator | string, description?: string): Promise<string> {
        this.log(`Getting text from ${description || locator}`);
        return typeof locator === "string"
            ? await this.page.locator(locator).innerText()
            : await locator.innerText();
    }


    /**
  * Verifies element text or input value safely (handles dynamic DOM updates).
  */
    async verifyText(locator: Locator | string, expected: string, description?: string) {
        this.log(`Verifying text of ${description || locator} is "${expected}"`);

        const element = typeof locator === "string"
            ? this.page.locator(locator)
            : locator;

        // ✅ Wait until element exists and is stable
        await element.waitFor({ state: "attached", timeout: 20000 });
        await element.waitFor({ state: "visible", timeout: 20000 });

        // ✅ Avoid DetachedNode errors by wrapping evaluate() safely
        let tagName: string;
        try {
            tagName = await element.evaluate(el => el.tagName.toLowerCase());
        } catch (error) {
            this.log(`Element re-rendered, re-acquiring locator for ${description || locator}`);
            await element.waitFor({ state: "attached", timeout: 5000 });
            tagName = await element.evaluate(el => el.tagName.toLowerCase());
        }

        if (tagName === "input" || tagName === "textarea") {
            await expect(element).toHaveValue(expected, { timeout: 10000 });
        } else {
            await expect(element).toHaveText(expected, { timeout: 10000 });
        }

        this.log(`✅ Verified "${description || locator}" text/value successfully.`);
    }


    /**
     * Waits for an element to be visible with optional timeout.
     */
    async waitForVisible(locator: string | Locator, description?: string, timeout = 30000) {
        this.log(`Waiting for visibility of ${description || locator}`);
        const element = typeof locator === "string" ? this.page.locator(locator) : locator;

        try {
            await element.waitFor({ state: "attached", timeout: timeout / 2 });
            await element.waitFor({ state: "visible", timeout: timeout / 2 });
        } catch {
            const isAttached = await element.evaluate(el => !!el).catch(() => false);
            if (isAttached) await element.evaluate(el => (el.style.border = "2px solid red"));
            throw new Error(`Timeout waiting for element to be visible: ${description || locator}`);
        }
    }

    /**
     * Hovers over an element, waiting for it to be visible first.
     * 
     * Useful for menus or dropdowns that appear on hover.
     * @param locator CSS selector or Locator object.
     * @param description Optional description for logging.
     * @param timeout Maximum wait time for visibility (default 5000ms)
     */
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
