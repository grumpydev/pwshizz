import { test, expect } from '@playwright/test';
import { DocumentAdminPage } from './pages/document-admin-page';

test.describe('Document Template Management', () => {
  let documentAdminPage: DocumentAdminPage;

  test.beforeEach(async ({ page }) => {
    documentAdminPage = new DocumentAdminPage(page);
    await documentAdminPage.loginAndNavigate();
  });

  test('should display document template usage analytics', async () => {
    await documentAdminPage.assertOnDocumentAdminPortal();
    
    // Verify main document template section is visible
    await expect(documentAdminPage.documentTemplateUsageSection).toBeVisible();
    
    // Get analytics data for document templates
    const templateData = await documentAdminPage.getAnalyticsData('Document Template Usage');
    expect(templateData.sectionName).toBe('Document Template Usage');
  });

  test('should display document template usage by user', async () => {
    await expect(documentAdminPage.documentTemplateUsageByUserSection).toBeVisible();
    
    // Get user-specific analytics data
    const userTemplateData = await documentAdminPage.getAnalyticsData('Document Template Usage by User');
    expect(userTemplateData.sectionName).toBe('Document Template Usage by User');
  });

  test('should display document template usage over time', async () => {
    await expect(documentAdminPage.documentTemplateUsageOverTimeSection).toBeVisible();
    
    // Get time-based analytics data
    const timeTemplateData = await documentAdminPage.getAnalyticsData('Document Template Usage over Time');
    expect(timeTemplateData.sectionName).toBe('Document Template Usage over Time');
  });

  test('should interact with document template usage section', async () => {
    // Click on the document template usage section
    await documentAdminPage.clickUsageSection('Document Template Usage');
    
    // Verify no errors occurred during interaction
    await documentAdminPage.assertNoErrors();
    
    // Verify still on document admin portal
    await documentAdminPage.assertOnDocumentAdminPortal();
  });

  test('should verify document template analytics data structure', async () => {
    await documentAdminPage.waitForAnalyticsDataLoad();
    
    const templateData = await documentAdminPage.getAnalyticsData('Document Template Usage');
    
    // Verify the data structure contains expected elements
    expect(templateData).toHaveProperty('sectionName');
    expect(templateData).toHaveProperty('hasTable');
    expect(templateData).toHaveProperty('hasChart');
    expect(templateData).toHaveProperty('hasDataElements');
    expect(templateData).toHaveProperty('totalElements');
    
    // Log analytics findings for debugging
    console.log('Document Template Analytics:', templateData);
  });

  test('should search for specific document templates if search functionality exists', async () => {
    const searchPerformed = await documentAdminPage.searchForTemplate('contract');
    
    if (searchPerformed) {
      // If search was performed, verify no errors
      await documentAdminPage.assertNoErrors();
      console.log('Search functionality is available');
    } else {
      console.log('Search functionality not found - this is expected for analytics-only view');
    }
  });

  test('should handle document template section navigation', async () => {
    // Start at document template section
    await expect(documentAdminPage.documentTemplateUsageSection).toBeVisible();
    
    // Navigate to other template sections and back
    await documentAdminPage.clickUsageSection('Content Block Usage');
    await documentAdminPage.clickUsageSection('Email Template Usage');
    await documentAdminPage.clickUsageSection('SMS Template Usage');
    
    // Return to document templates
    await documentAdminPage.clickUsageSection('Document Template Usage');
    
    // Verify still properly functioning
    await expect(documentAdminPage.documentTemplateUsageSection).toBeVisible();
    await documentAdminPage.assertNoErrors();
  });

  test('should verify all document template related sections are functional', async () => {
    const templateSections = [
      'Document Template Usage',
      'Document Template Usage by User',
      'Document Template Usage over Time'
    ];
    
    for (const section of templateSections) {
      await documentAdminPage.clickUsageSection(section);
      await documentAdminPage.page.waitForTimeout(1000);
      
      // Verify section interaction doesn't cause errors
      await documentAdminPage.assertNoErrors();
      
      // Get analytics data for the section
      const sectionData = await documentAdminPage.getAnalyticsData(section);
      expect(sectionData.sectionName).toBe(section);
      
      console.log(`${section} verification completed:`, sectionData);
    }
  });

  test('should maintain document template view state across page interactions', async () => {
    // Initial state verification
    await expect(documentAdminPage.documentTemplateUsageSection).toBeVisible();
    
    // Interact with document template section
    await documentAdminPage.clickUsageSection('Document Template Usage');
    await documentAdminPage.page.waitForTimeout(2000);
    
    // Verify state is maintained
    await expect(documentAdminPage.documentTemplateUsageSection).toBeVisible();
    await documentAdminPage.assertOnDocumentAdminPortal();
    
    // Refresh page and verify persistence
    await documentAdminPage.page.reload();
    await documentAdminPage.waitForPageLoad();
    
    // Should still be on portal with document template section visible
    await expect(documentAdminPage.documentTemplateUsageSection).toBeVisible();
    await documentAdminPage.assertOnDocumentAdminPortal();
  });

  test('should verify document template analytics accessibility', async () => {
    // Verify document template sections are accessible
    const documentTemplateSection = documentAdminPage.page.locator('h3:has-text("Document Template Usage")').first();
    const userTemplateSection = documentAdminPage.page.locator('h3:has-text("Document Template Usage by User")');
    const timeTemplateSection = documentAdminPage.page.locator('h3:has-text("Document Template Usage over Time")');
    
    // Verify all sections have proper headings
    await expect(documentTemplateSection).toBeVisible();
    await expect(userTemplateSection).toBeVisible();
    await expect(timeTemplateSection).toBeVisible();
    
    // Verify sections can be focused (accessibility)
    await documentTemplateSection.focus();
    await userTemplateSection.focus();
    await timeTemplateSection.focus();
    
    await documentAdminPage.assertNoErrors();
  });

  test('should take screenshot of document template analytics', async () => {
    await documentAdminPage.waitForAnalyticsDataLoad();
    await documentAdminPage.takeScreenshot('document-template-analytics');
    
    // Verify screenshot was taken without errors
    await documentAdminPage.assertNoErrors();
  });

  test('should verify document template permissions and access', async () => {
    // Verify admin has access to document template analytics
    await documentAdminPage.checkAdminPermissions();
    
    // Specifically verify document template sections are accessible
    await expect(documentAdminPage.documentTemplateUsageSection).toBeVisible();
    await expect(documentAdminPage.documentTemplateUsageByUserSection).toBeVisible();
    await expect(documentAdminPage.documentTemplateUsageOverTimeSection).toBeVisible();
    
    // Verify no access restrictions are blocking template analytics
    await documentAdminPage.assertNoErrors();
  });

  test('should handle document template section error scenarios', async () => {
    // Try to access a non-existent template section
    const nonExistentSection = documentAdminPage.page.locator('h3:has-text("Non-existent Template Section")');
    await expect(nonExistentSection).not.toBeVisible();
    
    // Verify real sections still work
    await expect(documentAdminPage.documentTemplateUsageSection).toBeVisible();
    
    // Verify no errors from non-existent section checks
    await documentAdminPage.assertNoErrors();
  });

  test('should verify document template analytics load time performance', async () => {
    const startTime = Date.now();
    
    // Navigate to fresh portal instance
    await documentAdminPage.navigate();
    await documentAdminPage.waitForPageLoad();
    
    // Wait for analytics to load
    await documentAdminPage.waitForAnalyticsDataLoad();
    
    const loadTime = Date.now() - startTime;
    
    // Verify reasonable load time (under 30 seconds)
    expect(loadTime).toBeLessThan(30000);
    
    console.log(`Document template analytics loaded in ${loadTime}ms`);
    
    // Verify all template sections are visible after loading
    await documentAdminPage.assertMainUsageSectionsVisible();
  });
}); 