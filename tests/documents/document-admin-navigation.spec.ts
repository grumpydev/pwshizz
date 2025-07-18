import { test, expect } from '@playwright/test';
import { DocumentAdminPage } from './pages/document-admin-page';

test.describe('Document Admin Portal Navigation', () => {
  let documentAdminPage: DocumentAdminPage;

  test.beforeEach(async ({ page }) => {
    documentAdminPage = new DocumentAdminPage(page);
    await documentAdminPage.loginAndNavigate();
  });

  test('should successfully access document admin portal', async () => {
    await documentAdminPage.assertOnDocumentAdminPortal();
    await documentAdminPage.assertNoErrors();
  });

  test('should display all main usage analytics sections', async () => {
    await documentAdminPage.assertMainUsageSectionsVisible();
  });

  test('should display user-specific analytics sections', async () => {
    await documentAdminPage.assertUserAnalyticsSectionsVisible();
  });

  test('should display time-based analytics sections', async () => {
    await documentAdminPage.assertTimeAnalyticsSectionsVisible();
  });

  test('should display complete dashboard with all sections', async () => {
    await documentAdminPage.assertAllDashboardSectionsPresent();
  });

  test('should load analytics data successfully', async () => {
    await documentAdminPage.waitForAnalyticsDataLoad();
    
    // Get usage statistics for verification
    const stats = await documentAdminPage.getAllUsageStatistics();
    
    // Verify that each section exists (even if no data)
    expect(stats.documentTemplates.sectionName).toBe('Document Template Usage');
    expect(stats.contentBlocks.sectionName).toBe('Content Block Usage');
    expect(stats.emailTemplates.sectionName).toBe('Email Template Usage');
    expect(stats.smsTemplates.sectionName).toBe('SMS Template Usage');
  });

  test('should have proper page title and URL', async () => {
    await expect(documentAdminPage.page).toHaveTitle(/Dashboard.*Document Assembly Administration/);
    await expect(documentAdminPage.page).toHaveURL(/.*\/admin-documents/);
  });

  test('should allow logout from document admin portal', async () => {
    await documentAdminPage.logout();
    await documentAdminPage.assertLogoutSucceeded();
  });

  test('should verify admin permissions are working', async () => {
    await documentAdminPage.checkAdminPermissions();
  });

  test('should handle direct URL access to admin portal', async ({ page }) => {
    // Create new page instance to test direct access
    const newDocumentAdminPage = new DocumentAdminPage(page);
    
    // Try to access portal directly without going through main app first
    await newDocumentAdminPage.navigate();
    
    // Should either be on portal (if already authenticated) or redirected to login
    const currentUrl = await page.url();
    
    if (currentUrl.includes('login') || currentUrl.includes('identity')) {
      // If redirected to login, that's expected behavior for direct access
      await expect(page.locator('#username')).toBeVisible();
    } else {
      // If already authenticated, should be on admin portal
      await newDocumentAdminPage.assertOnDocumentAdminPortal();
    }
  });

  test('should get all section headers for verification', async () => {
    const headers = await documentAdminPage.getAllSectionHeaders();
    
    // Verify expected sections are present
    expect(headers).toContain('Document Template Usage');
    expect(headers).toContain('Content Block Usage');
    expect(headers).toContain('Email Template Usage');
    expect(headers).toContain('SMS Template Usage');
    expect(headers).toContain('Document Template Usage by User');
    expect(headers).toContain('Content Block Usage by User');
    expect(headers).toContain('Email Template Usage by User');
    expect(headers).toContain('SMS Template Usage by User');
    expect(headers).toContain('Document Template Usage over Time');
    expect(headers).toContain('Content Block Usage over Time');
    expect(headers).toContain('Email Template Usage over Time');
    expect(headers).toContain('SMS Template Usage over Time');
  });

  test('should maintain session when navigating within portal', async () => {
    // Verify we're authenticated
    await documentAdminPage.assertOnDocumentAdminPortal();
    
    // Refresh the page
    await documentAdminPage.page.reload();
    await documentAdminPage.waitForPageLoad();
    
    // Should still be authenticated and on portal
    await documentAdminPage.assertOnDocumentAdminPortal();
    await documentAdminPage.assertAllDashboardSectionsPresent();
  });

  test('should verify portal functionality is working', async () => {
    await documentAdminPage.verifyPortalFunctionality();
  });
}); 