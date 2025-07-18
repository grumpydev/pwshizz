import { Page, Locator, expect } from '@playwright/test';
import { testConfig } from '../../config/test-config';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly userMenuToggle: Locator;
  readonly signOutLink: Locator;

  /**
   * Static helper method to perform complete login flow
   * This is the recommended way to handle login in tests
   */
  static async performLogin(page: Page): Promise<void> {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.loginWithValidCredentials();
    await loginPage.assertLoginSucceeded();
  }

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator('#username');
    this.passwordField = page.locator('#password');
    this.loginButton = page.locator('button:has-text("Login")');
    // Use structural selector: first dropdown toggle in the main navigation bar
    this.userMenuToggle = page.locator('nav.navbar.main .dropdown-toggle').first();
    this.signOutLink = page.locator('a:has-text("Sign out")');
  }

  /**
   * Navigate to the application and wait for login page to load
   */
  async navigate() {
    await this.page.goto('/');
    await this.usernameField.waitFor();
  }

  /**
   * Fill in login credentials
   */
  async fillCredentials(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
  }

  /**
   * Fill in valid test credentials
   */
  async fillValidCredentials() {
    await this.fillCredentials(testConfig.testUser.username, testConfig.testUser.password);
  }

  /**
   * Click the login button
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Complete login flow with given credentials
   */
  async login(username: string, password: string) {
    await this.fillCredentials(username, password);
    await this.clickLogin();
  }

  /**
   * Complete login flow with valid credentials
   */
  async loginWithValidCredentials() {
    await this.fillValidCredentials();
    await this.clickLogin();
  }

  /**
   * Attempt login and wait for response
   */
  async attemptLogin(username: string, password: string) {
    await this.login(username, password);
    await this.page.waitForTimeout(3000); // Wait for response
  }

  /**
   * Try to click login button if enabled (for empty field scenarios)
   */
  async tryClickLoginIfEnabled() {
    if (await this.loginButton.isEnabled()) {
      await this.loginButton.click();
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Assert that we're on the login page
   */
  async assertOnLoginPage() {
    await expect(this.page).toHaveURL(/.*core1-release-identity\.sharedo\.co\.uk.*login.*/);
    await expect(this.page).toHaveTitle(/Login.*ShareDo/);
  }

  /**
   * Assert that login form elements are visible and have correct attributes
   */
  async assertLoginFormVisible() {
    await expect(this.usernameField).toBeVisible();
    await expect(this.passwordField).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Assert login form field attributes
   */
  async assertFormFieldAttributes() {
    await expect(this.usernameField).toHaveAttribute('name', 'username');
    await expect(this.usernameField).toHaveAttribute('type', 'text');
    await expect(this.passwordField).toHaveAttribute('name', 'password');
    await expect(this.passwordField).toHaveAttribute('type', 'password');
    await expect(this.loginButton).toContainText('Login');
  }

  /**
   * Assert that login failed (still on login page)
   */
  async assertLoginFailed() {
    await this.assertOnLoginPage();
    await this.assertLoginFormVisible();
    // Verify we haven't been redirected to the main application
    await expect(this.page).not.toHaveURL(/^https:\/\/core1-release\.sharedo\.co\.uk\/$/);
  }

  /**
   * Assert that login succeeded (redirected to main application)
   */
  async assertLoginSucceeded() {
    // Wait for navigation after successful login
    await this.page.waitForLoadState('networkidle');
    
    // Verify successful login - should be back on main domain, not identity domain
    await expect(this.page).toHaveURL(/.*core1-release\.sharedo\.co\.uk/);
    await expect(this.page).not.toHaveURL(/.*identity.*/);
    
    // Verify we have a meaningful page title (not just login)
    await expect(this.page).toHaveTitle(/worklist|dashboard|home/i);
    
    // Verify we're no longer on the login page by checking login elements are gone
    await expect(this.usernameField).not.toBeVisible();
  }

  /**
   * Open the user menu dropdown
   */
  async openUserMenu() {
    await this.userMenuToggle.click();
    await this.page.waitForTimeout(500); // Wait for dropdown animation
  }

  /**
   * Click the sign out link from the user menu
   */
  async clickSignOut() {
    await this.signOutLink.click();
  }

  /**
   * Complete logout flow (open menu and sign out)
   */
  async logout() {
    await this.openUserMenu();
    await this.clickSignOut();
  }

  /**
   * Assert that user menu is visible and accessible
   */
  async assertUserMenuVisible() {
    await expect(this.userMenuToggle).toBeVisible();
    // Verify it's a dropdown toggle (has the expected class)
    await expect(this.userMenuToggle).toHaveClass(/dropdown-toggle/);
  }

  /**
   * Assert that user menu dropdown is open and contains expected options
   */
  async assertUserMenuDropdownOpen() {
    await expect(this.signOutLink).toBeVisible();
    
    // Check for other expected menu items
    const profileLink = this.page.locator('a:has-text("My profile")');
    
    await expect(profileLink).toBeVisible();
  }

  /**
   * Assert that logout succeeded (back to login page)
   */
  async assertLogoutSucceeded() {
    // Wait for navigation after logout
    await this.page.waitForLoadState('networkidle');
    
    // Verify we're back on the identity/login domain
    await expect(this.page).toHaveURL(/.*core1-release-identity\.sharedo\.co\.uk.*login.*/);
    await expect(this.page).toHaveTitle(/Login.*ShareDo/);
    
    // Verify login form is visible again
    await expect(this.usernameField).toBeVisible();
    await expect(this.passwordField).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Assert that we're in a logged-in state (user menu visible, not on login page)
   */
  async assertLoggedInState() {
    await expect(this.page).toHaveURL(/.*core1-release\.sharedo\.co\.uk/);
    await expect(this.page).not.toHaveURL(/.*identity.*/);
    await this.assertUserMenuVisible();
    await expect(this.usernameField).not.toBeVisible();
  }
} 