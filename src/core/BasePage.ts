import { Page, Locator, expect } from '@playwright/test';
import { ScreenshotHelper } from '@utils/ScreenshotHelper';

/**
 * BasePage - Abstract Base Class
 * Design Pattern: Template Method Pattern
 * 
 * This class provides common functionality for all page objects.
 * It implements reusable methods that can be inherited by specific page classes.
 * 
 * Key Features:
 * - Centralized wait strategies
 * - Common element interaction methods
 * - Screenshot and error handling
 * - Fluent interface for method chaining
 */
export abstract class BasePage {
    protected page: Page;
    protected screenshotHelper: ScreenshotHelper;

    constructor(page: Page) {
        this.page = page;
        this.screenshotHelper = new ScreenshotHelper(page);
    }

    /**
     * Navigate to a specific URL
     * @param url - The URL to navigate to
     */
    async navigate(url: string): Promise<void> {
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    /**
     * Wait for element to be visible
     * @param locator - The element locator
     * @param timeout - Optional timeout in milliseconds
     */
    async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
    }

    /**
     * Click on an element with built-in wait
     * @param locator - The element to click
     */
    async click(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.click();
    }

    /**
     * Fill input field with text
     * @param locator - The input field locator
     * @param text - Text to fill
     */
    async fill(locator: Locator, text: string): Promise<void> {
        await this.waitForElement(locator);
        await locator.fill(text);
    }

    /**
     * Type text with delay (simulates human typing)
     * @param locator - The input field locator
     * @param text - Text to type
     * @param delay - Delay between keystrokes in ms
     */
    async type(locator: Locator, text: string, delay: number = 100): Promise<void> {
        await this.waitForElement(locator);
        await locator.pressSequentially(text, { delay });
    }

    /**
     * Get text content from an element
     * @param locator - The element locator
     * @returns The text content
     */
    async getText(locator: Locator): Promise<string> {
        await this.waitForElement(locator);
        return await locator.textContent() || '';
    }

    /**
     * Check if element is visible
     * @param locator - The element locator
     * @returns True if visible, false otherwise
     */
    async isVisible(locator: Locator): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if element is enabled
     * @param locator - The element locator
     * @returns True if enabled, false otherwise
     */
    async isEnabled(locator: Locator): Promise<boolean> {
        return await locator.isEnabled();
    }

    /**
     * Select option from dropdown
     * @param locator - The dropdown locator
     * @param option - Option to select (value, label, or index)
     */
    async selectOption(locator: Locator, option: string | number): Promise<void> {
        await this.waitForElement(locator);
        if (typeof option === 'number') {
            await locator.selectOption({ index: option });
        } else {
            await locator.selectOption(option);
        }
    }

    /**
     * Wait for page to load completely
     */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Scroll element into view
     * @param locator - The element to scroll to
     */
    async scrollIntoView(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    /**
     * Take screenshot of the page
     * @param name - Screenshot name
     */
    async takeScreenshot(name: string): Promise<void> {
        await this.screenshotHelper.captureScreenshot(name);
    }

    /**
     * Take screenshot of specific element
     * @param locator - The element to screenshot
     * @param name - Screenshot name
     */
    async takeElementScreenshot(locator: Locator, name: string): Promise<void> {
        await this.screenshotHelper.captureElementScreenshot(locator, name);
    }

    /**
     * Wait for specific time (use sparingly)
     * @param ms - Milliseconds to wait
     */
    async wait(ms: number): Promise<void> {
        await this.page.waitForTimeout(ms);
    }

    /**
     * Get current page URL
     * @returns Current URL
     */
    getCurrentUrl(): string {
        return this.page.url();
    }

    /**
     * Get page title
     * @returns Page title
     */
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Press keyboard key
     * @param key - Key to press
     */
    async pressKey(key: string): Promise<void> {
        await this.page.keyboard.press(key);
    }

    /**
     * Hover over an element
     * @param locator - The element to hover over
     */
    async hover(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.hover();
    }

    /**
     * Double click on an element
     * @param locator - The element to double click
     */
    async doubleClick(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.dblclick();
    }

    /**
     * Right click on an element
     * @param locator - The element to right click
     */
    async rightClick(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.click({ button: 'right' });
    }

    /**
     * Check a checkbox or radio button
     * @param locator - The checkbox/radio locator
     */
    async check(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.check();
    }

    /**
     * Uncheck a checkbox
     * @param locator - The checkbox locator
     */
    async uncheck(locator: Locator): Promise<void> {
        await this.waitForElement(locator);
        await locator.uncheck();
    }

    /**
     * Get attribute value from element
     * @param locator - The element locator
     * @param attribute - Attribute name
     * @returns Attribute value
     */
    async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
        await this.waitForElement(locator);
        return await locator.getAttribute(attribute);
    }

    /**
     * Execute custom JavaScript
     * @param script - JavaScript code to execute
     * @param args - Arguments to pass to the script
     * @returns Result of the script execution
     */
    async executeScript(script: string, ...args: any[]): Promise<any> {
        return await this.page.evaluate(script, ...args);
    }

    /**
     * Reload the current page
     */
    async reload(): Promise<void> {
        await this.page.reload();
    }

    /**
     * Go back in browser history
     */
    async goBack(): Promise<void> {
        await this.page.goBack();
    }

    /**
     * Go forward in browser history
     */
    async goForward(): Promise<void> {
        await this.page.goForward();
    }

    /**
     * Assert element is visible
     * @param locator - The element locator
     */
    async assertVisible(locator: Locator): Promise<void> {
        await expect(locator).toBeVisible();
    }

    /**
     * Assert element contains text
     * @param locator - The element locator
     * @param text - Expected text
     */
    async assertText(locator: Locator, text: string): Promise<void> {
        await expect(locator).toHaveText(text);
    }

    /**
     * Assert element contains partial text
     * @param locator - The element locator
     * @param text - Expected partial text
     */
    async assertContainsText(locator: Locator, text: string): Promise<void> {
        await expect(locator).toContainText(text);
    }
}
