import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * ConfigReader - Utility Class
 * 
 * Manages environment configuration and provides
 * type-safe access to configuration values.
 */
export class ConfigReader {
    private static instance: ConfigReader;
    private config: Map<string, string>;

    private constructor() {
        // Load environment variables
        dotenv.config();

        this.config = new Map();
        this.loadConfig();
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): ConfigReader {
        if (!ConfigReader.instance) {
            ConfigReader.instance = new ConfigReader();
        }
        return ConfigReader.instance;
    }

    /**
     * Load configuration from environment
     */
    private loadConfig(): void {
        // Application URLs
        this.config.set('BASE_URL', process.env.BASE_URL || 'https://demo.playwright.dev');
        this.config.set('API_BASE_URL', process.env.API_BASE_URL || 'https://api.example.com');

        // Environment
        this.config.set('ENVIRONMENT', process.env.ENVIRONMENT || 'dev');

        // Test credentials
        this.config.set('TEST_USER_EMAIL', process.env.TEST_USER_EMAIL || '');
        this.config.set('TEST_USER_PASSWORD', process.env.TEST_USER_PASSWORD || '');
        this.config.set('ADMIN_USER_EMAIL', process.env.ADMIN_USER_EMAIL || '');
        this.config.set('ADMIN_USER_PASSWORD', process.env.ADMIN_USER_PASSWORD || '');

        // API keys
        this.config.set('API_KEY', process.env.API_KEY || '');
        this.config.set('AUTH_TOKEN', process.env.AUTH_TOKEN || '');

        // Browser settings
        this.config.set('HEADLESS', process.env.HEADLESS || 'true');
        this.config.set('SLOW_MO', process.env.SLOW_MO || '0');

        // Timeouts
        this.config.set('DEFAULT_TIMEOUT', process.env.DEFAULT_TIMEOUT || '30000');
        this.config.set('NAVIGATION_TIMEOUT', process.env.NAVIGATION_TIMEOUT || '30000');
        this.config.set('ACTION_TIMEOUT', process.env.ACTION_TIMEOUT || '10000');

        // Logging
        this.config.set('LOG_LEVEL', process.env.LOG_LEVEL || 'info');
    }

    /**
     * Get configuration value
     * @param key - Configuration key
     * @param defaultValue - Default value if key not found
     */
    get(key: string, defaultValue: string = ''): string {
        return this.config.get(key) || defaultValue;
    }

    /**
     * Get configuration value as number
     * @param key - Configuration key
     * @param defaultValue - Default value if key not found
     */
    getNumber(key: string, defaultValue: number = 0): number {
        const value = this.config.get(key);
        return value ? parseInt(value, 10) : defaultValue;
    }

    /**
     * Get configuration value as boolean
     * @param key - Configuration key
     * @param defaultValue - Default value if key not found
     */
    getBoolean(key: string, defaultValue: boolean = false): boolean {
        const value = this.config.get(key);
        return value ? value.toLowerCase() === 'true' : defaultValue;
    }

    /**
     * Get base URL
     */
    getBaseUrl(): string {
        return this.get('BASE_URL');
    }

    /**
     * Get API base URL
     */
    getApiBaseUrl(): string {
        return this.get('API_BASE_URL');
    }

    /**
     * Get environment
     */
    getEnvironment(): string {
        return this.get('ENVIRONMENT');
    }

    /**
     * Check if running in CI
     */
    isCI(): boolean {
        return this.getBoolean('CI', false);
    }

    /**
     * Get test user credentials
     */
    getTestUser(): { email: string; password: string } {
        return {
            email: this.get('TEST_USER_EMAIL'),
            password: this.get('TEST_USER_PASSWORD'),
        };
    }

    /**
     * Get admin user credentials
     */
    getAdminUser(): { email: string; password: string } {
        return {
            email: this.get('ADMIN_USER_EMAIL'),
            password: this.get('ADMIN_USER_PASSWORD'),
        };
    }
}

// Export singleton instance
export const config = ConfigReader.getInstance();
