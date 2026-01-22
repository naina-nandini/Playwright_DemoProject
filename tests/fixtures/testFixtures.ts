import { test as base, Page } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { logger } from '@utils/Logger';
import { AlertsPage } from '@pages/AlertsPage';
import { AmazonHomePage } from '@pages/AmazonHomePage';

/**
 * Custom Test Fixtures
 * Design Pattern: Fixture Pattern
 * 
 * Extends Playwright's test object with custom fixtures for:
 * - Automatic page object initialization
 * - Setup and teardown automation
 * - Shared test context
 */

type CustomFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    authenticatedPage: Page;
    alertsPage: AlertsPage;
    homePage: AmazonHomePage;
};

/**
 * Extended test object with custom fixtures
 */
export const test = base.extend<CustomFixtures>({
    /**
     * LoginPage fixture
     * Automatically creates LoginPage instance for each test
     */
    loginPage: async ({ page }, use) => {
        logger.info('Creating LoginPage fixture');
        const loginPage = new LoginPage(page);
        await use(loginPage);
        logger.info('LoginPage fixture cleanup');
    },

    /**
     * DashboardPage fixture
     * Automatically creates DashboardPage instance for each test
     */
    dashboardPage: async ({ page }, use) => {
        logger.info('Creating DashboardPage fixture');
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
        logger.info('DashboardPage fixture cleanup');
    },

    /**
     * Authenticated page fixture
     * Automatically logs in before test execution
     */
    authenticatedPage: async ({ page }, use) => {
        logger.info('Setting up authenticated session');

        // Perform login
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(
            process.env.TEST_USER_EMAIL || 'test@example.com',
            process.env.TEST_USER_PASSWORD || 'password123'
        );

        logger.info('Authenticated session ready');
        await use(page);

        logger.info('Authenticated session cleanup');
    },

    /**
     * AlertsPage fixture
     */
    alertsPage: async ({ page }, use) => {
        const alertsPage = new AlertsPage(page);
        await alertsPage.goto();
        await use(alertsPage);
    },

    /**
     * AmazonHomePage fixture
     */
    homePage: async ({ page }, use) => {
        const homePage = new AmazonHomePage(page);
        await homePage.goto();
        await use(homePage);
    },
});

export { expect } from '@playwright/test';
