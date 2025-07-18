import { test, expect } from '@playwright/test';
import { DocumentAdminPage } from './pages/document-admin-page';

test.describe('Template Analytics Management', () => {
  let documentAdminPage: DocumentAdminPage;

  test.beforeEach(async ({ page }) => {
    documentAdminPage = new DocumentAdminPage(page);
    await documentAdminPage.loginAndNavigate();
  });

  test.describe('Content Block Management', () => {
    test('should display content block usage analytics', async () => {
      await expect(documentAdminPage.contentBlockUsageSection).toBeVisible();
      
      const contentBlockData = await documentAdminPage.getAnalyticsData('Content Block Usage');
      expect(contentBlockData.sectionName).toBe('Content Block Usage');
    });

    test('should display content block usage by user', async () => {
      await expect(documentAdminPage.contentBlockUsageByUserSection).toBeVisible();
      
      const userContentBlockData = await documentAdminPage.getAnalyticsData('Content Block Usage by User');
      expect(userContentBlockData.sectionName).toBe('Content Block Usage by User');
    });

    test('should display content block usage over time', async () => {
      await expect(documentAdminPage.contentBlockUsageOverTimeSection).toBeVisible();
      
      const timeContentBlockData = await documentAdminPage.getAnalyticsData('Content Block Usage over Time');
      expect(timeContentBlockData.sectionName).toBe('Content Block Usage over Time');
    });

    test('should verify content block analytics interaction', async () => {
      await documentAdminPage.clickUsageSection('Content Block Usage');
      await documentAdminPage.assertNoErrors();
      await documentAdminPage.assertOnDocumentAdminPortal();
    });
  });

  test.describe('Email Template Management', () => {
    test('should display email template usage analytics', async () => {
      await expect(documentAdminPage.emailTemplateUsageSection).toBeVisible();
      
      const emailTemplateData = await documentAdminPage.getAnalyticsData('Email Template Usage');
      expect(emailTemplateData.sectionName).toBe('Email Template Usage');
    });

    test('should display email template usage by user', async () => {
      await expect(documentAdminPage.emailTemplateUsageByUserSection).toBeVisible();
      
      const userEmailTemplateData = await documentAdminPage.getAnalyticsData('Email Template Usage by User');
      expect(userEmailTemplateData.sectionName).toBe('Email Template Usage by User');
    });

    test('should display email template usage over time', async () => {
      await expect(documentAdminPage.emailTemplateUsageOverTimeSection).toBeVisible();
      
      const timeEmailTemplateData = await documentAdminPage.getAnalyticsData('Email Template Usage over Time');
      expect(timeEmailTemplateData.sectionName).toBe('Email Template Usage over Time');
    });

    test('should verify email template analytics interaction', async () => {
      await documentAdminPage.clickUsageSection('Email Template Usage');
      await documentAdminPage.assertNoErrors();
      await documentAdminPage.assertOnDocumentAdminPortal();
    });
  });

  test.describe('SMS Template Management', () => {
    test('should display SMS template usage analytics', async () => {
      await expect(documentAdminPage.smsTemplateUsageSection).toBeVisible();
      
      const smsTemplateData = await documentAdminPage.getAnalyticsData('SMS Template Usage');
      expect(smsTemplateData.sectionName).toBe('SMS Template Usage');
    });

    test('should display SMS template usage by user', async () => {
      await expect(documentAdminPage.smsTemplateUsageByUserSection).toBeVisible();
      
      const userSmsTemplateData = await documentAdminPage.getAnalyticsData('SMS Template Usage by User');
      expect(userSmsTemplateData.sectionName).toBe('SMS Template Usage by User');
    });

    test('should display SMS template usage over time', async () => {
      await expect(documentAdminPage.smsTemplateUsageOverTimeSection).toBeVisible();
      
      const timeSmsTemplateData = await documentAdminPage.getAnalyticsData('SMS Template Usage over Time');
      expect(timeSmsTemplateData.sectionName).toBe('SMS Template Usage over Time');
    });

    test('should verify SMS template analytics interaction', async () => {
      await documentAdminPage.clickUsageSection('SMS Template Usage');
      await documentAdminPage.assertNoErrors();
      await documentAdminPage.assertOnDocumentAdminPortal();
    });
  });

  test.describe('Cross-Template Analytics', () => {
    test('should compare all template usage statistics', async () => {
      await documentAdminPage.waitForAnalyticsDataLoad();
      
      const allStats = await documentAdminPage.getAllUsageStatistics();
      
      // Verify all template types are present
      expect(allStats.documentTemplates).toBeDefined();
      expect(allStats.contentBlocks).toBeDefined();
      expect(allStats.emailTemplates).toBeDefined();
      expect(allStats.smsTemplates).toBeDefined();
      
      // Log statistics for analysis
      console.log('All Template Usage Statistics:', allStats);
      
      // Verify each has the correct section name
      expect(allStats.documentTemplates.sectionName).toBe('Document Template Usage');
      expect(allStats.contentBlocks.sectionName).toBe('Content Block Usage');
      expect(allStats.emailTemplates.sectionName).toBe('Email Template Usage');
      expect(allStats.smsTemplates.sectionName).toBe('SMS Template Usage');
    });

    test('should navigate between all template types', async () => {
      const templateTypes = [
        'Document Template Usage',
        'Content Block Usage',
        'Email Template Usage',
        'SMS Template Usage'
      ];
      
      for (const templateType of templateTypes) {
        await documentAdminPage.clickUsageSection(templateType);
        await documentAdminPage.page.waitForTimeout(1000);
        
        // Verify navigation works for each template type
        await documentAdminPage.assertNoErrors();
        await documentAdminPage.assertOnDocumentAdminPortal();
        
        console.log(`Successfully navigated to ${templateType}`);
      }
    });

    test('should verify all user-specific analytics are accessible', async () => {
      const userAnalyticsSections = [
        'Document Template Usage by User',
        'Content Block Usage by User',
        'Email Template Usage by User',
        'SMS Template Usage by User'
      ];
      
      for (const section of userAnalyticsSections) {
        const sectionData = await documentAdminPage.getAnalyticsData(section);
        expect(sectionData.sectionName).toBe(section);
        
        await documentAdminPage.clickUsageSection(section);
        await documentAdminPage.assertNoErrors();
        
        console.log(`${section} verified:`, sectionData);
      }
    });

    test('should verify all time-based analytics are accessible', async () => {
      const timeAnalyticsSections = [
        'Document Template Usage over Time',
        'Content Block Usage over Time',
        'Email Template Usage over Time',
        'SMS Template Usage over Time'
      ];
      
      for (const section of timeAnalyticsSections) {
        const sectionData = await documentAdminPage.getAnalyticsData(section);
        expect(sectionData.sectionName).toBe(section);
        
        await documentAdminPage.clickUsageSection(section);
        await documentAdminPage.assertNoErrors();
        
        console.log(`${section} verified:`, sectionData);
      }
    });

    test('should test template search functionality across all types', async () => {
      const searchTerms = ['template', 'content', 'email', 'sms', 'test'];
      
      for (const searchTerm of searchTerms) {
        const searchPerformed = await documentAdminPage.searchForTemplate(searchTerm);
        
        if (searchPerformed) {
          await documentAdminPage.assertNoErrors();
          console.log(`Search performed for: ${searchTerm}`);
          
          // Wait between searches
          await documentAdminPage.page.waitForTimeout(1000);
        }
      }
    });

    test('should verify analytics data consistency across refresh', async () => {
      // Get initial analytics data
      const initialStats = await documentAdminPage.getAllUsageStatistics();
      
      // Refresh the page
      await documentAdminPage.page.reload();
      await documentAdminPage.waitForPageLoad();
      await documentAdminPage.waitForAnalyticsDataLoad();
      
      // Get analytics data after refresh
      const refreshedStats = await documentAdminPage.getAllUsageStatistics();
      
      // Verify data structure consistency
      expect(refreshedStats.documentTemplates.sectionName).toBe(initialStats.documentTemplates.sectionName);
      expect(refreshedStats.contentBlocks.sectionName).toBe(initialStats.contentBlocks.sectionName);
      expect(refreshedStats.emailTemplates.sectionName).toBe(initialStats.emailTemplates.sectionName);
      expect(refreshedStats.smsTemplates.sectionName).toBe(initialStats.smsTemplates.sectionName);
      
      console.log('Analytics data consistency verified across page refresh');
    });

    test('should take screenshots of all template analytics sections', async () => {
      await documentAdminPage.waitForAnalyticsDataLoad();
      
      // Take overall screenshot
      await documentAdminPage.takeScreenshot('all-template-analytics-overview');
      
      // Take screenshots of each section
      const sections = [
        'Document Template Usage',
        'Content Block Usage',
        'Email Template Usage',
        'SMS Template Usage'
      ];
      
      for (const section of sections) {
        await documentAdminPage.clickUsageSection(section);
        await documentAdminPage.page.waitForTimeout(1000);
        
        const screenshotName = section.toLowerCase().replace(/\s+/g, '-');
        await documentAdminPage.takeScreenshot(`${screenshotName}-detail`);
      }
      
      await documentAdminPage.assertNoErrors();
    });

    test('should verify template analytics performance across all sections', async () => {
      const startTime = Date.now();
      
      // Navigate through all sections
      const allSections = [
        'Document Template Usage',
        'Content Block Usage',
        'Email Template Usage',
        'SMS Template Usage',
        'Document Template Usage by User',
        'Content Block Usage by User',
        'Email Template Usage by User',
        'SMS Template Usage by User',
        'Document Template Usage over Time',
        'Content Block Usage over Time',
        'Email Template Usage over Time',
        'SMS Template Usage over Time'
      ];
      
      for (const section of allSections) {
        await documentAdminPage.clickUsageSection(section);
        await documentAdminPage.page.waitForTimeout(500);
      }
      
      const totalTime = Date.now() - startTime;
      
      // Verify reasonable performance (under 60 seconds for all sections)
      expect(totalTime).toBeLessThan(60000);
      
      console.log(`All template analytics sections loaded in ${totalTime}ms`);
      
      // Verify all sections still working after performance test
      await documentAdminPage.assertAllDashboardSectionsPresent();
      await documentAdminPage.assertNoErrors();
    });
  });
}); 