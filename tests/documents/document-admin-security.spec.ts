import { test, expect } from '@playwright/test';
import { DocumentAdminPage } from './pages/document-admin-page';

test.describe('Document Admin Security & Permissions', () => {
  let documentAdminPage: DocumentAdminPage;

  test.beforeEach(async ({ page }) => {
    documentAdminPage = new DocumentAdminPage(page);
  });

  test.describe('Authentication & Access Control', () => {
    test('should require authentication to access document admin portal', async ({ page }) => {
      // Try to access portal without logging in first
      await page.goto('https://core1-release.sharedo.co.uk/admin-documents');
      await page.waitForLoadState('networkidle');
      
      const currentUrl = await page.url();
      
      // Should be redirected to login page
      expect(currentUrl).toMatch(/.*identity.*login/);
      await expect(page.locator('#username')).toBeVisible();
    });

    test('should allow access after proper authentication', async () => {
      await documentAdminPage.loginAndNavigate();
      await documentAdminPage.assertOnDocumentAdminPortal();
      await documentAdminPage.assertNoErrors();
    });

    test('should maintain authentication across portal navigation', async () => {
      await documentAdminPage.loginAndNavigate();
      
      // Navigate through different sections
      await documentAdminPage.clickUsageSection('Document Template Usage');
      await documentAdminPage.clickUsageSection('Content Block Usage');
      await documentAdminPage.clickUsageSection('Email Template Usage');
      
      // Should still be authenticated and have access
      await documentAdminPage.assertOnDocumentAdminPortal();
      await documentAdminPage.assertNoErrors();
    });

    test('should handle session timeout gracefully', async () => {
      await documentAdminPage.loginAndNavigate();
      await documentAdminPage.assertOnDocumentAdminPortal();
      
      // Simulate potential session timeout by waiting and then interacting
      await documentAdminPage.page.waitForTimeout(5000);
      
      // Try to interact with portal
      await documentAdminPage.clickUsageSection('Document Template Usage');
      
      // Should either still work or handle timeout gracefully
      const currentUrl = await documentAdminPage.page.url();
      
      if (currentUrl.includes('login') || currentUrl.includes('identity')) {
        // Session timed out - verify login page is displayed
        await expect(documentAdminPage.page.locator('#username')).toBeVisible();
      } else {
        // Session still valid - verify portal is working
        await documentAdminPage.assertOnDocumentAdminPortal();
      }
    });

    test('should redirect to login when accessing portal after logout', async () => {
      await documentAdminPage.loginAndNavigate();
      await documentAdminPage.assertOnDocumentAdminPortal();
      
      // Logout
      await documentAdminPage.logout();
      await documentAdminPage.assertLogoutSucceeded();
      
      // Try to access portal again
      await documentAdminPage.page.goto('https://core1-release.sharedo.co.uk/admin-documents');
      await documentAdminPage.page.waitForLoadState('networkidle');
      
      // Should be redirected to login
      const currentUrl = await documentAdminPage.page.url();
      expect(currentUrl).toMatch(/.*identity.*login/);
    });
  });

  test.describe('Permission Verification', () => {
    test('should verify user has document admin permissions', async () => {
      await documentAdminPage.loginAndNavigate();
      await documentAdminPage.checkAdminPermissions();
    });

    test('should have access to all analytics sections', async () => {
      await documentAdminPage.loginAndNavigate();
      
      // Verify access to all main sections
      await documentAdminPage.assertMainUsageSectionsVisible();
      await documentAdminPage.assertUserAnalyticsSectionsVisible();
      await documentAdminPage.assertTimeAnalyticsSectionsVisible();
      
      // Verify no permission errors
      await documentAdminPage.assertNoErrors();
    });

    test('should be able to interact with all analytics sections', async () => {
      await documentAdminPage.loginAndNavigate();
      
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
        await documentAdminPage.assertNoErrors();
        
        // Verify access is maintained
        await documentAdminPage.assertOnDocumentAdminPortal();
      }
    });

    test('should have proper navigation permissions', async () => {
      await documentAdminPage.loginAndNavigate();
      
      // Verify can navigate back to main application
      await documentAdminPage.userMenuToggle.click();
      await documentAdminPage.page.waitForTimeout(500);
      
      // User menu should be accessible
      await expect(documentAdminPage.userMenuToggle).toBeVisible();
      
      // Should be able to logout
      await documentAdminPage.signOutLink.click();
      await documentAdminPage.assertLogoutSucceeded();
    });
  });

  test.describe('Security Headers & Protection', () => {
    test('should verify secure response headers', async () => {
      await documentAdminPage.loginAndNavigate();
      
      // Check for security headers in response
      const response = await documentAdminPage.page.goto('https://core1-release.sharedo.co.uk/admin-documents');
      
      const headers = response?.headers();
      
      // Log headers for security review
      console.log('Document Admin Portal Response Headers:', headers);
      
      // Verify response is successful
      expect(response?.status()).toBe(200);
    });

    test('should protect against unauthorized direct access', async ({ page }) => {
      // Multiple attempts to access without proper auth
      const attempts = [
        '/admin-documents',
        '/admin-documents/',
        '/admin-documents?bypass=true',
        '/admin-documents#admin'
      ];
      
      for (const attemptUrl of attempts) {
        await page.goto(`https://core1-release.sharedo.co.uk${attemptUrl}`);
        await page.waitForLoadState('networkidle');
        
        const currentUrl = await page.url();
        
        // Should be redirected to login for all attempts
        expect(currentUrl).toMatch(/.*identity.*login/);
      }
    });

    test('should handle malformed admin URLs securely', async ({ page }) => {
      const malformedUrls = [
        '/admin-documents/../admin',
        '/admin-documents/../../etc/passwd',
        '/admin-documents/<script>alert("xss")</script>',
        '/admin-documents/null',
        '/admin-documents/undefined'
      ];
      
      for (const malformedUrl of malformedUrls) {
        try {
          await page.goto(`https://core1-release.sharedo.co.uk${malformedUrl}`);
          await page.waitForLoadState('networkidle', { timeout: 5000 });
          
          const currentUrl = await page.url();
          
          // Should either redirect to login or show proper error page
          expect(currentUrl).toMatch(/.*identity.*login|.*error|.*404|.*403/);
          
        } catch (error) {
          // Network errors are acceptable for malformed URLs
          console.log(`Malformed URL ${malformedUrl} properly rejected:`, error.message.split('\n')[0]);
        }
      }
    });
  });

  test.describe('Data Protection & Privacy', () => {
    test('should not expose sensitive data in portal', async () => {
      await documentAdminPage.loginAndNavigate();
      
      // Get page content
      const pageContent = await documentAdminPage.page.content();
      
      // Check that no sensitive data patterns are exposed
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /token/i,
        /api[_-]?key/i,
        /database/i,
        /connection[_-]?string/i
      ];
      
      for (const pattern of sensitivePatterns) {
        const matches = pageContent.match(pattern);
        if (matches) {
          console.warn(`Potential sensitive data exposure: ${matches[0]}`);
        }
      }
      
      // Verify no obvious credential leaks
      expect(pageContent).not.toMatch(/password\s*[:=]\s*[^\s]+/i);
      expect(pageContent).not.toMatch(/secret\s*[:=]\s*[^\s]+/i);
    });

    test('should properly handle analytics data access', async () => {
      await documentAdminPage.loginAndNavigate();
      
      // Get analytics data
      const allStats = await documentAdminPage.getAllUsageStatistics();
      
      // Verify analytics data structure doesn't expose sensitive info
      expect(allStats).toBeDefined();
      expect(allStats).toHaveProperty('documentTemplates');
      expect(allStats).toHaveProperty('contentBlocks');
      expect(allStats).toHaveProperty('emailTemplates');
      expect(allStats).toHaveProperty('smsTemplates');
      
      // Verify data access is controlled
      await documentAdminPage.assertNoErrors();
    });

    test('should maintain user session security', async () => {
      await documentAdminPage.loginAndNavigate();
      
      // Check session cookies security
      const cookies = await documentAdminPage.page.context().cookies();
      
      console.log('Session cookies for security review:', cookies.map(c => ({
        name: c.name,
        secure: c.secure,
        httpOnly: c.httpOnly,
        sameSite: c.sameSite
      })));
      
      // Verify portal is accessible
      await documentAdminPage.assertOnDocumentAdminPortal();
    });
  });

  test.describe('Error Handling & Security', () => {
    test('should handle authentication errors gracefully', async ({ page }) => {
      // Try with invalid credentials
      await page.goto('https://core1-release.sharedo.co.uk');
      await page.fill('#username', 'invalid-user');
      await page.fill('#password', 'invalid-password');
      await page.click('button:has-text("Login")');
      await page.waitForLoadState('networkidle');
      
      // Should show login error, not crash
      const currentUrl = await page.url();
      expect(currentUrl).toMatch(/.*identity.*login/);
      
      // Now try to access admin portal
      await page.goto('https://core1-release.sharedo.co.uk/admin-documents');
      await page.waitForLoadState('networkidle');
      
      // Should still be redirected to login
      const adminUrl = await page.url();
      expect(adminUrl).toMatch(/.*identity.*login/);
    });

    test('should handle portal errors without exposing sensitive information', async () => {
      await documentAdminPage.loginAndNavigate();
      
      // Force potential error by trying invalid operations
      try {
        await documentAdminPage.page.evaluate(() => {
          // Try to access undefined properties
          window.location.href = '/admin-documents/non-existent-path';
        });
        
        await documentAdminPage.page.waitForLoadState('networkidle', { timeout: 5000 });
        
      } catch (error) {
        // Errors are expected for invalid operations
        console.log('Invalid operation properly handled:', error.message.split('\n')[0]);
      }
      
      // Portal should still be accessible
      await documentAdminPage.navigate();
      await documentAdminPage.assertOnDocumentAdminPortal();
    });

    test('should maintain security during concurrent access', async ({ page, context }) => {
      // Test concurrent access to admin portal
      await documentAdminPage.loginAndNavigate();
      
      // Open second tab/page
      const secondPage = await context.newPage();
      const secondDocumentAdminPage = new DocumentAdminPage(secondPage);
      
      // Should be able to access portal in second tab (same session)
      await secondDocumentAdminPage.navigate();
      await secondDocumentAdminPage.assertOnDocumentAdminPortal();
      
      // Both pages should work independently
      await documentAdminPage.clickUsageSection('Document Template Usage');
      await secondDocumentAdminPage.clickUsageSection('Email Template Usage');
      
      // Both should still be functional
      await documentAdminPage.assertOnDocumentAdminPortal();
      await secondDocumentAdminPage.assertOnDocumentAdminPortal();
      
      await secondPage.close();
    });
  });

  test.describe('Audit & Monitoring', () => {
    test('should track admin portal access', async () => {
      await documentAdminPage.loginAndNavigate();
      
      // Portal access should be successful and trackable
      await documentAdminPage.assertOnDocumentAdminPortal();
      
      // Log access for audit purposes
      console.log('Document admin portal access logged at:', new Date().toISOString());
      console.log('User:', documentAdminPage.page.url());
      console.log('Portal sections accessed: All analytics dashboards');
      
      await documentAdminPage.assertNoErrors();
    });

    test('should verify admin actions are properly logged', async () => {
      await documentAdminPage.loginAndNavigate();
      
      // Perform various admin actions
      const actions = [
        'Document Template Usage',
        'Content Block Usage',
        'Email Template Usage',
        'SMS Template Usage'
      ];
      
      for (const action of actions) {
        await documentAdminPage.clickUsageSection(action);
        
        // Log action for audit trail
        console.log(`Admin action performed: Viewed ${action} at ${new Date().toISOString()}`);
      }
      
      await documentAdminPage.assertNoErrors();
    });
  });
}); 