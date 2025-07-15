import { test, expect } from '@playwright/test';

// Create a test fixture that handles login
test.beforeEach(async ({ page, context }) => {
  await page.goto('https://localhost:44350');
  
  await page.fill('[name="username"]', "admin");
  await page.fill('[name="password"]', "password");

  // Click Login
  await page.click(`.action-button:has-text("Login")`);

  // Wait for navigation after login
  await page.waitForURL('https://localhost:44350/', { timeout: 10000 });

  // Verify successful login by checking the page title and URL
  await expect(page).toHaveTitle('My Tasks');

  // Verify user is logged in by checking for the specific "System Admin" link in navigation
  await expect(page.getByRole('link', { name: 'System Admin' })).toBeVisible();
});

test('should login with admin credentials', async ({ page }) => {
  // The login is handled by beforeEach, just verify we're on the dashboard
  await expect(page).toHaveTitle('My Tasks');
});

test('should be able to create a new B2C private client enquiry', async ({ page }) => {
  // Wait for the page to be ready
  await page.waitForLoadState('networkidle');

  // Wait for and click the plus icon in the navigation
  const plusButton = page.locator('.primary-nav.fa-plus');
  await plusButton.waitFor({ state: 'visible', timeout: 10000 });
  await plusButton.click();

  // Wait for and click the "Enquiry B2C - Private Client" option
  const enquiryOption = page.getByText('Enquiry B2C - Private Client', { exact: true });
  await enquiryOption.waitFor({ state: 'visible', timeout: 10000 });
  await enquiryOption.click();

  // Click the "Customer Enquiry" option
  const customerEnquiryOption = page.getByRole('heading', { name: 'Customer Enquiry', level: 3 });
  await customerEnquiryOption.waitFor({ state: 'visible', timeout: 10000 });
  await customerEnquiryOption.click();

  // Click the "Private Client" option
  const privateClientOption = page.getByRole('heading', { name: 'Private Client', level: 3 });
  await privateClientOption.waitFor({ state: 'visible', timeout: 10000 });
  await privateClientOption.click();

  // Click the "General" option
  const generalOption = page.getByRole('heading', { name: 'General', level: 3 });
  await generalOption.waitFor({ state: 'visible', timeout: 10000 });
  await generalOption.click();

  // Click the new General button and verify the panel appears
  const newGeneralButton = page.getByRole('heading', { name: 'General', level: 3 }).last();
  await newGeneralButton.waitFor({ state: 'visible', timeout: 10000 });
  await newGeneralButton.click();

  // Verify the "New Instruction B2C Enquiry" panel appears
  const newInstructionPanel = page.getByRole('heading', { name: 'New Instruction B2C Enquiry*', exact: true });
  await expect(newInstructionPanel).toBeVisible({ timeout: 10000 });
}); 