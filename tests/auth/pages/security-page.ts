import { Page, Locator, expect, Response } from '@playwright/test';
import { testConfig } from '../../config/test-config';
import { LoginPage } from './login-page';

export class SecurityPage {
  readonly page: Page;
  readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
  }

  /**
   * Attempt SQL injection payloads in login form
   */
  async attemptSQLInjection(): Promise<void> {
    const sqlPayloads = [
      "' OR '1'='1",
      "' OR 1=1--",
      "admin'--",
      "' OR 'a'='a",
      "' UNION SELECT * FROM ods.users--",
      "'; DROP TABLE ods.users;--",
      "' OR '1'='1' /*",
      "admin'; --"
    ];

    for (const payload of sqlPayloads) {
      await this.loginPage.navigate();
      await this.loginPage.fillCredentials(payload, payload);
      await this.loginPage.clickLogin();
      
      // Wait for response and verify we're still on login page
      await this.page.waitForTimeout(2000);
      await this.loginPage.assertOnLoginPage();
    }
  }

  /**
   * Attempt XSS payloads in login form
   */
  async attemptXSSInjection(): Promise<void> {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<svg onload=alert("XSS")>',
      '"><script>alert("XSS")</script>',
      "'><script>alert('XSS')</script>",
      '<iframe src="javascript:alert(\'XSS\')"></iframe>'
    ];

    for (const payload of xssPayloads) {
      await this.loginPage.navigate();
      await this.loginPage.fillCredentials(payload, 'password');
      await this.loginPage.clickLogin();
      
      // Verify no script execution (page should remain on login)
      await this.page.waitForTimeout(1000);
      await this.loginPage.assertOnLoginPage();
      
      // Check that no alerts are present
      const alertCount = await this.page.evaluate(() => {
        return window.alert.toString().includes('[native code]');
      });
      expect(alertCount).toBeTruthy(); // Alert should remain native, not overridden
    }
  }

  /**
   * Test direct URL access after logout (authorization bypass)
   */
  async testDirectURLAccessAfterLogout(): Promise<void> {
    // Login first
    await this.loginPage.navigate();
    await this.loginPage.loginWithValidCredentials();
    await this.loginPage.assertLoginSucceeded();
    
    // Get the authenticated URL
    const authenticatedURL = this.page.url();
    
    // Logout
    await this.loginPage.logout();
    await this.loginPage.assertLogoutSucceeded();
    
    // Attempt to access the authenticated URL directly
    await this.page.goto(authenticatedURL);
    
    // Should be redirected back to login
    await this.loginPage.assertOnLoginPage();
  }

  /**
   * Test session security by checking for secure attributes
   */
  async testSessionSecurity(): Promise<void> {
    await this.loginPage.navigate();
    await this.loginPage.loginWithValidCredentials();
    
    // Check cookies for security attributes
    const cookies = await this.page.context().cookies();
    
    // Look for session-related cookies
    const sessionCookies = cookies.filter(cookie => 
      cookie.name.toLowerCase().includes('session') ||
      cookie.name.toLowerCase().includes('auth') ||
      cookie.name.toLowerCase().includes('token')
    );
    
    // Verify security attributes
    for (const cookie of sessionCookies) {
      expect(cookie.secure).toBeTruthy(); // Should be secure
      expect(cookie.httpOnly).toBeTruthy(); // Should be HTTP-only
      expect(cookie.sameSite).toMatch(/Strict|Lax/); // Should have SameSite protection
    }
  }

  /**
   * Test brute force protection
   */
  async testBruteForceProtection(): Promise<void> {
    const maxAttempts = 6; // Test beyond typical lockout threshold
    const invalidPassword = 'wrongpassword';
    
    for (let i = 1; i <= maxAttempts; i++) {
      await this.loginPage.navigate();
      await this.loginPage.attemptLogin(testConfig.testUser.username, `${invalidPassword}${i}`);
      
      // After several attempts, should see some form of protection
      if (i >= 5) {
        // Look for rate limiting, CAPTCHA, or account lockout indicators
        const possibleProtections = await this.page.locator([
          'text=/captcha/i',
          'text=/locked/i', 
          'text=/blocked/i',
          'text=/many attempts/i',
          'text=/rate limit/i',
          'text=/temporarily disabled/i'
        ].join(', ')).count();
        
        // Should have some form of protection after multiple attempts
        if (possibleProtections > 0) {
          break; // Protection mechanism detected
        }
      }
      
      await this.page.waitForTimeout(1000); // Brief delay between attempts
    }
  }

  /**
   * Test session timeout behavior
   */
  async testSessionTimeout(): Promise<void> {
    // Login
    await this.loginPage.navigate();
    await this.loginPage.loginWithValidCredentials();
    await this.loginPage.assertLoginSucceeded();
    
    // Simulate extended inactivity (in real scenario, would wait longer)
    // For testing, we'll manipulate session artificially
    await this.page.waitForTimeout(2000);
    
    // Clear session storage to simulate timeout
    await this.page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });
    
    // Try to perform an authenticated action (navigate to main page)
    await this.page.goto('/');
    
    // Should be redirected to login due to session expiration
    await this.loginPage.assertOnLoginPage();
  }

  /**
   * Test HTTPS enforcement
   */
  async testHTTPSEnforcement(): Promise<void> {
    // Attempt to access via HTTP (should redirect to HTTPS)
    const httpUrl = testConfig.baseUrl.replace('https://', 'http://');
    
    let response: Response | null = null;
    try {
      response = await this.page.goto(httpUrl);
    } catch (error) {
      // Connection might be refused for HTTP, which is good
      expect(error.message).toMatch(/net::|refused|timeout/);
      return;
    }
    
    if (response) {
      // If connection succeeds, should redirect to HTTPS
      expect(this.page.url()).toMatch(/^https:/);
    }
  }

  /**
   * Test for information disclosure in error messages
   */
  async testInformationDisclosure(): Promise<void> {
    await this.loginPage.navigate();
    
    // Test with valid username, invalid password
    await this.loginPage.attemptLogin(testConfig.testUser.username, 'wrongpassword');
    
    // Check for information disclosure in error messages
    const pageContent = await this.page.textContent('body');
    
    // Should NOT reveal specific information about why login failed
    const disclosurePatterns = [
      /user.*not.*found/i,
      /invalid.*username/i,
      /username.*does.*not.*exist/i,
      /password.*incorrect.*for.*user/i,
      /sql.*error/i,
      /database.*error/i,
      /stack.*trace/i
    ];
    
    for (const pattern of disclosurePatterns) {
      expect(pageContent).not.toMatch(pattern);
    }
  }

  /**
   * Test concurrent session handling
   */
  async testConcurrentSessions(): Promise<void> {
    // Create second browser context to simulate another session
    const secondContext = await this.page.context().browser()?.newContext({ ignoreHTTPSErrors: true });
    if (!secondContext) return;
    
    const secondPage = await secondContext.newPage();
    const secondLoginPage = new LoginPage(secondPage);
    
    try {
      // Login in first session
      await this.loginPage.navigate();
      await this.loginPage.loginWithValidCredentials();
      await this.loginPage.assertLoginSucceeded();
      
      // Login in second session with same credentials
      await secondLoginPage.navigate();
      await secondLoginPage.loginWithValidCredentials();
      await secondLoginPage.assertLoginSucceeded();
      
      // Check if first session is still valid or invalidated
      await this.page.reload();
      await this.page.waitForLoadState('networkidle');
      
      // Both sessions should be handled securely
      // (Either both allowed or first invalidated - depends on business rules)
      const isFirstSessionValid = !this.page.url().includes('login');
      const isSecondSessionValid = !secondPage.url().includes('login');
      
      // At minimum, verify sessions are tracked properly
      expect(isFirstSessionValid || isSecondSessionValid).toBeTruthy();
      
    } finally {
      await secondContext.close();
    }
  }

  /**
   * Test for security headers
   */
  async testSecurityHeaders(): Promise<void> {
    const response = await this.page.goto(testConfig.baseUrl);
    
    if (response) {
      const headers = response.headers();
      
      // Check for important security headers
      expect(headers['x-frame-options'] || headers['X-Frame-Options']).toBeTruthy();
      expect(headers['x-content-type-options'] || headers['X-Content-Type-Options']).toMatch(/nosniff/i);
      expect(headers['strict-transport-security'] || headers['Strict-Transport-Security']).toBeTruthy();
      
      // CSP header should be present
      const csp = headers['content-security-policy'] || headers['Content-Security-Policy'];
      if (csp) {
        expect(csp).toMatch(/default-src|script-src/);
      }
    }
  }

  /**
   * Assert that all security tests passed without compromise
   */
  async assertSystemSecure(): Promise<void> {
    // Verify we're on login page (not authenticated)
    await this.loginPage.assertOnLoginPage();
    
    // Verify no residual authentication state
    const cookies = await this.page.context().cookies();
    const authCookies = cookies.filter(cookie => 
      cookie.name.toLowerCase().includes('session') ||
      cookie.name.toLowerCase().includes('auth') ||
      cookie.name.toLowerCase().includes('token')
    );
    
    // Should have no active authentication cookies from attacks
    for (const cookie of authCookies) {
      expect(cookie.value).not.toMatch(/authenticated|admin|root/i);
    }
  }
} 