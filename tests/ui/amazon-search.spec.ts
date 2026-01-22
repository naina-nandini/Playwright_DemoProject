import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '@pages/AmazonHomePage';
import { AmazonSearchResultsPage } from '@pages/AmazonSearchResultsPage';
import { logger } from '@utils/Logger';

/**
 * Amazon Search Test Suite
 * 
 * Tests for product search functionality on Amazon.com
 */

test.describe('Amazon Product Search', () => {
    let homePage: AmazonHomePage;
    let searchResultsPage: AmazonSearchResultsPage;

    test.beforeEach(async ({ page }) => {
        homePage = new AmazonHomePage(page);
        searchResultsPage = new AmazonSearchResultsPage(page);
        await homePage.goto();
        logger.info('Starting Amazon search test');
    });

    test('should search for a product and display results', async ({ page }) => {
        // Arrange
        const searchTerm = 'laptop';

        // Act
        await homePage.searchProduct(searchTerm);

        // Assert
        await expect(page).toHaveURL(/s\?k=/);
        const resultsDisplayed = await searchResultsPage.areResultsDisplayed();
        expect(resultsDisplayed).toBeTruthy();

        const productCount = await searchResultsPage.getProductCount();
        expect(productCount).toBeGreaterThan(0);

        logger.info(`Search test passed: Found ${productCount} products`);
    });

    test('should search using Enter key', async ({ page }) => {
        // Arrange
        const searchTerm = 'headphones';

        // Act
        await homePage.searchProductWithEnter(searchTerm);

        // Assert
        await expect(page).toHaveURL(/s\?k=/);
        const resultsDisplayed = await searchResultsPage.areResultsDisplayed();
        expect(resultsDisplayed).toBeTruthy();
    });

    test('should display product titles in search results', async () => {
        // Arrange
        const searchTerm = 'books';

        // Act
        await homePage.searchProduct(searchTerm);
        const titles = await searchResultsPage.getProductTitles();

        // Assert
        expect(titles.length).toBeGreaterThan(0);
        titles.forEach(title => {
            expect(title).toBeTruthy();
        });

        logger.info(`Found ${titles.length} product titles`);
    });

    test('should sort search results', async () => {
        // Arrange
        const searchTerm = 'mouse';
        await homePage.searchProduct(searchTerm);

        // Act
        await searchResultsPage.sortBy('Price: Low to High');
        await searchResultsPage.page.waitForTimeout(2000); // Wait for results to reload

        // Assert
        const resultsDisplayed = await searchResultsPage.areResultsDisplayed();
        expect(resultsDisplayed).toBeTruthy();

        logger.info('Sort test passed');
    });

    test('should display results count', async () => {
        // Arrange
        const searchTerm = 'keyboard';

        // Act
        await homePage.searchProduct(searchTerm);
        const resultsCount = await searchResultsPage.getResultsCount();

        // Assert
        expect(resultsCount).toBeTruthy();
        expect(resultsCount.length).toBeGreaterThan(0);

        logger.info(`Results count: ${resultsCount}`);
    });
});

test.describe('Amazon Search Results Navigation', () => {
    let homePage: AmazonHomePage;
    let searchResultsPage: AmazonSearchResultsPage;

    test.beforeEach(async ({ page }) => {
        homePage = new AmazonHomePage(page);
        searchResultsPage = new AmazonSearchResultsPage(page);
        await homePage.goto();
    });

    test('should click on a product from search results', async ({ page }) => {
        // Arrange
        const searchTerm = 'water bottle';
        await homePage.searchProduct(searchTerm);

        // Act
        await searchResultsPage.clickProduct(0);

        // Assert
        await expect(page).toHaveURL(/\/dp\//);

        logger.info('Product click test passed');
    });

    test('should get product prices from search results', async () => {
        // Arrange
        const searchTerm = 'phone case';
        await homePage.searchProduct(searchTerm);

        // Act
        const firstProductPrice = await searchResultsPage.getProductPrice(0);

        // Assert
        expect(firstProductPrice).toBeTruthy();

        logger.info(`First product price: ${firstProductPrice}`);
    });
});
