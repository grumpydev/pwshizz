import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// Configure BDD test generation
const testDir = defineBddConfig({
  paths: ['features/**/*.feature'],
  require: ['step-definitions/**/*.ts'],
  importTestFrom: 'tests/test-config.ts',
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Multiple reporters for detailed BDD reporting - saved to local Documents */
  reporter: [
    ['html', { outputFolder: 'C:/Users/Arif/Documents/pwshizz-reports/playwright-report' }],
    ['json', { outputFile: 'C:/Users/Arif/Documents/pwshizz-reports/test-results/results.json' }],
    ['allure-playwright', { outputFolder: 'C:/Users/Arif/Documents/pwshizz-reports/allure-results' }],
    ['list']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://core1-release.sharedo.co.uk/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Capture screenshots on failure and attach to report */
    screenshot: 'only-on-failure',
    
    /* Capture videos on retry to see what happened */
    video: 'retain-on-failure',
    
    /* Ignore HTTPS errors for local development */
    ignoreHTTPSErrors: true,
    
    /* Set viewport size to 1536x864 */
    viewport: { width: 1536, height: 864 },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium'
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
