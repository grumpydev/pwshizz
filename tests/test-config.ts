import { test as base } from 'playwright-bdd';

// Test configuration and credentials
export const testConfig = {
  users: {
    pwshizz: {
      username: 'pwshizz',
      password: 'q4ruleZZZ'
    }
  },
  urls: {
    baseUrl: 'https://core1-release.sharedo.co.uk/'
  }
};

// Custom fixtures extending the base test
export const test = base.extend<{
  testConfig: typeof testConfig;
  currentUser: typeof testConfig.users.pwshizz;
}>({
  testConfig: async ({}, use) => {
    await use(testConfig);
  },
  currentUser: async ({}, use) => {
    await use(testConfig.users.pwshizz);
  }
}); 