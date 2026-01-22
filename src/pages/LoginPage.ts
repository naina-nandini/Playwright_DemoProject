import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/BasePage';

/**
 * LoginPage - Page Object Model Example
 * Design Pattern: Page Object Model (POM) + Fluent Interface
 * 
 * This class demonstrates the Page Object Model pattern with
 * a fluent interface for method chaining, making tests more readable.
 * 
 * Key Features:
 * - Encapsulates page elements and actions
 * - Fluent interface for readable test code
 * - Reusable methods
 * - Centralized locators
 */
export class LoginPage extends BasePage {
    // Locators - Centralized element selectors
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;
    private readonly forgotPasswordLink: Locator;
    private readonly signUpLink: Locator;
    private readonly rememberMeCheckbox: Locator;
    private readonly showPasswordButton: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize locators
        this.emailInput = page.locator('input[type="email"], input[name="email"]');
        this.passwordInput = page.locator('input[type="password"], input[name="password"]');
        this.loginButton = page.locator('button[type="submit"], button:has-text("Login")');
        this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
        this.forgotPasswordLink = page.locator('a:has-text("Forgot Password")');
        this.signUpLink = page.locator('a:has-text("Sign Up")');
        this.rememberMeCheckbox = page.locator('input[type="checkbox"][name="remember"]');
        this.showPasswordButton = page.locator('button:has-text("Show")');
    }

    /**
     * Navigate to login page
     * Fluent Interface: Returns 'this' for method chaining
     */
    async goto(url?: string): Promise<LoginPage> {
        const loginUrl = url || `${process.env.BASE_URL}/login`;
        await this.navigate(loginUrl);
        await this.waitForPageLoad();
        return this;
    }

    /**
     * Enter email
     * Fluent Interface: Returns 'this' for method chaining
     */
    async enterEmail(email: string): Promise<LoginPage> {
        await this.fill(this.emailInput, email);
        return this;
    }

    /**
     * Enter password
     * Fluent Interface: Returns 'this' for method chaining
     */
    async enterPassword(password: string): Promise<LoginPage> {
        await this.fill(this.passwordInput, password);
        return this;
    }

    /**
     * Click login button
     */
    async clickLogin(): Promise<void> {
        await this.click(this.loginButton);
        await this.waitForPageLoad();
    }

    /**
     * Perform complete login action
     * Fluent Interface: Chains multiple actions
     */
    async login(email: string, password: string): Promise<void> {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    /**
     * Login with remember me option
     */
    async loginWithRememberMe(email: string, password: string): Promise<void> {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.check(this.rememberMeCheckbox);
        await this.clickLogin();
    }

    /**
     * Check if error message is displayed
     */
    async isErrorDisplayed(): Promise<boolean> {
        return await this.isVisible(this.errorMessage);
    }

    /**
     * Get error message text
     */
    async getErrorMessage(): Promise<string> {
        return await this.getText(this.errorMessage);
    }

    /**
     * Click forgot password link
     */
    async clickForgotPassword(): Promise<void> {
        await this.click(this.forgotPasswordLink);
    }

    /**
     * Click sign up link
     */
    async clickSignUp(): Promise<void> {
        await this.click(this.signUpLink);
    }

    /**
     * Toggle password visibility
     */
    async togglePasswordVisibility(): Promise<void> {
        await this.click(this.showPasswordButton);
    }

    /**
     * Verify login page is loaded
     */
    async verifyPageLoaded(): Promise<void> {
        await this.assertVisible(this.emailInput);
        await this.assertVisible(this.passwordInput);
        await this.assertVisible(this.loginButton);
    }

    /**
     * Clear login form
     */
    async clearForm(): Promise<LoginPage> {
        await this.fill(this.emailInput, '');
        await this.fill(this.passwordInput, '');
        return this;
    }

    /**
     * Check if login button is enabled
     */
    async isLoginButtonEnabled(): Promise<boolean> {
        return await this.isEnabled(this.loginButton);
    }
}
