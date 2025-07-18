import { Page, Locator, expect } from '@playwright/test';

export class NavbarPage {
  readonly page: Page;
  readonly launchpadButton: Locator;
  readonly launchpadMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.launchpadButton = page.locator('#launchpad-widget-menu .fa-plus');
    this.launchpadMenu = page.locator('#launchpad-widget-menu');
  }

  /**
   * Click the launchpad (+ button) to open the menu
   */
  async openLaunchpad(): Promise<void> {
    await this.launchpadButton.waitFor({ timeout: 10000 });
    await this.launchpadButton.click();
    // Wait for the menu to expand
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click the launchpad (+ button) to close the menu
   */
  async closeLaunchpad(): Promise<void> {
    await this.launchpadButton.click();
    // Wait for the menu to close
    await this.page.waitForTimeout(1000);
  }

  /**
   * Verify that the launchpad menu is visible and contains content
   */
  async verifyLaunchpadIsOpen(): Promise<void> {
    // Check if the main launchpad dropdown is open (first dropdown menu)
    await expect(this.launchpadMenu.locator('.dropdown-menu').first()).toBeVisible();
  }

  /**
   * Verify that the launchpad menu is not visible or empty
   */
  async verifyLaunchpadIsClosed(): Promise<void> {
    // When closed, the dropdown menu should not be visible
    await expect(this.launchpadMenu.locator('.dropdown-menu').first()).not.toBeVisible();
  }

  /**
   * Verify that the launchpad menu contains clickable links
   * (Generic verification - doesn't check for specific links)
   */
  async verifyLaunchpadHasLinks(): Promise<void> {
    // Look for clickable elements within the first dropdown menu (the main launchpad)
    const mainDropdown = this.launchpadMenu.locator('.dropdown-menu').first();
    const clickableItems = mainDropdown.locator('a, button, [role="button"]');
    const clickableCount = await clickableItems.count();
    expect(clickableCount).toBeGreaterThan(0);
  }

  /**
   * Get the count of available clickable options in the launchpad
   */
  async getLaunchpadOptionsCount(): Promise<number> {
    const mainDropdown = this.launchpadMenu.locator('.dropdown-menu').first();
    const clickableItems = mainDropdown.locator('a, button, [role="button"]');
    return await clickableItems.count();
  }
} 