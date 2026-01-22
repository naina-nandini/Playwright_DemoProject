import { Page } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { logger } from '@utils/Logger';

/**
 * Amazon Product Page Object
 * 
 * Represents the product details page
 */
export class AmazonProductPage extends BasePage {
    // Locators
    private readonly productTitle = '#productTitle';
    private readonly productPrice = '.a-price-whole';
    private readonly productRating = '#acrPopover';
    private readonly reviewCount = '#acrCustomerReviewText';
    private readonly addToCartButton = '#add-to-cart-button';
    private readonly buyNowButton = '#buy-now-button';
    private readonly quantityDropdown = '#quantity';
    private readonly productImage = '#landingImage';
    private readonly productDescription = '#feature-bullets';
    private readonly availabilityMessage = '#availability';
    private readonly productDetails = '#detailBullets_feature_div';
    private readonly addedToCartConfirmation = '#NATC_SMART_WAGON_CONF_MSG_SUCCESS';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Get product title
     * @returns Product title
     */
    async getProductTitle(): Promise<string> {
        const title = await this.getElementText(this.productTitle);
        logger.info(`Product title: ${title}`);
        return title;
    }

    /**
     * Get product price
     * @returns Product price
     */
    async getProductPrice(): Promise<string> {
        const price = await this.getElementText(this.productPrice);
        logger.info(`Product price: ${price}`);
        return price;
    }

    /**
     * Get product rating
     * @returns Product rating
     */
    async getProductRating(): Promise<string> {
        const rating = await this.page.locator(this.productRating).getAttribute('title') || '';
        logger.info(`Product rating: ${rating}`);
        return rating;
    }

    /**
     * Get review count
     * @returns Number of reviews
     */
    async getReviewCount(): Promise<string> {
        const count = await this.getElementText(this.reviewCount);
        logger.info(`Review count: ${count}`);
        return count;
    }

    /**
     * Add product to cart
     */
    async addToCart(): Promise<void> {
        await this.clickElement(this.addToCartButton);
        await this.waitForElement(this.addedToCartConfirmation, 5000);
        logger.info('Added product to cart');
    }

    /**
     * Select quantity
     * @param quantity - Quantity to select
     */
    async selectQuantity(quantity: number): Promise<void> {
        await this.selectDropdownOption(this.quantityDropdown, quantity.toString());
        logger.info(`Selected quantity: ${quantity}`);
    }

    /**
     * Check if product is available
     * @returns True if product is available
     */
    async isProductAvailable(): Promise<boolean> {
        const availabilityText = await this.getElementText(this.availabilityMessage);
        const isAvailable = availabilityText.toLowerCase().includes('in stock');
        logger.info(`Product available: ${isAvailable}`);
        return isAvailable;
    }

    /**
     * Get product description
     * @returns Product description text
     */
    async getProductDescription(): Promise<string> {
        const description = await this.getElementText(this.productDescription);
        logger.info('Retrieved product description');
        return description;
    }

    /**
     * Click on product image
     */
    async clickProductImage(): Promise<void> {
        await this.clickElement(this.productImage);
        logger.info('Clicked on product image');
    }

    /**
     * Verify product page is loaded
     * @returns True if page is loaded
     */
    async verifyPageLoaded(): Promise<boolean> {
        const isTitleVisible = await this.isElementVisible(this.productTitle);
        const isPriceVisible = await this.isElementVisible(this.productPrice);
        const isLoaded = isTitleVisible && isPriceVisible;
        logger.info(`Product page loaded: ${isLoaded}`);
        return isLoaded;
    }

    /**
     * Check if Add to Cart button is enabled
     * @returns True if button is enabled
     */
    async isAddToCartEnabled(): Promise<boolean> {
        const isEnabled = await this.page.locator(this.addToCartButton).isEnabled();
        logger.info(`Add to Cart enabled: ${isEnabled}`);
        return isEnabled;
    }

    /**
     * Verify product was added to cart
     * @returns True if confirmation message is displayed
     */
    async isAddedToCartConfirmationDisplayed(): Promise<boolean> {
        const isDisplayed = await this.isElementVisible(this.addedToCartConfirmation);
        logger.info(`Added to cart confirmation displayed: ${isDisplayed}`);
        return isDisplayed;
    }
}
