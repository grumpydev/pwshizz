import { test } from '@playwright/test';
import { LoginPage } from './pages/login-page';

test.describe('Logout Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    // Navigate and login before each test
    await loginPage.navigate();
    await loginPage.assertOnLoginPage();
    await loginPage.loginWithValidCredentials();
    await loginPage.assertLoginSucceeded();
  });

  test('should successfully log out from the application', async () => {
    // Verify we're in logged-in state
    await loginPage.assertLoggedInState();
    
    // Perform logout
    await loginPage.logout();
    
    // Verify successful logout
    await loginPage.assertLogoutSucceeded();
  });

  test('should display user menu with logout option', async () => {
    // Verify user menu is visible
    await loginPage.assertUserMenuVisible();
    
    // Open user menu dropdown
    await loginPage.openUserMenu();
    
    // Verify dropdown is open with expected options
    await loginPage.assertUserMenuDropdownOpen();
  });

  test('should navigate through user menu and logout step by step', async () => {
    // Step 1: Verify logged-in state
    await loginPage.assertLoggedInState();
    
    // Step 2: Open user menu
    await loginPage.openUserMenu();
    await loginPage.assertUserMenuDropdownOpen();
    
    // Step 3: Click sign out
    await loginPage.clickSignOut();
    
    // Step 4: Verify logout success
    await loginPage.assertLogoutSucceeded();
  });

  test('should maintain session until explicit logout', async () => {
    // Verify we start logged in
    await loginPage.assertLoggedInState();
    
    // Navigate within the application (refresh page)
    await loginPage.page.reload();
    await loginPage.page.waitForLoadState('networkidle');
    
    // Should still be logged in after page refresh
    await loginPage.assertLoggedInState();
    
    // Now logout explicitly
    await loginPage.logout();
    await loginPage.assertLogoutSucceeded();
  });

  test('should not be able to access application after logout', async () => {
    // Start logged in
    await loginPage.assertLoggedInState();
    
    // Logout
    await loginPage.logout();
    await loginPage.assertLogoutSucceeded();
    
    // Try to navigate back to the main application
    await loginPage.page.goto('/');
    
    // Should be redirected back to login page
    await loginPage.assertOnLoginPage();
  });

  test('should handle logout when user menu is already open', async () => {
    // Open user menu first
    await loginPage.openUserMenu();
    await loginPage.assertUserMenuDropdownOpen();
    
    // Click logout while menu is open
    await loginPage.clickSignOut();
    
    // Verify successful logout
    await loginPage.assertLogoutSucceeded();
  });

  test('should handle multiple logout attempts gracefully', async () => {
    // First logout
    await loginPage.logout();
    await loginPage.assertLogoutSucceeded();
    
    // Try to access logout URL directly (should stay on login page)
    await loginPage.page.goto('/security/signout');
    await loginPage.page.waitForLoadState('networkidle');
    
    // Should remain on login page
    await loginPage.assertOnLoginPage();
  });

  test('should clear session and require fresh login after logout', async () => {
    // Logout
    await loginPage.logout();
    await loginPage.assertLogoutSucceeded();
    
    // Try to login again with same credentials
    await loginPage.loginWithValidCredentials();
    
    // Should be able to login successfully again
    await loginPage.assertLoginSucceeded();
    await loginPage.assertLoggedInState();
  });
}); 