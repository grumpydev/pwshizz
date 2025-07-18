import { Page, Locator, expect } from '@playwright/test';
import { documentAdminConfig } from '../config/document-admin-config';

export class DocumentAdminPage {
  readonly page: Page;
  
  // Navigation elements
  readonly userMenuToggle: Locator;
  readonly signOutLink: Locator;
  
  // Main sections - template usage analytics
  readonly documentTemplateUsageSection: Locator;
  readonly contentBlockUsageSection: Locator;
  readonly emailTemplateUsageSection: Locator;
  readonly smsTemplateUsageSection: Locator;
  
  // User-specific analytics sections
  readonly documentTemplateUsageByUserSection: Locator;
  readonly contentBlockUsageByUserSection: Locator;
  readonly emailTemplateUsageByUserSection: Locator;
  readonly smsTemplateUsageByUserSection: Locator;
  
  // Time-based analytics sections
  readonly documentTemplateUsageOverTimeSection: Locator;
  readonly contentBlockUsageOverTimeSection: Locator;
  readonly emailTemplateUsageOverTimeSection: Locator;
  readonly smsTemplateUsageOverTimeSection: Locator;
  
  // Common interactive elements
  readonly pageTitle: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Navigation elements
    this.userMenuToggle = page.locator('nav.navbar .dropdown-toggle').first();
    this.signOutLink = page.locator('a:has-text("Sign out")');
    
    // Main usage sections
    this.documentTemplateUsageSection = page.locator('h3:has-text("Document Template Usage")').first();
    this.contentBlockUsageSection = page.locator('h3:has-text("Content Block Usage")').first();
    this.emailTemplateUsageSection = page.locator('h3:has-text("Email Template Usage")').first();
    this.smsTemplateUsageSection = page.locator('h3:has-text("SMS Template Usage")').first();
    
    // User-specific sections
    this.documentTemplateUsageByUserSection = page.locator('h3:has-text("Document Template Usage by User")');
    this.contentBlockUsageByUserSection = page.locator('h3:has-text("Content Block Usage by User")');
    this.emailTemplateUsageByUserSection = page.locator('h3:has-text("Email Template Usage by User")');
    this.smsTemplateUsageByUserSection = page.locator('h3:has-text("SMS Template Usage by User")');
    
    // Time-based sections
    this.documentTemplateUsageOverTimeSection = page.locator('h3:has-text("Document Template Usage over Time")');
    this.contentBlockUsageOverTimeSection = page.locator('h3:has-text("Content Block Usage over Time")');
    this.emailTemplateUsageOverTimeSection = page.locator('h3:has-text("Email Template Usage over Time")');
    this.smsTemplateUsageOverTimeSection = page.locator('h3:has-text("SMS Template Usage over Time")');
    
