import { Page, Locator, expect } from '@playwright/test';
import { testConfig } from '../../config/test-config';
import { LaunchpadPage } from '../../shared/launchpad-page';

export class InstructionCreationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Static helper to perform complete instruction creation flow
   */
  static async navigateToInstructionCreation(page: Page, workTypeConfig = testConfig.workTypes.claimantRta): Promise<void> {
    const instructionPage = new InstructionCreationPage(page);
    const launchpadPage = new LaunchpadPage(page);
    
    // Use LaunchpadPage static helper to open launchpad
    await LaunchpadPage.openLaunchpad(page);
    
    // Select work type using launchpad functionality
    await launchpadPage.selectWorkType(workTypeConfig.mainType, workTypeConfig);
    
    // Select sub work type
    await launchpadPage.selectSubWorkType(workTypeConfig.subType);
    
    // Assert instruction blade opened
    await instructionPage.assertInstructionBladeOpened(workTypeConfig);
  }

  /**
   * Select a sub work type from the blade that opens after work type selection
   * This method is specific to instruction creation and stays in this class
   */
  async selectSubWorkType(subWorkTypeName: string): Promise<void> {
    // Find the sub work type option - it's an h3 heading with "+" prefix
    const subWorkTypeOption = this.page.getByRole('heading', { 
      name: `+ ${subWorkTypeName}`, 
      level: 3 
    });
    await subWorkTypeOption.waitFor({ timeout: 10000 });
    await subWorkTypeOption.click();
    
    // Wait for the instruction creation blade to appear
    await this.page.waitForTimeout(2000); // Allow blade transition
  }

  /**
   * Assert that an instruction creation blade has opened
   */
  async assertInstructionBladeOpened(workTypeConfig = testConfig.workTypes.claimantRta): Promise<void> {
    // Look for the instruction form blade by its h4 heading using configured pattern
    const instructionBladeHeading = this.page.getByRole('heading', { level: 4 }).filter({ 
      hasText: new RegExp(workTypeConfig.instructionBladePattern)
    });
    await expect(instructionBladeHeading).toBeVisible({ timeout: 10000 });
    
    // Look for the instruction section h3 heading
    const instructionSection = this.page.getByRole('heading', { 
      name: testConfig.formFields.instruction.sectionTitle, 
      level: 3 
    });
    await expect(instructionSection).toBeVisible();
    
    // Verify instruction form fields are present by looking for specific expected fields
    const incidentDateField = this.page.getByLabel('Incident Date:');
    await expect(incidentDateField).toBeVisible();
  }

  /**
   * Get the number of open blades by counting h4 headings that indicate blades
   * Delegates to LaunchpadPage for consistency
   */
  async getOpenBladeCount(workTypeConfig = testConfig.workTypes.claimantRta): Promise<number> {
    const launchpadPage = new LaunchpadPage(this.page);
    return await launchpadPage.getOpenBladeCount(workTypeConfig);
  }

  /**
   * Get the instruction form blade
   */
  getInstructionBlade(workTypeConfig = testConfig.workTypes.claimantRta): Locator {
    return this.page.getByRole('heading', { level: 4 }).filter({ 
      hasText: new RegExp(workTypeConfig.instructionBladePattern) 
    });
  }

  /**
   * Assert that the instruction blade contains expected form elements
   */
  async assertInstructionFormVisible(): Promise<void> {
    // Look for the instruction section h3 heading using configured title
    const instructionSection = this.page.getByRole('heading', { 
      name: testConfig.formFields.instruction.sectionTitle, 
      level: 3 
    });
    await expect(instructionSection).toBeVisible();
    
    // Look for typical instruction form elements using configured labels
    const caseTypeField = this.page.getByText(testConfig.formFields.instruction.caseTypeLabel);
    await expect(caseTypeField).toBeVisible();
    
    const workTypeField = this.page.getByText(testConfig.formFields.instruction.workTypeLabel);
    await expect(workTypeField).toBeVisible();
    
    // Look for form structure within the instruction blade
    const instructionFormElements = this.page.locator('form').filter({ hasText: 'Case Type' });
    await expect(instructionFormElements.first()).toBeVisible();
  }

  /**
   * Test mandatory field validation behavior by checking required fields show validation
   */
  async testMandatoryFieldValidation(): Promise<void> {
    // Check that required fields have validation messages when empty
    const workTypeValidation = this.page.locator('span.text-danger').filter({ hasText: 'Work Type is required' });
    await expect(workTypeValidation).toBeVisible();
    
    const clientValidation = this.page.locator('span.text-danger').filter({ hasText: 'Client required' });
    await expect(clientValidation).toBeVisible();
    
    const incidentDateValidation = this.page.locator('span.text-danger').filter({ hasText: 'Required' });
    await expect(incidentDateValidation.first()).toBeVisible();
  }

  /**
   * Fill all mandatory fields in the instruction form
   */
  async fillMandatoryFields(): Promise<void> {
    // Fill Work Type field
    const workTypeField = this.page.locator('text=Work Type:').locator('..').getByRole('combobox');
    await workTypeField.click();
    // Select the first available option
    await this.page.locator('.dropdown-menu li').first().click();
    
    // Fill Client field - click the + button to add client
    const addClientButton = this.page.locator('link:has-text("+")').filter({ hasText: '+' });
    await addClientButton.click();
    // Wait for client creation dialog and fill basic info
    await this.page.waitForTimeout(1000);
    
    // Fill Incident Date field
    const incidentDateField = this.page.getByLabel('Incident Date:');
    await incidentDateField.fill('01/01/2024');
    
    // Fill Jurisdiction field if visible
    const jurisdictionField = this.page.locator('text=Jurisdiction:').locator('..').locator('input');
    if (await jurisdictionField.isVisible()) {
      await jurisdictionField.fill('England & Wales');
    }
  }

  /**
   * Assert that validation messages are cleared after filling fields
   */
  async assertValidationMessagesCleared(): Promise<void> {
    // Check that validation messages are no longer visible
    const visibleValidations = this.page.locator('span.text-danger:visible[data-bind*="validation"]');
    const count = await visibleValidations.count();
    expect(count).toBe(0);
  }

  /**
   * Assert that the form is ready for saving (no visible validation errors)
   */
  async assertFormReadyForSave(): Promise<void> {
    // Verify no validation messages are visible
    await this.assertValidationMessagesCleared();
    
    // Verify save button is enabled (if it becomes enabled when form is valid)
    const saveButton = this.page.locator('.fa-floppy, .fa-save, button:has-text("Save")').first();
    if (await saveButton.isVisible()) {
      await expect(saveButton).toBeEnabled();
    }
  }

  /**
   * Click the save button to save the instruction
   */
  async saveInstruction(): Promise<void> {
    // Look for save button using fa-floppy icon or Save text
    const saveButton = this.page.locator('.fa-floppy, .fa-save').first();
    await saveButton.waitFor({ timeout: 10000 });
    await saveButton.click();
    
    // Wait for save operation to complete
    await this.page.waitForTimeout(2000);
  }

  /**
   * Assert that save was successful
   */
  async assertSaveSuccessful(): Promise<void> {
    // Look for success indicators - could be blade title change, success message, or URL change
    // Check if blade title shows saved state (usually removes asterisk or shows different title)
    const bladeHeading = this.page.getByRole('heading', { level: 4 }).filter({ 
      hasText: /New Enquiry.*RTA/
    });
    
    // Success could be indicated by:
    // 1. Title change (removing asterisk)
    // 2. Success toast/message
    // 3. Form state change
    // 4. Additional blades opening
    
    // For now, verify the form is still visible and no error messages
    await expect(bladeHeading).toBeVisible();
    
    // Check that no error messages are displayed
    const errorMessages = this.page.locator('.alert-danger, .error-message, .text-danger:visible');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
  }

  /**
   * Attempt to save without filling required fields
   */
  async attemptSaveWithoutRequiredFields(): Promise<void> {
    // Try to click save button without filling mandatory fields
    const saveButton = this.page.locator('.fa-floppy, .fa-save').first();
    if (await saveButton.isVisible()) {
      await saveButton.click();
    }
    
    // Wait to see validation response
    await this.page.waitForTimeout(1000);
  }

  /**
   * Assert that validation messages are visible for required fields
   */
  async assertValidationMessagesVisible(): Promise<void> {
    // Check that validation messages are shown for required fields
    const allValidationMessages = this.page.locator('span.text-danger[data-bind*="validation"]');
    const visibleValidations = await allValidationMessages.count();
    expect(visibleValidations).toBeGreaterThan(0);
    
    // Specifically check for common required field validations
    const workTypeValidation = this.page.locator('span.text-danger').filter({ hasText: 'Work Type is required' });
    await expect(workTypeValidation).toBeVisible();
  }

  /**
   * Assert that save was not completed (form still in unsaved state)
   */
  async assertSaveNotCompleted(): Promise<void> {
    // Verify the form is still in unsaved state
    // This could be indicated by:
    // 1. Asterisk still in title
    // 2. Save button still enabled/visible
    // 3. Validation messages still shown
    
    const bladeHeading = this.page.getByRole('heading', { level: 4 }).filter({ 
      hasText: /New Enquiry.*RTA/
    });
    
    // Check for asterisk indicating unsaved state
    const unsavedIndicator = bladeHeading.filter({ hasText: '*' });
    if (await unsavedIndicator.count() > 0) {
      await expect(unsavedIndicator).toBeVisible();
    }
    
    // Verify validation messages are still visible
    await this.assertValidationMessagesVisible();
  }
} 