import { test, expect } from '../fixtures/testFixtures';

test.describe('Alerts Practice (POM with Fixtures)', () => {

    test('Simple Alert', async ({ alertsPage, page }) => {
        // 1. Switch to tab
        await alertsPage.switchToOkTab();

        // 2. Setup Dialog Handler using page object from fixture (but handler is still on page)
        page.on('dialog', async dialog => {
            console.log(`Alert message: ${dialog.message()}`);
            expect(dialog.type()).toBe('alert');
            await dialog.accept();
        });

        // 3. Trigger Alert
        await alertsPage.triggerSimpleAlert();
    });

    test('Confirm Alert', async ({ alertsPage, page }) => {
        // 1. Switch to tab
        await alertsPage.switchToCancelTab();

        // 2. Setup Dialog Handler
        page.on('dialog', async dialog => {
            expect(dialog.type()).toBe('confirm');
            await dialog.accept();
        });

        // 3. Trigger Alert
        await alertsPage.triggerConfirmAlert();

        // 4. Verify Result
        const resultText = await alertsPage.getConfirmResultText();
        expect(resultText).toContain('You pressed Ok');
    });

    test('Prompt Alert', async ({ alertsPage, page }) => {
        // 1. Switch to tab
        await alertsPage.switchToTextboxTab();

        // 2. Setup Dialog Handler
        page.on('dialog', async dialog => {
            expect(dialog.type()).toBe('prompt');
            expect(dialog.defaultValue()).toBe('Automation Testing user');
            await dialog.accept('Naina');
        });

        // 3. Trigger Alert
        await alertsPage.triggerPromptAlert();

        // 4. Verify Result
        await expect(await alertsPage.getPromptResult()).toContainText('Hello Naina How are you today');
    });
});
