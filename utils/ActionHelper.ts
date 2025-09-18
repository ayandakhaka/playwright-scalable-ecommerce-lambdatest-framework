import { Page, Locator, expect } from "@playwright/test";

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
     * Navigate to a specific URL.
     * @param url The target URL to navigate to.
     */
    async navigateTo(url: string) {
        const fullUrl = url.startsWith("http") ? url : `${process.env.BASE_URL}${url}`;
        this.log(`Navigating to URL: ${fullUrl}`);
        await this.page.goto(fullUrl, { timeout: 60000, waitUntil: 'networkidle' });    
        //this.log(`Navigating to URL: ${url}`);
        //await this.page.goto(url, { timeout: 60000, waitUntil: 'networkidle' });
    }   

    /**
     * Clicks on a given locator.
     * @param locator Can be a string CSS/XPath selector or a Playwright Locator object.
     * @param description Optional description for logging purposes.
     */
    async click(locator: Locator | string, description?: string) {
        this.log(`Clicking on ${description || locator}`);
        if (typeof locator === 'string') {
            await this.page.locator(locator).click();
        } else {
            await locator.click();
        }
    }

    /**
     * Clicks on an element only after waiting for it to become visible.
     * Useful for elements that may take time to appear.
     */
    async clickForVisibility(locator: string | Locator, description?: string) {
        this.log(`Clicking on ${description || locator}`);
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await element.waitFor({ state: 'visible' }); // wait until element is visible
        await element.click();
    }

    /**
     * Fills text into an input field.
     * @param locator Can be a string selector or Locator object.
     * @param text Text to type into the input.
     * @param description Optional description for logging.
     */
    async type(locator: Locator | string, text: string, description?: string) {
        this.log(`Typing "${text}" into ${description || locator}`);
        if (typeof locator === 'string') {
            await this.page.locator(locator).fill(text);
        } else {
            await locator.fill(text);
        }
    }

    /**
     * Retrieves the inner text of an element.
     * @param locator Can be a string selector or Locator object.
     * @param description Optional description for logging.
     * @returns The inner text of the element.
     */
    async getText(locator: Locator | string, description?: string): Promise<string> {
        this.log(`Getting text from ${description || locator}`);
        if (typeof locator === 'string') {
            return await this.page.locator(locator).innerText();
        } else {
            return await locator.innerText();
        }
    }

    /**
     * Verifies that an element contains the expected text.
     * Supports both regular locators and role-based locators.
     * @param locator CSS selector string, Locator object, or 'role=role:name' string.
     * @param expected Expected text content.
     * @param description Optional description for logging.
     */
    async verifyText(locator: Locator | string, expected: string, description?: string) {
        this.log(`Verifying text of ${description || locator} is "${expected}"`);

        if (typeof locator === 'string') {
            // Role-based locator syntax: "role=role:name"
            if (locator.startsWith('role=')) {
                const [role, name] = locator.replace('role=', '').split(':');
                await expect(
                    this.page.getByRole(role as any, { name: name.trim() })
                ).toHaveText(expected);
            } else {
                // Regular string locator
                await expect(this.page.locator(locator)).toHaveText(expected);
            }
        } else {
            // Locator object passed directly
            await expect(locator).toHaveText(expected);
        }
    }

    /**
     * Waits for an element to become visible.
     * @param locator CSS selector or Locator object.
     * @param description Optional description for logging.
     */
    // async waitForVisible(locator: Locator | string, description?: string) {
    //     this.log(`Waiting for visibility of ${description || locator}`);
    //     if (typeof locator === 'string') {
    //         await this.page.locator(locator).waitFor({ state: 'visible' });
    //     } else {
    //         await locator.waitFor({ state: 'visible' });
    //     }
    // }

    /**
     * Waits for an element to be visible with retries and optional timeout
     * @param locator - CSS selector string or Playwright Locator
     * @param description - optional description for logging
     * @param timeout - max time in ms to wait (default 30s)
     */
    async waitForVisible(
        locator: string | Locator,
        description?: string,
        timeout: number = 30000
    ) {
        this.log(`Waiting for visibility of ${description || locator}`);

        let element: Locator;

        if (typeof locator === 'string') {
            element = this.page.locator(locator);
        } else {
            element = locator;
        }

        try {
            // Wait for the element to be attached to DOM first
            await element.waitFor({ state: 'attached', timeout: timeout / 2 });

            // Wait until visible
            await element.waitFor({ state: 'visible', timeout: timeout / 2 });
        } catch (err) {
            // Optional: Highlight element if exists for debugging
            const isAttached = await element.evaluate(el => !!el).catch(() => false);
            if (isAttached) {
                await element.evaluate(el => (el.style.border = '2px solid red'));
            }

            throw new Error(
                `Timeout waiting for element to be visible: ${description || locator}`
            );
        }
    }

    /**
     * Hovers over an element, waiting for it to be visible first.
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
