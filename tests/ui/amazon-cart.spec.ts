import { test, expect } from '@playwright/test';
import { AmazonHomePage } from '@pages/AmazonHomePage';
import { AmazonSearchResultsPage } from '@pages/AmazonSearchResultsPage';
import { AmazonProductPage } from '@pages/AmazonProductPage';
import { AmazonCartPage } from '@pages/AmazonCartPage';
import { logger } from '@utils/Logger';

/**
 * Amazon Shopping Cart Test Suite
 * 
 * Tests for shopping cart functionality
 */

test.describe('Amazon Cart Operations', () => {
    let homePage: AmazonHomePage;
    let searchResultsPage: AmazonSearchResultsPage;
    let productPage: AmazonProductPage;
    let cartPage: AmazonCartPage;

    test.beforeEach(async ({ page }) => {
        homePage = new AmazonHomePage(page);
        searchResultsPage = new AmazonSearchResultsPage(page);
        productPage = new AmazonProductPage(page);
        cartPage = new AmazonCartPage(page);

        logger.info('Starting Amazon cart test');
    });

    test('should navigate to cart page', async () => {
        // Act
        await homePage.goto();
        await homePage.goToCart();

        // Assert
        const isLoaded = await cartPage.verifyPageLoaded();
        expect(isLoaded).toBeTruthy();

        logger.info('Cart page navigation test passed');
    });

    test('should display cart count in header', async () => {
        // Arrange
        await homePage.goto();

        // Act
        const cartCount = await homePage.getCartCount();

        // Assert
        expect(cartCount).toBeDefined();

        logger.info(`Cart count: ${cartCount}`);
    });

    test('should add product to cart and verify', async ({ page }) => {
        // Arrange
        await homePage.goto();
        await homePage.searchProduct('notebook');
        await searchResultsPage.clickProduct(0);

        // Act
        const isAvailable = await productPage.isProductAvailable();

        if (isAvailable) {
            await productPage.addToCart();

            // Assert
            const confirmationDisplayed = await productPage.isAddedToCartConfirmationDisplayed();
            expect(confirmationDisplayed).toBeTruthy();

            logger.info('Product added to cart successfully');
        } else {
            logger.info('Product not available, skipping add to cart');
        }
    });

    test('should view cart items', async () => {
        // Arrange
        await cartPage.goto();

        // Act
        const isEmpty = await cartPage.isCartEmpty();

        // Assert
        expect(typeof isEmpty).toBe('boolean');

        if (!isEmpty) {
            const itemCount = await cartPage.getCartItemCount();
            expect(itemCount).toBeGreaterThan(0);
            logger.info(`Cart has ${itemCount} items`);
        } else {
            logger.info('Cart is empty');
        }
    });

    test('should get cart item titles', async () => {
        // Arrange
        await cartPage.goto();

        // Act
        const isEmpty = await cartPage.isCartEmpty();

        if (!isEmpty) {
            const titles = await cartPage.getCartItemTitles();

            // Assert
            expect(titles.length).toBeGreaterThan(0);
            logger.info(`Cart items: ${titles.join(', ')}`);
        } else {
            logger.info('Cart is empty, no titles to retrieve');
        }
    });

    test('should display cart subtotal', async () => {
        // Arrange
        await cartPage.goto();

        // Act
        const isEmpty = await cartPage.isCartEmpty();

        if (!isEmpty) {
            const subtotal = await cartPage.getSubtotal();

            // Assert
            expect(subtotal).toBeTruthy();
            logger.info(`Cart subtotal: ${subtotal}`);
        } else {
            logger.info('Cart is empty, no subtotal to display');
        }
    });
});

test.describe('Amazon Cart Navigation', () => {
    let homePage: AmazonHomePage;
    let cartPage: AmazonCartPage;

    test.beforeEach(async ({ page }) => {
        homePage = new AmazonHomePage(page);
        cartPage = new AmazonCartPage(page);
    });

    test('should navigate to cart from homepage', async ({ page }) => {
        // Arrange
        await homePage.goto();

        // Act
        await homePage.goToCart();

        // Assert
        await expect(page).toHaveURL(/cart/);

        logger.info('Cart navigation test passed');
    });

    test('should verify cart page loads correctly', async () => {
        // Act
        await cartPage.goto();
        const isLoaded = await cartPage.verifyPageLoaded();

        // Assert
        expect(isLoaded).toBeTruthy();

        logger.info('Cart page loaded successfully');
    });
});
