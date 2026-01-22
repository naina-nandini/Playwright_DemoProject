/*
 * OLD FILE - REPLACED BY AlertsPracticePOM.spec.ts
 * 
 * This file is kept for reference but should not be used for running tests.
 * The new implementation uses the Page Object Model (POM) pattern and Fixtures.
 * See: tests/ui/AlertsPracticePOM.spec.ts
 */

import { test, expect } from '@playwright/test';

test.describe.skip('Alerts program (Deprecated)', () => {

    test('Simple Alert', async ({ page }) => {
        await page.goto('https://demo.automationtesting.in/Alerts.html');
        await page.locator("a[href='#OKTab']").click();
        page.on('dialog', simpleDialog => {
            console.log(`Alert message: ${simpleDialog.message()}`);
            simpleDialog.dismiss();
        });
        await page.locator("button[onclick='alertbox()']").click();
        await page.waitForTimeout(5000);
    });

    test('Confirm Alert', async ({ page }) => {
        await page.goto('https://demo.automationtesting.in/Alerts.html');
        await page.locator("a[href='#CancelTab']").click();
        page.on('dialog', (ConfirmAlert) => {
            console.log("Alert Type :" + ConfirmAlert.type());
            ConfirmAlert.accept();
            console.log("Alert Message :" + ConfirmAlert.message());
        })
        await page.locator("button[onclick='confirmbox()']").click();
        console.log(page.locator(".demo").innerText());
        page.waitForTimeout(5000);
    });

    test('Prompt Alert', async ({ page }) => {
        await page.goto('https://demo.automationtesting.in/Alerts.html');
        await page.locator("a[href='#Textbox']").click();
        page.on('dialog', (promptAlert) => {
            console.log("Alert Type :" + promptAlert.type());
            console.log("Alert Message :" + promptAlert.message());
            const value = promptAlert.defaultValue();
            expect(value).toBe("Automation Testing user");
            promptAlert.accept("Naina");
        })
        await page.locator("button[onclick='promptbox()']").click();
        await page.waitForTimeout(5000);
        const message = await page.locator("p[id='demo1']").innerText();
        await expect(message).toContain("Hello Naina How are you today");
    });
});
