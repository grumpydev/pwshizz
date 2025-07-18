import { testConfig } from '../../config/test-config';

export interface DocumentAdminConfig {
  readonly baseUrl: string;
  readonly adminDocumentsUrl: string;
  readonly testUsername: string;
  readonly testPassword: string;
  readonly timeouts: {
    readonly navigation: number;
    readonly interaction: number;
    readonly upload: number;
  };
}

export const documentAdminConfig: DocumentAdminConfig = {
  baseUrl: testConfig.baseUrl,
  adminDocumentsUrl: '/admin-documents',
  testUsername: testConfig.testUser.username,
  testPassword: testConfig.testUser.password,
  timeouts: {
    navigation: 30000,
    interaction: 10000,
    upload: 60000
  }
}; 