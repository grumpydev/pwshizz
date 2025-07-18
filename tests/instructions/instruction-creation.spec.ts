import { test, expect } from '@playwright/test';
import { InstructionCreationPage } from './pages/instruction-creation-page';
import { LoginPage } from '../auth/pages/login-page';
import { LaunchpadPage } from '../shared/launchpad-page';
import { testConfig } from '../config/test-config';

test.describe('Instruction Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Use the simplified login helper
    await LoginPage.performLogin(page);
  });

  test('should navigate from launchpad to instruction creation blade', async ({ page }) => {
    // Use environment-configurable work type names
    const workTypeConfig = testConfig.workTypes.claimantRta;
    
    // Use the static helper for the complete flow
    await InstructionCreationPage.navigateToInstructionCreation(page, workTypeConfig);
    
    // Additional verification that we're in the right state
    const instructionPage = new InstructionCreationPage(page);
    
    // Verify we have blades open (should be at least one for instruction creation)
    const bladeCount = await instructionPage.getOpenBladeCount(workTypeConfig);
    expect(bladeCount).toBeGreaterThanOrEqual(1);
    
    // Verify the instruction form is visible in the current blade
    await instructionPage.assertInstructionFormVisible();
  });

  test('should handle blade navigation correctly', async ({ page }) => {
    const instructionPage = new InstructionCreationPage(page);
    const launchpadPage = new LaunchpadPage(page);
    const workTypeConfig = testConfig.workTypes.claimantRta;
    
    // Step 1: Open launchpad using static helper
    await LaunchpadPage.openLaunchpad(page);
    
    // Step 2: Select main work type (should open work type selection blade)
    await launchpadPage.selectWorkType(workTypeConfig.mainType, workTypeConfig);
    await launchpadPage.assertWorkTypeSelectionBladeOpened(workTypeConfig);
    
    // Check we have at least one blade open
    let bladeCount = await instructionPage.getOpenBladeCount(workTypeConfig);
    expect(bladeCount).toBeGreaterThanOrEqual(1);
    
    // Step 3: Select sub work type (should open instruction creation blade)
    await launchpadPage.selectSubWorkType(workTypeConfig.subType);
    await instructionPage.assertInstructionBladeOpened(workTypeConfig);
    
    // Verify blade stack behavior - we should still have blades open
    bladeCount = await instructionPage.getOpenBladeCount(workTypeConfig);
    expect(bladeCount).toBeGreaterThanOrEqual(1);
    
    // Verify the current blade contains the instruction form
    await instructionPage.assertInstructionFormVisible();
  });

  test('should fill mandatory fields and clear validation messages', async ({ page }) => {
    const instructionPage = new InstructionCreationPage(page);
    const workTypeConfig = testConfig.workTypes.claimantRta;
    
    // Navigate to instruction creation blade
    await InstructionCreationPage.navigateToInstructionCreation(page, workTypeConfig);
    
    // Test mandatory field validation behavior
    await instructionPage.testMandatoryFieldValidation();
    
    // Fill all mandatory fields
    await instructionPage.fillMandatoryFields();
    
    // Verify validation messages are cleared
    await instructionPage.assertValidationMessagesCleared();
    
    // Verify form is ready for saving
    await instructionPage.assertFormReadyForSave();
  });

  test('should save instruction successfully', async ({ page }) => {
    const instructionPage = new InstructionCreationPage(page);
    const workTypeConfig = testConfig.workTypes.claimantRta;
    
    // Navigate to instruction creation blade
    await InstructionCreationPage.navigateToInstructionCreation(page, workTypeConfig);
    
    // Fill all mandatory fields
    await instructionPage.fillMandatoryFields();
    
    // Save the instruction
    await instructionPage.saveInstruction();
    
    // Verify save was successful
    await instructionPage.assertSaveSuccessful();
  });

  test('should prevent saving with incomplete mandatory fields', async ({ page }) => {
    const instructionPage = new InstructionCreationPage(page);
    const workTypeConfig = testConfig.workTypes.claimantRta;
    
    // Navigate to instruction creation blade
    await InstructionCreationPage.navigateToInstructionCreation(page, workTypeConfig);
    
    // Try to save without filling mandatory fields
    await instructionPage.attemptSaveWithoutRequiredFields();
    
    // Verify validation messages are shown
    await instructionPage.assertValidationMessagesVisible();
    
    // Verify save button state or error handling
    await instructionPage.assertSaveNotCompleted();
  });
}); 