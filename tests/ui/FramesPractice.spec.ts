import {test, expect} from '@playwright/test';

test.describe('Frames practice', () => {
   
    test('Frame Program1' , async ({page}) => {
        await page.goto('https://ui.vision/demo/webtest/frames/');
        

    });
});