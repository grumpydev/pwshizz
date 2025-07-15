import { test, expect } from '@playwright/test';

// Common login function to be used by all tests
async function login(page) {
  await page.goto('https://localhost:44350', { waitUntil: 'networkidle' });
  await page.waitForURL(/.*\/login.*/, { timeout: 10000 });
  await page.waitForLoadState('domcontentloaded');

  // Login with admin credentials
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Login' }).click();

  // Wait for successful login
  await page.waitForURL(/.*(?<!login)$/, { timeout: 10000 });
  await expect(page).toHaveTitle('My Tasks');
}

test.describe('Task Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate between different task views', async ({ page }) => {
    // Wait for the page to be ready
    await page.waitForLoadState('networkidle');

    // Verify task view tabs are present and clickable
    const myTasksTab = page.getByRole('heading', { name: 'My Tasks', level: 3 });
    const overdueTab = page.getByRole('heading', { name: 'Overdue', level: 3 });
    const dueTodayTab = page.getByRole('heading', { name: 'Due Today', level: 3 });

    await expect(myTasksTab).toBeVisible();
    await expect(overdueTab).toBeVisible();
    await expect(dueTodayTab).toBeVisible();

    // Click each tab and verify the table updates
    await overdueTab.click();
    await expect(page.getByText('Overdue by')).toBeVisible();

    await dueTodayTab.click();
    await expect(page.getByText('Due Today')).toBeVisible();

    await myTasksTab.click();
    await expect(page.getByText('Tasks assigned to me')).toBeVisible();

    // Verify task list table headers
    const expectedHeaders = ['Due', 'Reference', 'Client', 'Work Item', 'Type', 'Matter', 'Phase', 'Action'];
    for (const header of expectedHeaders) {
      await expect(page.getByRole('cell', { name: header })).toBeVisible();
    }
  });

  test('should navigate through left menu items', async ({ page }) => {
    // Verify all menu items under "My Worklist" are present and clickable
    const menuItems = [
      'My Tasks',
      'My Notifications',
      'My Approvals',
      'My Delegated',
      'My Calendar',
      'Document Expectations'
    ];

    for (const item of menuItems) {
      const menuItem = page.getByRole('generic', { name: item });
      await expect(menuItem).toBeVisible();
      await menuItem.click();
      // Wait for navigation or content update
      await page.waitForLoadState('networkidle');
    }
  });

  test('should test task list functionality', async ({ page }) => {
    // Test the "All cases" search box
    const searchBox = page.getByRole('textbox', { name: 'All cases' });
    await expect(searchBox).toBeVisible();
    await searchBox.fill('test search');
    await page.waitForLoadState('networkidle');

    // Test column sorting
    const sortableColumns = ['Due', 'Reference', 'Client', 'Work Item', 'Type', 'Matter', 'Phase'];
    for (const column of sortableColumns) {
      const columnHeader = page.getByRole('cell', { name: column });
      await columnHeader.click();
      await page.waitForLoadState('networkidle');
      // Click again for reverse sort
      await columnHeader.click();
      await page.waitForLoadState('networkidle');
    }

    // Test task selection checkbox
    const checkbox = page.getByRole('checkbox').first();
    if (await checkbox.isVisible()) {
      await checkbox.check();
      await expect(checkbox).toBeChecked();
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    }
  });

  test('should interact with Worklist Radar', async ({ page }) => {
    // Verify Worklist Radar section
    const worklistRadar = page.getByRole('heading', { name: 'Worklist Radar', level: 3 });
    await expect(worklistRadar).toBeVisible();

    // Click to expand/collapse
    await worklistRadar.click();
    // Wait for animation
    await page.waitForTimeout(500);

    // Click again to verify toggle
    await worklistRadar.click();
    await page.waitForTimeout(500);
  });
}); 