import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';

/**
 * BrowserManager - Singleton Pattern
 * 
 * This class manages browser instances using the Singleton design pattern.
 * It ensures only one browser instance exists throughout the test execution,
 * providing centralized browser and context management.
 * 
 * Key Features:
 * - Single browser instance (Singleton)
 * - Multiple browser type support
 * - Context isolation for parallel tests
 * - Centralized configuration
 */
export class BrowserManager {
    private static instance: BrowserManager;
    private browser: Browser | null = null;
    private contexts: Map<string, BrowserContext> = new Map();

    // Private constructor to prevent direct instantiation
    private constructor() { }

    /**
     * Get singleton instance
     * Design Pattern: Singleton
     */
    public static getInstance(): BrowserManager {
        if (!BrowserManager.instance) {
            BrowserManager.instance = new BrowserManager();
        }
        return BrowserManager.instance;
    }

    /**
     * Initialize browser
     * @param browserType - Type of browser (chromium, firefox, webkit)
     * @param headless - Run in headless mode
     */
    async initBrowser(
        browserType: 'chromium' | 'firefox' | 'webkit' = 'chromium',
        headless: boolean = true
    ): Promise<Browser> {
        if (this.browser) {
            return this.browser;
        }

        const launchOptions = {
            headless,
            args: ['--start-maximized'],
            slowMo: parseInt(process.env.SLOW_MO || '0'),
        };

        switch (browserType) {
            case 'firefox':
                this.browser = await firefox.launch(launchOptions);
                break;
            case 'webkit':
                this.browser = await webkit.launch(launchOptions);
                break;
            default:
                this.browser = await chromium.launch(launchOptions);
        }

        return this.browser;
    }

    /**
     * Create new browser context
     * @param contextId - Unique identifier for the context
     * @param options - Context options
     */
    async createContext(
        contextId: string,
        options?: {
            viewport?: { width: number; height: number };
            userAgent?: string;
            locale?: string;
            timezoneId?: string;
            permissions?: string[];
            geolocation?: { latitude: number; longitude: number };
            storageState?: string;
        }
    ): Promise<BrowserContext> {
        if (!this.browser) {
            throw new Error('Browser not initialized. Call initBrowser() first.');
        }

        if (this.contexts.has(contextId)) {
            return this.contexts.get(contextId)!;
        }

        const context = await this.browser.newContext({
            viewport: options?.viewport || { width: 1280, height: 720 },
            userAgent: options?.userAgent,
            locale: options?.locale || 'en-US',
            timezoneId: options?.timezoneId || 'America/New_York',
            permissions: options?.permissions,
            geolocation: options?.geolocation,
            storageState: options?.storageState,
            recordVideo: process.env.VIDEO_ON_FAILURE === 'true' ? {
                dir: 'test-results/videos/',
            } : undefined,
        });

        // Enable tracing if configured
        if (process.env.TRACE_ON_FAILURE === 'true') {
            await context.tracing.start({ screenshots: true, snapshots: true });
        }

        this.contexts.set(contextId, context);
        return context;
    }

    /**
     * Get existing context
     * @param contextId - Context identifier
     */
    getContext(contextId: string): BrowserContext | undefined {
        return this.contexts.get(contextId);
    }

    /**
     * Create new page in context
     * @param contextId - Context identifier
     */
    async createPage(contextId: string): Promise<Page> {
        const context = this.contexts.get(contextId);
        if (!context) {
            throw new Error(`Context '${contextId}' not found. Create context first.`);
        }
        return await context.newPage();
    }

    /**
     * Close specific context
     * @param contextId - Context identifier
     */
    async closeContext(contextId: string): Promise<void> {
        const context = this.contexts.get(contextId);
        if (context) {
            // Stop tracing if enabled
            if (process.env.TRACE_ON_FAILURE === 'true') {
                await context.tracing.stop({
                    path: `test-results/traces/${contextId}-trace.zip`,
                });
            }
            await context.close();
            this.contexts.delete(contextId);
        }
    }

    /**
     * Close all contexts
     */
    async closeAllContexts(): Promise<void> {
        for (const [contextId, context] of this.contexts.entries()) {
            await context.close();
            this.contexts.delete(contextId);
        }
    }

    /**
     * Close browser
     */
    async closeBrowser(): Promise<void> {
        await this.closeAllContexts();
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    /**
     * Get browser instance
     */
    getBrowser(): Browser | null {
        return this.browser;
    }

    /**
     * Check if browser is initialized
     */
    isBrowserInitialized(): boolean {
        return this.browser !== null;
    }

    /**
     * Save storage state (cookies, localStorage)
     * @param contextId - Context identifier
     * @param path - Path to save state
     */
    async saveStorageState(contextId: string, path: string): Promise<void> {
        const context = this.contexts.get(contextId);
        if (!context) {
            throw new Error(`Context '${contextId}' not found.`);
        }
        await context.storageState({ path });
    }

    /**
     * Clear all cookies in context
     * @param contextId - Context identifier
     */
    async clearCookies(contextId: string): Promise<void> {
        const context = this.contexts.get(contextId);
        if (!context) {
            throw new Error(`Context '${contextId}' not found.`);
        }
        await context.clearCookies();
    }

    /**
     * Add cookies to context
     * @param contextId - Context identifier
     * @param cookies - Cookies to add
     */
    async addCookies(
        contextId: string,
        cookies: Array<{
            name: string;
            value: string;
            domain?: string;
            path?: string;
            expires?: number;
            httpOnly?: boolean;
            secure?: boolean;
            sameSite?: 'Strict' | 'Lax' | 'None';
        }>
    ): Promise<void> {
        const context = this.contexts.get(contextId);
        if (!context) {
            throw new Error(`Context '${contextId}' not found.`);
        }
        await context.addCookies(cookies);
    }
}

// Export singleton instance
export const browserManager = BrowserManager.getInstance();
