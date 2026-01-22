import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/BasePage';
import { Header } from './components/Header';

/**
 * DashboardPage - Complex Page Object Example
 * Design Pattern: Page Object Model + Component Composition
 * 
 * Demonstrates a more complex page object with:
 * - Component composition (Header component)
 * - Multiple sections and interactions
 * - Advanced locator strategies
 */
export class DashboardPage extends BasePage {
    // Component composition
    public readonly header: Header;

    // Locators
    private readonly welcomeMessage: Locator;
    private readonly userAvatar: Locator;
    private readonly statsCards: Locator;
    private readonly recentActivities: Locator;
    private readonly notificationBadge: Locator;
    private readonly settingsButton: Locator;
    private readonly logoutButton: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize component
        this.header = new Header(page);

        // Initialize locators
        this.welcomeMessage = page.locator('.welcome-message, h1');
        this.userAvatar = page.locator('.user-avatar, img[alt*="avatar"]');
        this.statsCards = page.locator('.stats-card, .dashboard-card');
        this.recentActivities = page.locator('.recent-activities, .activity-list');
        this.notificationBadge = page.locator('.notification-badge');
        this.settingsButton = page.locator('button:has-text("Settings")');
        this.logoutButton = page.locator('button:has-text("Logout")');
    }

    /**
     * Navigate to dashboard
     */
    async goto(url?: string): Promise<DashboardPage> {
        const dashboardUrl = url || `${process.env.BASE_URL}/dashboard`;
        await this.navigate(dashboardUrl);
        await this.waitForPageLoad();
        return this;
    }

    /**
     * Get welcome message
     */
    async getWelcomeMessage(): Promise<string> {
        return await this.getText(this.welcomeMessage);
    }

    /**
     * Get stats card count
     */
    async getStatsCardCount(): Promise<number> {
        return await this.statsCards.count();
    }

    /**
     * Get stats card value by index
     */
    async getStatsCardValue(index: number): Promise<string> {
        const card = this.statsCards.nth(index);
        return await this.getText(card);
    }

    /**
     * Check if user is logged in
     */
    async isUserLoggedIn(): Promise<boolean> {
        return await this.isVisible(this.userAvatar);
    }

    /**
     * Get notification count
     */
    async getNotificationCount(): Promise<number> {
        const badgeText = await this.getText(this.notificationBadge);
        return parseInt(badgeText, 10) || 0;
    }

    /**
     * Click settings button
     */
    async clickSettings(): Promise<void> {
        await this.click(this.settingsButton);
    }

    /**
     * Logout
     */
    async logout(): Promise<void> {
        await this.click(this.logoutButton);
        await this.waitForPageLoad();
    }

    /**
     * Verify dashboard is loaded
     */
    async verifyPageLoaded(): Promise<void> {
        await this.assertVisible(this.welcomeMessage);
        await this.assertVisible(this.userAvatar);
    }
}
