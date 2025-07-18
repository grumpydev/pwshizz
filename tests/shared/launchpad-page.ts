import { Page, Locator, expect } from '@playwright/test';
import { testConfig } from '../config/test-config';

export class LaunchpadPage {
  readonly page: Page;
  readonly launchpadButton: Locator;
  readonly launchpadMenu: Locator;

  /**
   * Static helper method to open the launchpad menu
   * This is the recommended way to access the launchpad in tests
   */
  static async openLaunchpad(page: Page): Promise<void> {
    const launchpadPage = new LaunchpadPage(page);
    await launchpadPage.openLaunchpadMenu();
  }

  /**
   * Static helper method to navigate to a specific work type
   * Opens launchpad and selects the specified work type
   */
  static async navigateToWorkType(page: Page, workTypeName: string, workTypeConfig = testConfig.workTypes.claimantRta): Promise<void> {
    const launchpadPage = new LaunchpadPage(page);
    await launchpadPage.openLaunchpadMenu();
    await launchpadPage.selectWorkType(workTypeName, workTypeConfig);
  }

  constructor(page: Page) {
    this.page = page;
    // Correct selector based on DOM exploration - it's a FontAwesome plus icon
    this.launchpadButton = page.locator('#launchpad-widget-menu .fa-plus');
    this.launchpadMenu = page.locator('#launchpad-widget-menu');
  }

  /**
   * Open the launchpad menu
   */
  async openLaunchpadMenu(): Promise<void> {
    await this.launchpadButton.waitFor({ timeout: 10000 });
    await this.launchpadButton.click();
    await this.page.waitForTimeout(1000); // Allow menu to expand
  }

  /**
   * Select a work type from the launchpad menu
   */
  async selectWorkType(workTypeName: string, workTypeConfig = testConfig.workTypes.claimantRta): Promise<void> {
    // Click the specific work type option in the dropdown
    const workTypeOption = this.page.getByText(workTypeName, { exact: true });
    await workTypeOption.waitFor({ timeout: 10000 });
    await workTypeOption.click();
    
    // Wait for the work type selection blade to appear
    await this.assertWorkTypeSelectionBladeOpened(workTypeConfig);
  }

  /**
   * Assert that a work type selection blade has opened
   */
  async assertWorkTypeSelectionBladeOpened(workTypeConfig = testConfig.workTypes.claimantRta): Promise<void> {
    // Look for the work type selection blade by its h4 heading
    const workTypeBladeHeading = this.page.getByRole('heading', { 
      name: workTypeConfig.mainType, 
      level: 4 
    });
    await expect(workTypeBladeHeading).toBeVisible({ timeout: 10000 });
    
    // Specifically check for the configured sub work type option
    const subWorkType = this.page.getByRole('heading', { 
      name: workTypeConfig.subTypeWithPrefix, 
      level: 3 
    });
    await expect(subWorkType).toBeVisible({ timeout: 10000 });
  }

  /**
   * Select a sub work type from the blade that opens after work type selection
   */
  async selectSubWorkType(subWorkTypeName: string): Promise<void> {
    // Find the sub work type option - it's an h3 heading with "+" prefix
    const subWorkTypeOption = this.page.getByRole('heading', { 
      name: `+ ${subWorkTypeName}`, 
      level: 3 
    });
    await subWorkTypeOption.waitFor({ timeout: 10000 });
    await subWorkTypeOption.click();
    
    // Wait for blade transition
    await this.page.waitForTimeout(2000);
  }

  /**
   * Get the number of open blades by counting h4 headings that indicate blades
   */
  async getOpenBladeCount(workTypeConfig = testConfig.workTypes.claimantRta): Promise<number> {
    // Count blades by looking for h4 headings that indicate blade titles
    const bladeHeadings = this.page.getByRole('heading', { level: 4 });
    const headingCount = await bladeHeadings.count();
    
    // Filter for actual blade headings (containing specific blade indicators)
    let bladeCount = 0;
    for (let i = 0; i < headingCount; i++) {
      const text = await bladeHeadings.nth(i).textContent();
      if (text && (text.includes(workTypeConfig.mainType) || text.includes(workTypeConfig.instructionBladeKeyword))) {
        bladeCount++;
      }
    }
    return bladeCount;
  }
} 