import { Page } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { logger } from '@utils/Logger';

/**
 * Amazon Cart Page Object
 * 
 * Represents the shopping cart page
 */
export class AmazonCartPage extends BasePage {
    // Locators
    private readonly cartItems = '[data-name="Active Items"] .sc-list-item';
    private readonly cartItemTitle = '.sc-product-title';
    private readonly cartItemPrice = '.sc-price';
    private readonly quantityDropdown = '[name="quantity"]';
    private readonly deleteButton = '[data-action="delete"]';
    private readonly subtotal = '#sc-subtotal-amount-activecart .sc-price';
    private readonly proceedToCheckoutButton = '[name="proceedToRetailCheckout"]';
    private readonly emptyCartMessage = '.sc-empty-cart-header';
    private readonly continueShoppingLink = 'a[href="/"]';
    private readonly cartCount = '#nav-cart-count';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to cart page
     */
    async goto(): Promise<void> {
        await this.navigateTo('/cart');
        await this.waitForPageLoad();
        logger.info('Navigated to cart page');
    }

    /**
     * Get number of items in cart
     * @returns Number of cart items
     */
    async getCartItemCount(): Promise<number> {
        const count = await this.page.locator(this.cartItems).count();
        logger.info(`Cart items count: ${count}`);
        return count;
    }

    /**
     * Get cart item titles
     * @returns Array of product titles in cart
     */
    async getCartItemTitles(): Promise<string[]> {
        const titles = await this.page.locator(this.cartItemTitle).allTextContents();
        logger.info(`Cart item titles: ${titles.join(', ')}`);
        return titles;
    }

    /**
     * Get subtotal amount
     * @returns Subtotal as string
     */
    async getSubtotal(): Promise<string> {
        const subtotal = await this.getElementText(this.subtotal);
        logger.info(`Cart subtotal: ${subtotal}`);
        return subtotal;
    }

    /**
     * Update quantity for a cart item
     * @param itemIndex - Index of the item (0-based)
     * @param quantity - New quantity
     */
    async updateQuantity(itemIndex: number, quantity: number): Promise<void> {
        const quantitySelectors = await this.page.locator(this.quantityDropdown).all();
        await quantitySelectors[itemIndex].selectOption(quantity.toString());
        await this.page.waitForTimeout(1000); // Wait for cart to update
        logger.info(`Updated item ${itemIndex} quantity to ${quantity}`);
    }

    /**
     * Delete item from cart
     * @param itemIndex - Index of the item to delete (0-based)
     */
    async deleteItem(itemIndex: number): Promise<void> {
        const deleteButtons = await this.page.locator(this.deleteButton).all();
        await deleteButtons[itemIndex].click();
        await this.page.waitForTimeout(1000); // Wait for cart to update
        logger.info(`Deleted item at index ${itemIndex}`);
    }

    /**
     * Check if cart is empty
     * @returns True if cart is empty
     */
    async isCartEmpty(): Promise<boolean> {
        const isEmpty = await this.isElementVisible(this.emptyCartMessage);
        logger.info(`Cart is empty: ${isEmpty}`);
        return isEmpty;
    }

    /**
     * Proceed to checkout
     */
    async proceedToCheckout(): Promise<void> {
        await this.clickElement(this.proceedToCheckoutButton);
        await this.waitForPageLoad();
        logger.info('Proceeded to checkout');
    }

    /**
     * Continue shopping
     */
    async continueShopping(): Promise<void> {
        await this.clickElement(this.continueShoppingLink);
        await this.waitForPageLoad();
        logger.info('Continued shopping');
    }

    /**
     * Get cart count from header
     * @returns Cart count
     */
    async getHeaderCartCount(): Promise<string> {
        const count = await this.getElementText(this.cartCount);
        logger.info(`Header cart count: ${count}`);
        return count;
    }

    /**
     * Verify cart page is loaded
     * @returns True if page is loaded
     */
    async verifyPageLoaded(): Promise<boolean> {
        // Cart can be empty or have items
        const hasItems = await this.isElementVisible(this.cartItems).catch(() => false);
        const isEmpty = await this.isElementVisible(this.emptyCartMessage).catch(() => false);
        const isLoaded = hasItems || isEmpty;
        logger.info(`Cart page loaded: ${isLoaded}`);
        return isLoaded;
    }

    /**
     * Get price of specific cart item
     * @param itemIndex - Index of the item
     * @returns Item price
     */
    async getItemPrice(itemIndex: number): Promise<string> {
        const prices = await this.page.locator(this.cartItemPrice).all();
        const price = await prices[itemIndex].textContent() || '';
        logger.info(`Item ${itemIndex} price: ${price}`);
        return price;
    }
}
