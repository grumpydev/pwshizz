export const testConfig = {
  // Base URLs
  baseUrl: process.env.BASE_URL || 'https://core1-release.sharedo.co.uk',
  loginIdentityUrl: process.env.LOGIN_IDENTITY_URL || 'https://core1-release-identity.sharedo.co.uk',
  
  // Test credentials
  testUser: {
    username: process.env.TEST_USERNAME || 'pwshizz',
    password: process.env.TEST_PASSWORD || 'q4ruleZZZ'
  },
  
  // Work types (environment-configurable)
  workTypes: {
    claimantRta: {
      mainType: process.env.WORK_TYPE_CLAIMANT_RTA || 'Claimant RTA',
      subType: process.env.WORK_TYPE_RTA_CLAIMANT || 'RTA - Claimant',
      // Derived strings for UI elements
      subTypeWithPrefix: process.env.WORK_TYPE_RTA_CLAIMANT ? `+ ${process.env.WORK_TYPE_RTA_CLAIMANT}` : '+ RTA - Claimant',
      instructionBladePattern: process.env.INSTRUCTION_BLADE_PATTERN || 'New Enquiry.*RTA',
      instructionBladeKeyword: process.env.INSTRUCTION_BLADE_KEYWORD || 'New Enquiry'
    }
  },

  // Form field labels (environment-configurable)
  formFields: {
    instruction: {
      sectionTitle: process.env.INSTRUCTION_SECTION_TITLE || 'Instruction',
      caseTypeLabel: process.env.CASE_TYPE_LABEL || 'Case Type:',
      workTypeLabel: process.env.WORK_TYPE_LABEL || 'Work Type:'
    }
  },
  
  // Timeouts
  defaultTimeout: 30000,
  loginTimeout: 10000
}; 