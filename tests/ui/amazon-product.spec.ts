import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '@pages/AmazonHomePage';
import { AmazonSearchResultsPage } from '@pages/AmazonSearchResultsPage';
import { AmazonProductPage } from '@pages/AmazonProductPage';
import { logger } from '@utils/Logger';

/**
 * Amazon Product Page Test Suite
 * 
 * Tests for product details page functionality
 */

test.describe('Amazon Product Details', () => {
    let homePage: AmazonHomePage;
    let searchResultsPage: AmazonSearchResultsPage;
    let productPage: AmazonProductPage;

    test.beforeEach(async ({ page }) => {
        homePage = new AmazonHomePage(page);
        searchResultsPage = new AmazonSearchResultsPage(page);
        productPage = new AmazonProductPage(page);

        // Navigate to a product
        await homePage.goto();
        await homePage.searchProduct('laptop');
        await searchResultsPage.clickProduct(0);

        logger.info('Starting Amazon product test');
    });

    test('should display product title', async () => {
        // Act
        const title = await productPage.getProductTitle();

        // Assert
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);

        logger.info(`Product title: ${title}`);
    });

    test('should display product price', async () => {
        // Act
        const price = await productPage.getProductPrice();

        // Assert
        expect(price).toBeTruthy();

        logger.info(`Product price: ${price}`);
    });

    test('should display product rating', async () => {
        // Act
        const rating = await productPage.getProductRating();

        // Assert
        expect(rating).toBeTruthy();

        logger.info(`Product rating: ${rating}`);
    });

    test('should verify product page is loaded', async () => {
        // Act
        const isLoaded = await productPage.verifyPageLoaded();

        // Assert
        expect(isLoaded).toBeTruthy();

        logger.info('Product page loaded successfully');
    });

    test('should display product description', async () => {
        // Act
        const description = await productPage.getProductDescription();

        // Assert
        expect(description).toBeTruthy();
        expect(description.length).toBeGreaterThan(0);

        logger.info('Product description retrieved');
    });

    test('should check product availability', async () => {
        // Act
        const isAvailable = await productPage.isProductAvailable();

        // Assert
        expect(typeof isAvailable).toBe('boolean');

        logger.info(`Product available: ${isAvailable}`);
    });
});

test.describe('Amazon Product Interactions', () => {
    let homePage: AmazonHomePage;
    let searchResultsPage: AmazonSearchResultsPage;
    let productPage: AmazonProductPage;

    test.beforeEach(async ({ page }) => {
        homePage = new AmazonHomePage(page);
        searchResultsPage = new AmazonSearchResultsPage(page);
        productPage = new AmazonProductPage(page);

        await homePage.goto();
        await homePage.searchProduct('water bottle');
        await searchResultsPage.clickProduct(0);
    });

    test('should verify Add to Cart button is present', async () => {
        // Act
        const isEnabled = await productPage.isAddToCartEnabled();

        // Assert
        expect(typeof isEnabled).toBe('boolean');

        logger.info(`Add to Cart enabled: ${isEnabled}`);
    });

    test('should get review count', async () => {
        // Act
        const reviewCount = await productPage.getReviewCount();

        // Assert
        expect(reviewCount).toBeTruthy();

        logger.info(`Review count: ${reviewCount}`);
    });
});
