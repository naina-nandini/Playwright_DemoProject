import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { logger } from '@utils/Logger';

/**
 * Amazon Home Page Object
 * 
 * Represents the Amazon.com homepage with all its elements and actions
 */
export class AmazonHomePage extends BasePage {
    // Locators
    private get searchBox(): Locator { return this.page.locator('#twotabsearchtextbox'); }
    private get searchButton(): Locator { return this.page.locator('#nav-search-submit-button'); }
    private get cartIcon(): Locator { return this.page.locator('#nav-cart'); }
    private get accountMenu(): Locator { return this.page.locator('#nav-link-accountList'); }
    private get deliveryLocation(): Locator { return this.page.locator('#glow-ingress-line1'); }
    private get categoryMenu(): Locator { return this.page.locator('#nav-hamburger-menu'); }
    private get todaysDeals(): Locator { return this.page.locator('a[href*="deals"]'); }

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to Amazon homepage
     */
    async goto(): Promise<void> {
        await this.navigate('/');
        await this.waitForPageLoad();
        logger.info('Navigated to Amazon homepage');
    }

    /**
     * Search for a product
     * @param searchTerm - Product to search for
     */
    async searchProduct(searchTerm: string): Promise<void> {
        await this.fill(this.searchBox, searchTerm);
        await this.click(this.searchButton);
        await this.waitForPageLoad();
        logger.info(`Searched for product: ${searchTerm}`);
    }

    /**
     * Click on cart icon
     */
    async goToCart(): Promise<void> {
        await this.click(this.cartIcon);
        await this.waitForPageLoad();
        logger.info('Navigated to cart');
    }

    /**
     * Hover over account menu
     */
    async hoverAccountMenu(): Promise<void> {
        await this.hover(this.accountMenu);
        logger.info('Hovered over account menu');
    }

    /**
     * Get cart count
     * @returns Cart item count
     */
    async getCartCount(): Promise<string> {
        const cartCount = await this.getText(this.page.locator('#nav-cart-count'));
        logger.info(`Cart count: ${cartCount}`);
        return cartCount;
    }

    /**
     * Click on category menu (hamburger menu)
     */
    async openCategoryMenu(): Promise<void> {
        await this.click(this.categoryMenu);
        await this.waitForElement(this.page.locator('.hmenu-visible'));
        logger.info('Opened category menu');
    }

    /**
     * Navigate to Today's Deals
     */
    async goToTodaysDeals(): Promise<void> {
        await this.click(this.todaysDeals);
        await this.waitForPageLoad();
        logger.info('Navigated to Today\'s Deals');
    }

    /**
     * Get delivery location text
     * @returns Delivery location
     */
    async getDeliveryLocation(): Promise<string> {
        const location = await this.getText(this.deliveryLocation);
        logger.info(`Delivery location: ${location}`);
        return location;
    }

    /**
     * Verify homepage is loaded
     */
    async verifyPageLoaded(): Promise<boolean> {
        const isSearchBoxVisible = await this.isVisible(this.searchBox);
        const isCartVisible = await this.isVisible(this.cartIcon);
        const isLogoVisible = await this.isVisible(this.page.locator('#nav-logo-sprites'));

        const isLoaded = isSearchBoxVisible && isCartVisible && isLogoVisible;
        logger.info(`Homepage loaded: ${isLoaded}`);
        return isLoaded;
    }

    /**
     * Search using enter key
     * @param searchTerm - Product to search for
     */
    async searchProductWithEnter(searchTerm: string): Promise<void> {
        await this.fill(this.searchBox, searchTerm);
        await this.page.keyboard.press('Enter');
        await this.waitForPageLoad();
        logger.info(`Searched for product using Enter: ${searchTerm}`);
    }
}
