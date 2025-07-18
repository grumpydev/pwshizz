import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/pages/login-page';
import { LaunchpadPage } from './launchpad-page';
import { testConfig } from '../config/test-config';

test.describe('Launchpad Reusable Helpers', () => {
  test.beforeEach(async ({ page }) => {
    // Use the static login helper
    await LoginPage.performLogin(page);
  });

  test('should open launchpad using static helper', async ({ page }) => {
    // Demonstrate using the static helper to open launchpad
    await LaunchpadPage.openLaunchpad(page);
    
    // Verify launchpad is open by checking for the configured work type
    const workTypeOption = page.getByText(testConfig.workTypes.claimantRta.mainType);
    await expect(workTypeOption).toBeVisible();
  });

  test('should navigate to work type using static helper', async ({ page }) => {
    const workTypeConfig = testConfig.workTypes.claimantRta;
    
    // Demonstrate using the static helper to navigate to a work type
    await LaunchpadPage.navigateToWorkType(page, workTypeConfig.mainType, workTypeConfig);
    
    // Verify work type blade opened
    const workTypeBladeHeading = page.getByRole('heading', { 
      name: workTypeConfig.mainType, 
      level: 4 
    });
    await expect(workTypeBladeHeading).toBeVisible();
    
    // Verify sub work type option is available
    const subWorkType = page.getByRole('heading', { 
      name: workTypeConfig.subTypeWithPrefix, 
      level: 3 
    });
    await expect(subWorkType).toBeVisible();
  });

  test('should count open blades using helper method', async ({ page }) => {
    const launchpadPage = new LaunchpadPage(page);
    const workTypeConfig = testConfig.workTypes.claimantRta;
    
    // Open launchpad and navigate to work type
    await LaunchpadPage.navigateToWorkType(page, workTypeConfig.mainType, workTypeConfig);
    
    // Count blades using the helper method
    const bladeCount = await launchpadPage.getOpenBladeCount(workTypeConfig);
    expect(bladeCount).toBeGreaterThanOrEqual(1);
  });
}); 