import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { logger } from '@utils/Logger';

/**
 * Alerts Page Object
 * 
 * Represents the Alerts practice page with all its elements and actions
 */
export class AlertsPage extends BasePage {
    // Locators
    private get okTab(): Locator { return this.page.locator("a[href='#OKTab']"); }
    private get cancelTab(): Locator { return this.page.locator("a[href='#CancelTab']"); }
    private get textboxTab(): Locator { return this.page.locator("a[href='#Textbox']"); }

    private get alertButton(): Locator { return this.page.locator("button[onclick='alertbox()']"); }
    private get confirmButton(): Locator { return this.page.locator("button[onclick='confirmbox()']"); }
    private get promptButton(): Locator { return this.page.locator("button[onclick='promptbox()']"); }

    private get confirmResult(): Locator { return this.page.locator("#demo"); }
    private get promptResult(): Locator { return this.page.locator("#demo1"); }

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to Alerts practice page
     */
    async goto(): Promise<void> {
        // Since baseURL is Amazon, we use absolute URL here
        await this.page.goto('https://demo.automationtesting.in/Alerts.html');
        await this.waitForPageLoad();
        logger.info('Navigated to Alerts practice page');
    }

    /**
     * Switch to OK Tab (Simple Alert)
     */
    async switchToOkTab(): Promise<void> {
        await this.click(this.okTab);
        logger.info('Switched to OK Tab');
    }

    /**
     * Switch to Cancel Tab (Confirm Alert)
     */
    async switchToCancelTab(): Promise<void> {
        await this.click(this.cancelTab);
        logger.info('Switched to Cancel Tab');
    }

    /**
     * Switch to Textbox Tab (Prompt Alert)
     */
    async switchToTextboxTab(): Promise<void> {
        await this.click(this.textboxTab);
        logger.info('Switched to Textbox Tab');
    }

    /**
     * Trigger Simple Alert
     */
    async triggerSimpleAlert(): Promise<void> {
        await this.click(this.alertButton);
        logger.info('Triggered simple alert');
    }

    /**
     * Trigger Confirm Alert
     */
    async triggerConfirmAlert(): Promise<void> {
        await this.click(this.confirmButton);
        logger.info('Triggered confirm alert');
    }

    /**
     * Trigger Prompt Alert
     */
    async triggerPromptAlert(): Promise<void> {
        await this.click(this.promptButton);
        logger.info('Triggered prompt alert');
    }

    /**
     * Get Confirm Alert Result Text
     */
    async getConfirmResultText(): Promise<string> {
        return await this.getText(this.confirmResult);
    }

    /**
     * Get Prompt Alert Result Text
     */
    async getPromptResult() {
        return this.promptResult;
    }

    /**
     * Get Prompt Alert Result Text
     */
    async getPromptResultText(): Promise<string> {
        return await this.getText(this.promptResult);
    }
}
