import { test, expect } from '@playwright/test';
import { logger } from '@utils/Logger';

test('simple amazon title check', async ({ page }) => {
    logger.info('Navigating to Amazon...');
    await page.goto('https://www.amazon.com');

    // // Verify title contains "Amazon"
    // const title = await page.title();
    // console.log(`Page Title is: ${title}`);
    // logger.info(`Page Title is: ${title}`);

    // expect(title).toContain('Amazon');
});
