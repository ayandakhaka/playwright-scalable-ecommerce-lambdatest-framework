import { Page, expect, Locator } from '@playwright/test';
import { ActionHelper } from '../utils/ActionHelper.js';

export default class ComponentsPage {
    private page: Page;
    private actionHelper: ActionHelper;
    private continueButton: Locator;

    constructor(page: Page, actionHelper: ActionHelper) {
        this.page = page;
        this.actionHelper = actionHelper;
        this.continueButton = this.page.getByRole("link", { name: "Continue" });
    }

    // ------------------------------
    // Locators
    // ------------------------------
    private palmTreoProImage =
        '#mz-product-grid-image-29-212408 .carousel-inner .carousel-item.active img[alt="Palm Treo Pro"]';

    private removeCartItemButton = "button[title='Remove']";   // FIXED
    private price = "//span[@class='price-new' and text()='$337.99']";
    private summaryLocator = 'span.mr-auto';
    private alertLocator = '.alert-success:has-text("Palm Treo Pro")';
    private productCardLocator = '.product-thumb';
    private addToCartLocator = 'button[title="Add to Cart"]';
    private cartSummaryLocator = '#notification-box-top span.mr-auto';
    private cartTotalLocator = '#cart-total';
    private removeButtonLocator = 'button[onclick*="cart.remove"]';
    private editCartLocator = 'a.btn-primary:has-text("Edit cart")';
    private totalItemsLocator = '.cart-icon .cart-item-total';
    private cartItemTotalLocator = '.cart-item-total';

    async emptyCartIfNeeded() {
        const cartCountText = await this.page.locator(this.cartItemTotalLocator).first().textContent();
        const cartCount = parseInt(cartCountText || "0");

        console.log("Current cart count:", cartCount);

        if (cartCount > 0) {
            // Open cart dropdown
            await this.page.locator(this.totalItemsLocator).first().click();

            const editCartLink = this.page.locator(this.editCartLocator);
            await editCartLink.waitFor({ state: 'visible', timeout: 8000 });
            await editCartLink.click();

            // LOOP: Remove all items
            const removeButtons = this.page.locator(this.removeButtonLocator);
            await removeButtons.click();

            await this.navigateToHomePage();

            console.log("Cart emptied successfully.");
        }
    }

    async getPalmTreoProPriceValue(): Promise<number> {
        // Get the price text from the page
        const priceText = await this.actionHelper.getText(this.price, "Getting price of item");

        // Remove $ and commas, then parse to number
        const cleanPrice = priceText.replace(/[$,]/g, '');
        const priceNumber = parseFloat(cleanPrice);

        console.log("Palm Treo Pro Price:", priceNumber);

        return priceNumber;
    }

    // ------------------------------------------------------
    // Navigation
    // ------------------------------------------------------
    async navigateToHomePage() {
        await this.page.getByRole("link", { name: "Continue" }).click();
    }

    // ------------------------------------------------------
    async hoverToPalmTreoProImage() {
        await this.actionHelper.hover(
            this.palmTreoProImage,
            "Hovering over Palm Treo Pro Image"
        );
    }

    // ------------------------------------------------------
    async verifyCartUpdated() {
        const cartButton = this.page.locator(this.cartTotalLocator);
        await expect(cartButton).toBeVisible({ timeout: 10000 });
    }

    async calculatedItemsInCart(): Promise<number> {
        const price = await this.getPalmTreoProPriceValue();
        return price * 2;
    }

    // ------------------------------------------------------

    async clickAddToCart(productName: string) {
        const productCard = this.page.locator(`.product-thumb:has-text("${productName}")`);
        const addToCartBtn = productCard.locator(this.addToCartLocator);
        const cartSummary = this.page.locator(this.cartSummaryLocator);

        // Wait for product card fully stable
        await productCard.waitFor({ state: "visible" });
        await productCard.waitFor({ state: "attached" });

        // Freeze movement (important for carousel pages)
        await this.page.waitForLoadState("networkidle");

        // Scroll to button
        await addToCartBtn.scrollIntoViewIfNeeded();

        // Stabilize layout shift
        await this.page.waitForTimeout(150);

        // Retry algorithm
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                // Attempt normal click
                await addToCartBtn.click({ trial: true });
                await addToCartBtn.click({ timeout: 4000 });

                // Validate the click succeeded → cart popup appears
                await expect(cartSummary).toBeVisible({ timeout: 4000 });
                return; // SUCCESS
            } catch (e) {
                console.log(`Attempt ${attempt} failed, retrying...`);

                // Fallback: force JS click
                const handle = await addToCartBtn.elementHandle();
                if (handle) {
                    await this.page.evaluate((btn: any) => btn.click(), handle);
                }

                // Validate success again
                try {
                    await expect(cartSummary).toBeVisible({ timeout: 4000 });
                    return;
                } catch {
                    // continue retrying
                }
            }
        }

        throw new Error(`Add to Cart for "${productName}" failed after 3 attempts.`);
    }

    async verifyAlertPopUpSuccessTextForTwoItems(expectedItems: number, expectedTotal: number) {
        const cartSummary = this.page.locator(this.cartSummaryLocator).nth(1);
        await expect(cartSummary).toBeVisible({ timeout: 10000 });

        const formattedTotal = `$${expectedTotal.toFixed(2)}`;
        const expectedText = `${expectedItems} item(s) - ${formattedTotal}`;
        await expect(cartSummary).toHaveText(expectedText);

    }

    async verifyCartSummary(expectedItems: number, expectedTotal: number) {
        const cartSummary = this.page.locator(this.cartSummaryLocator);
        await expect(cartSummary).toBeVisible({ timeout: 10000 });

        const formattedTotal = `$${expectedTotal.toFixed(2)}`;
        const expectedText = `${expectedItems} item(s) - ${formattedTotal}`;
        await expect(cartSummary).toHaveText(expectedText);
    }



    // ------------------------------------------------------
    async verifyCartSummaryContains(productName: string) {
        const summary = this.page.locator(this.summaryLocator);
        await expect(summary).toBeVisible({ timeout: 5000 });
        await expect(summary).toContainText("item(s)");
    }

    // ------------------------------------------------------
    async verifyAlertPopUpSuccessText() {
        const alert = this.page.locator(this.alertLocator);
        await expect(alert).toBeVisible({ timeout: 10000 });
        await expect(alert).toContainText(
            "Success: You have added Palm Treo Pro to your shopping cart!"
        );
    }

    // ------------------------------------------------------
    async scrollToViewPalmTreoPro() {
        const productCard = this.page.locator(this.productCardLocator, { hasText: 'Palm Treo Pro' });
        await productCard.waitFor({ state: 'visible', timeout: 10000 });
        await productCard.scrollIntoViewIfNeeded();
    }
}
