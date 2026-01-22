import { Page } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { logger } from '@utils/Logger';

/**
 * Amazon Search Results Page Object
 * 
 * Represents the search results page with filters, sorting, and product listings
 */
export class AmazonSearchResultsPage extends BasePage {
    // Locators
    private readonly searchResultsContainer = '[data-component-type="s-search-result"]';
    private readonly productTitle = 'h2 a span';
    private readonly productPrice = '.a-price-whole';
    private readonly productRating = '.a-icon-star-small';
    private readonly sortDropdown = '#s-result-sort-select';
    private readonly filterSidebar = '#s-refinements';
    private readonly primeFilter = 'input[name="s-prime"]';
    private readonly brandFilters = '[data-csa-c-content-id="filter-brand"]';
    private readonly priceFilters = '[data-csa-c-content-id="filter-price"]';
    private readonly resultsCount = '.s-result-count';
    private readonly nextPageButton = '.s-pagination-next';
    private readonly previousPageButton = '.s-pagination-previous';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Get all product titles on the page
     * @returns Array of product titles
     */
    async getProductTitles(): Promise<string[]> {
        await this.waitForElement(this.searchResultsContainer);
        const titles = await this.page.locator(this.productTitle).allTextContents();
        logger.info(`Found ${titles.length} product titles`);
        return titles;
    }

    /**
     * Click on a product by index
     * @param index - Product index (0-based)
     */
    async clickProduct(index: number): Promise<void> {
        const products = this.page.locator(this.searchResultsContainer);
        await products.nth(index).locator(this.productTitle).click();
        await this.waitForPageLoad();
        logger.info(`Clicked on product at index ${index}`);
    }

    /**
     * Click on a product by title
     * @param title - Product title to click
     */
    async clickProductByTitle(title: string): Promise<void> {
        await this.page.locator(this.productTitle, { hasText: title }).first().click();
        await this.waitForPageLoad();
        logger.info(`Clicked on product: ${title}`);
    }

    /**
     * Sort results
     * @param sortOption - Sort option text (e.g., "Price: Low to High")
     */
    async sortBy(sortOption: string): Promise<void> {
        await this.selectDropdownOption(this.sortDropdown, sortOption);
        await this.waitForPageLoad();
        logger.info(`Sorted by: ${sortOption}`);
    }

    /**
     * Apply Prime filter
     */
    async filterByPrime(): Promise<void> {
        await this.clickElement(this.primeFilter);
        await this.waitForPageLoad();
        logger.info('Applied Prime filter');
    }

    /**
     * Apply brand filter
     * @param brandName - Brand name to filter by
     */
    async filterByBrand(brandName: string): Promise<void> {
        await this.page.locator(`${this.brandFilters} span`, { hasText: brandName }).first().click();
        await this.waitForPageLoad();
        logger.info(`Applied brand filter: ${brandName}`);
    }

    /**
     * Get results count text
     * @returns Results count text
     */
    async getResultsCount(): Promise<string> {
        const count = await this.getElementText(this.resultsCount);
        logger.info(`Results count: ${count}`);
        return count;
    }

    /**
     * Get number of products displayed on current page
     * @returns Number of products
     */
    async getProductCount(): Promise<number> {
        const count = await this.page.locator(this.searchResultsContainer).count();
        logger.info(`Products on page: ${count}`);
        return count;
    }

    /**
     * Get product price by index
     * @param index - Product index
     * @returns Product price
     */
    async getProductPrice(index: number): Promise<string> {
        const price = await this.page.locator(this.searchResultsContainer)
            .nth(index)
            .locator(this.productPrice)
            .first()
            .textContent();
        logger.info(`Product ${index} price: ${price}`);
        return price || '';
    }

    /**
     * Check if product has Prime badge
     * @param index - Product index
     * @returns True if product has Prime
     */
    async hasProductPrimeBadge(index: number): Promise<boolean> {
        const hasPrime = await this.page.locator(this.searchResultsContainer)
            .nth(index)
            .locator('[aria-label*="Prime"]')
            .isVisible()
            .catch(() => false);
        logger.info(`Product ${index} has Prime: ${hasPrime}`);
        return hasPrime;
    }

    /**
     * Navigate to next page of results
     */
    async goToNextPage(): Promise<void> {
        await this.clickElement(this.nextPageButton);
        await this.waitForPageLoad();
        logger.info('Navigated to next page');
    }

    /**
     * Navigate to previous page of results
     */
    async goToPreviousPage(): Promise<void> {
        await this.clickElement(this.previousPageButton);
        await this.waitForPageLoad();
        logger.info('Navigated to previous page');
    }

    /**
     * Verify search results are displayed
     * @returns True if results are visible
     */
    async areResultsDisplayed(): Promise<boolean> {
        const isVisible = await this.isElementVisible(this.searchResultsContainer);
        logger.info(`Search results displayed: ${isVisible}`);
        return isVisible;
    }
}
