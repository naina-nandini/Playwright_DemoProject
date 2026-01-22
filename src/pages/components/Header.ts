import { Page, Locator } from '@playwright/test';

/**
 * Header Component
 * Design Pattern: Component Pattern
 * 
 * Reusable component that can be composed into multiple page objects.
 * Demonstrates composition over inheritance.
 */
export class Header {
    private page: Page;

    // Locators
    private readonly logo: Locator;
    private readonly searchBox: Locator;
    private readonly navigationMenu: Locator;
    private readonly userMenu: Locator;
    private readonly notificationIcon: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.logo = page.locator('.logo, .brand');
        this.searchBox = page.locator('input[type="search"], .search-input');
        this.navigationMenu = page.locator('nav, .navigation');
        this.userMenu = page.locator('.user-menu, .profile-dropdown');
        this.notificationIcon = page.locator('.notification-icon');
    }

    /**
     * Click logo
     */
    async clickLogo(): Promise<void> {
        await this.logo.click();
    }

    /**
     * Search for text
     */
    async search(query: string): Promise<void> {
        await this.searchBox.fill(query);
        await this.page.keyboard.press('Enter');
    }

    /**
     * Navigate to menu item
     */
    async navigateTo(menuItem: string): Promise<void> {
        const menuLink = this.navigationMenu.locator(`a:has-text("${menuItem}")`);
        await menuLink.click();
    }

    /**
     * Open user menu
     */
    async openUserMenu(): Promise<void> {
        await this.userMenu.click();
    }

    /**
     * Click notifications
     */
    async clickNotifications(): Promise<void> {
        await this.notificationIcon.click();
    }

    /**
     * Check if header is visible
     */
    async isVisible(): Promise<boolean> {
        return await this.logo.isVisible();
    }
}
