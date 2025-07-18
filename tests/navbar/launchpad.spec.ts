import { test, expect } from '@playwright/test';
import { NavbarPage } from './pages/navbar-page';
import { LoginPage } from '../auth/pages/login-page';

test.describe('Launchpad Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Use the simplified login helper
    await LoginPage.performLogin(page);
  });

  test('should open launchpad menu and display available options', async ({ page }) => {
    const navbarPage = new NavbarPage(page);

    // Verify launchpad is initially closed
    await navbarPage.verifyLaunchpadIsClosed();

    // Open the launchpad
    await navbarPage.openLaunchpad();

    // Verify launchpad is now open
    await navbarPage.verifyLaunchpadIsOpen();

    // Verify the launchpad contains links/options
    await navbarPage.verifyLaunchpadHasLinks();

    // Verify we have some options available (basic check that links exist)
    const optionsCount = await navbarPage.getLaunchpadOptionsCount();
    expect(optionsCount).toBeGreaterThan(0); // Generic check - should have at least one clickable option

    // Close the launchpad
    await navbarPage.closeLaunchpad();

    // Verify launchpad is closed again
    await navbarPage.verifyLaunchpadIsClosed();
  });
}); 