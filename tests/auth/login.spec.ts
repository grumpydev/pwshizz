import { test } from '@playwright/test';
import { LoginPage } from './pages/login-page';
import { testConfig } from '../config/test-config';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.assertOnLoginPage();
  });

  test('should successfully log in with valid credentials', async () => {
    // Verify login form is displayed correctly
    await loginPage.assertLoginFormVisible();
    
    // Perform login with valid credentials
    await loginPage.loginWithValidCredentials();
    
    // Verify successful login
    await loginPage.assertLoginSucceeded();
  });

  test('should display login form elements correctly', async () => {
    // Verify login form elements are present and correctly configured
    await loginPage.assertLoginFormVisible();
    await loginPage.assertFormFieldAttributes();
  });

  test('should fail to login with invalid username', async () => {
    // Attempt login with invalid username and valid password
    await loginPage.attemptLogin('invalid_user', testConfig.testUser.password);
    
    // Verify login failed
    await loginPage.assertLoginFailed();
  });

  test('should fail to login with invalid password', async () => {
    // Attempt login with valid username and invalid password
    await loginPage.attemptLogin(testConfig.testUser.username, 'wrong_password');
    
    // Verify login failed
    await loginPage.assertLoginFailed();
  });

  test('should fail to login with both invalid username and password', async () => {
    // Attempt login with both invalid credentials
    await loginPage.attemptLogin('invalid_user', 'wrong_password');
    
    // Verify login failed
    await loginPage.assertLoginFailed();
  });

  test('should handle empty credentials appropriately', async () => {
    // Fill empty credentials and try to submit
    await loginPage.fillCredentials('', '');
    await loginPage.tryClickLoginIfEnabled();
    
    // Verify still on login page
    await loginPage.assertLoginFailed();
  });

  test('should handle empty username with valid password', async () => {
    // Fill empty username with valid password
    await loginPage.fillCredentials('', testConfig.testUser.password);
    await loginPage.tryClickLoginIfEnabled();
    
    // Verify still on login page
    await loginPage.assertLoginFailed();
  });

  test('should handle valid username with empty password', async () => {
    // Fill valid username with empty password
    await loginPage.fillCredentials(testConfig.testUser.username, '');
    await loginPage.tryClickLoginIfEnabled();
    
    // Verify still on login page
    await loginPage.assertLoginFailed();
  });
}); 