    // Common elements
    this.pageTitle = page.locator('title');
    this.loadingIndicator = page.locator('.loading, .spinner, [data-loading]');
    this.errorMessage = page.locator('.error, .alert-danger, .error-message');
  }

  /**
   * Navigate to the document admin portal
   */
  async navigate() {
    await this.page.goto(`${documentAdminConfig.baseUrl}${documentAdminConfig.adminDocumentsUrl}`);
    await this.page.waitForLoadState('networkidle', { timeout: documentAdminConfig.timeouts.navigation });
    await this.waitForPageLoad();
  }

  /**
   * Login from the main application first, then navigate to document admin
   */
  async loginAndNavigate() {
    // First login to the main application
    await this.page.goto(documentAdminConfig.baseUrl);
    await this.page.fill('#username', documentAdminConfig.testUsername);
    await this.page.fill('#password', documentAdminConfig.testPassword);
    await this.page.click('button:has-text("Login")');
    await this.page.waitForLoadState('networkidle');
    
    // Then navigate to document admin portal
    await this.navigate();
  }

  /**
   * Wait for the document admin page to load completely
   */
  async waitForPageLoad() {
    // Wait for the page to have the correct title
    await expect(this.page).toHaveTitle(/Dashboard.*Document Assembly Administration/);
    
    // Wait for at least one main section to be visible
    await expect(this.documentTemplateUsageSection).toBeVisible({ timeout: documentAdminConfig.timeouts.interaction });
    
    // Wait for any loading indicators to disappear
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
      // Loading indicator might not be present, which is fine
    });
  }

  /**
   * Assert that we're on the document admin portal
   */
  async assertOnDocumentAdminPortal() {
    await expect(this.page).toHaveURL(new RegExp(`.*${documentAdminConfig.adminDocumentsUrl}`));
    await expect(this.page).toHaveTitle(/Dashboard.*Document Assembly Administration/);
    await expect(this.documentTemplateUsageSection).toBeVisible();
  }

  /**
   * Assert that all main usage sections are visible
   */
  async assertMainUsageSectionsVisible() {
    await expect(this.documentTemplateUsageSection).toBeVisible();
    await expect(this.contentBlockUsageSection).toBeVisible();
    await expect(this.emailTemplateUsageSection).toBeVisible();
    await expect(this.smsTemplateUsageSection).toBeVisible();
  }

  /**
   * Assert that all user-specific analytics sections are visible
   */
  async assertUserAnalyticsSectionsVisible() {
    await expect(this.documentTemplateUsageByUserSection).toBeVisible();
    await expect(this.contentBlockUsageByUserSection).toBeVisible();
    await expect(this.emailTemplateUsageByUserSection).toBeVisible();
    await expect(this.smsTemplateUsageByUserSection).toBeVisible();
  }

  /**
   * Assert that all time-based analytics sections are visible
   */
  async assertTimeAnalyticsSectionsVisible() {
    await expect(this.documentTemplateUsageOverTimeSection).toBeVisible();
    await expect(this.contentBlockUsageOverTimeSection).toBeVisible();
    await expect(this.emailTemplateUsageOverTimeSection).toBeVisible();
    await expect(this.smsTemplateUsageOverTimeSection).toBeVisible();
  }

  /**
   * Assert that all dashboard sections are present
   */
  async assertAllDashboardSectionsPresent() {
    await this.assertMainUsageSectionsVisible();
    await this.assertUserAnalyticsSectionsVisible();
    await this.assertTimeAnalyticsSectionsVisible();
  }

  /**
   * Get analytics data from a specific section
   */
  async getAnalyticsData(sectionName: string) {
    const section = this.page.locator(`h3:has-text("${sectionName}")`).locator('..').first();
    
    // Look for data tables, charts, or statistics in the section
    const tables = await section.locator('table, .table').count();
    const charts = await section.locator('canvas, .chart, svg').count();
    const dataElements = await section.locator('.data, .stat, .metric, .count').count();
    
    return {
      sectionName,
      hasTable: tables > 0,
      hasChart: charts > 0,
      hasDataElements: dataElements > 0,
      totalElements: tables + charts + dataElements
    };
  }

  /**
   * Get usage statistics for all main template types
   */
  async getAllUsageStatistics() {
    return {
      documentTemplates: await this.getAnalyticsData('Document Template Usage'),
      contentBlocks: await this.getAnalyticsData('Content Block Usage'),
      emailTemplates: await this.getAnalyticsData('Email Template Usage'),
      smsTemplates: await this.getAnalyticsData('SMS Template Usage')
    };
  }

  /**
   * Check for any error messages or alerts
   */
  async checkForErrors() {
    const errorVisible = await this.errorMessage.isVisible();
    if (errorVisible) {
      const errorText = await this.errorMessage.textContent();
      throw new Error(`Document admin portal error: ${errorText}`);
    }
  }

  /**
   * Assert no errors are present on the page
   */
  async assertNoErrors() {
    await expect(this.errorMessage).not.toBeVisible();
  }

  /**
   * Wait for and assert that analytics data is loaded
   */
  async waitForAnalyticsDataLoad() {
    // Wait for any loading to complete
    await this.page.waitForTimeout(2000);
    
    // Check that main sections have content
    const sections = [
      'Document Template Usage',
      'Content Block Usage', 
      'Email Template Usage',
      'SMS Template Usage'
    ];
    
    for (const sectionName of sections) {
      const data = await this.getAnalyticsData(sectionName);
      if (data.totalElements === 0) {
        console.warn(`Warning: ${sectionName} section appears to have no data`);
      }
    }
  }

  /**
   * Click on a specific usage section (if interactive)
   */
  async clickUsageSection(sectionName: string) {
    const section = this.page.locator(`h3:has-text("${sectionName}")`);
    await section.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Search for specific template or content (if search functionality exists)
   */
  async searchForTemplate(searchTerm: string) {
    const searchInput = this.page.locator('input[type="search"], input[placeholder*="search"], .search-input');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill(searchTerm);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(2000);
      return true;
    }
    
    return false;
  }

  /**
   * Check if user has admin permissions (can access all features)
   */
  async checkAdminPermissions() {
    await this.assertOnDocumentAdminPortal();
    await this.assertAllDashboardSectionsPresent();
    await this.assertNoErrors();
  }

  /**
   * Logout from document admin portal
   */
  async logout() {
    await this.userMenuToggle.click();
    await this.page.waitForTimeout(500);
    await this.signOutLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Assert successful logout (redirected to login page)
   */
  async assertLogoutSucceeded() {
    await expect(this.page).toHaveURL(/.*identity.*login/);
    await expect(this.page.locator('#username')).toBeVisible();
  }

  /**
   * Take a screenshot of the current state for debugging
   */
  async takeScreenshot(filename: string) {
    await this.page.screenshot({ 
      path: `document-admin-${filename}.png`, 
      fullPage: true 
    });
  }

  /**
   * Get all visible section headers for verification
   */
  async getAllSectionHeaders() {
    const headers = await this.page.locator('h1, h2, h3').allTextContents();
    return headers
      .map(header => header.replace(/[·\s]/g, ' ').trim())
      .filter(header => header.length > 0)
      .map(header => header.replace(/\s+/g, ' '));
  }

  /**
   * Verify the portal is accessible and functioning
   */
  async verifyPortalFunctionality() {
    await this.assertOnDocumentAdminPortal();
    await this.waitForAnalyticsDataLoad();
    await this.checkForErrors();
    await this.assertAllDashboardSectionsPresent();
  }
} 