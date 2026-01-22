import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Playwright Configuration
 * This configuration supports multiple environments, browsers, and reporters
 * Design Pattern: Configuration Object Pattern
 */
export default defineConfig({
    // Test directory
    testDir: './tests',

    // Maximum time one test can run
    timeout: 30 * 1000,

    // Test execution settings
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : 4,

    // Reporter configuration
    reporter: [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['list'],
        ['allure-playwright', { outputFolder: 'allure-results' }]
    ],

    // Shared settings for all projects
    use: {
        // Base URL for navigation
        baseURL: process.env.BASE_URL || 'https://www.amazon.com',

        // Browser context options
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',

        // Action timeout
        actionTimeout: 10 * 1000,
        navigationTimeout: 30 * 1000,

        // Viewport size
        viewport: { width: 1280, height: 720 },

        // Ignore HTTPS errors
        ignoreHTTPSErrors: true,

        // Locale and timezone
        locale: 'en-US',
        timezoneId: 'America/New_York',
    },

    // Configure project for Chromium only (simplified for learning)
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Additional chromium-specific settings
                launchOptions: {
                    args: ['--start-maximized']
                }
            },
        },
    ],

    // Web server configuration (if needed)
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    // },

    // Output folder for test artifacts
    outputDir: 'test-results/',

    // Global setup and teardown
    // globalSetup: require.resolve('./global-setup'),
    // globalTeardown: require.resolve('./global-teardown'),
});
