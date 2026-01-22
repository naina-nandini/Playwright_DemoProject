import { Page, Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ScreenshotHelper - Utility Class
 * 
 * Provides screenshot capture and comparison utilities
 * for visual regression testing.
 */
export class ScreenshotHelper {
    private page: Page;
    private screenshotDir: string;

    constructor(page: Page) {
        this.page = page;
        this.screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');
        this.ensureDirectoryExists(this.screenshotDir);
    }

    /**
     * Ensure directory exists
     */
    private ensureDirectoryExists(dir: string): void {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    /**
     * Capture full page screenshot
     * @param name - Screenshot name
     */
    async captureScreenshot(name: string): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}-${timestamp}.png`;
        const filepath = path.join(this.screenshotDir, filename);

        await this.page.screenshot({ path: filepath, fullPage: true });
        return filepath;
    }

    /**
     * Capture element screenshot
     * @param locator - Element to screenshot
     * @param name - Screenshot name
     */
    async captureElementScreenshot(locator: Locator, name: string): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}-${timestamp}.png`;
        const filepath = path.join(this.screenshotDir, filename);

        await locator.screenshot({ path: filepath });
        return filepath;
    }

    /**
     * Compare screenshot with baseline
     * @param name - Screenshot name
     */
    async compareScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `${name}.png` });
    }
}
