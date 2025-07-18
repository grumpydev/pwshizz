const { chromium } = require('playwright');

// Simulate LaunchpadPage functionality for exploration
class LaunchpadPage {
  constructor(page) {
    this.page = page;
    this.launchpadMenu = page.locator('#launchpad-widget-menu');
    this.launchpadTrigger = page.locator('#launchpad-widget-menu .fa-plus');
  }

  async openLaunchpad() {
    await this.launchpadTrigger.waitFor({ timeout: 10000 });
    await this.launchpadTrigger.click();
    await this.page.waitForTimeout(1000);
  }

  async findInstructionType(instructionName) {
    const instructionLocator = this.launchpadMenu.locator(`*:has-text("${instructionName}")`);
    const count = await instructionLocator.count();
    return count > 0 ? instructionLocator.first() : null;
  }

  async selectInstructionType(instructionName) {
    const instructionElement = await this.findInstructionType(instructionName);
    if (!instructionElement) {
      throw new Error(`Instruction type "${instructionName}" not found in launchpad`);
    }
    await instructionElement.click();
    await this.page.waitForTimeout(3000); // Wait longer for blade to open
  }
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🎯 Exploring Claimant RTA Instruction Creation Workflow...');

    // Login
    console.log('📝 Logging in...');
    await page.goto('https://core1-release.sharedo.co.uk/');
    await page.locator('#username').waitFor();
    await page.locator('#username').fill('pwshizz');
    await page.locator('#password').fill('q4ruleZZZ');
    await page.locator('button:has-text("Login")').click();
    await page.waitForLoadState('networkidle');

    // Step 1: Open Launchpad
    console.log('🚀 Step 1: Opening launchpad...');
    const launchpadPage = new LaunchpadPage(page);
    await launchpadPage.openLaunchpad();
    console.log('   ✅ Launchpad opened');

    // Step 2: Click on Claimant RTA
    console.log('🎯 Step 2: Clicking on "Claimant RTA"...');
    await launchpadPage.selectInstructionType('Claimant RTA');
    console.log('   ✅ Clicked on Claimant RTA');

    // Step 3: Wait longer and look for blades more thoroughly
    console.log('📱 Step 3: Waiting for blade to appear and checking multiple selectors...');
    await page.waitForTimeout(4000); // Wait longer
    
    // Check for multiple potential blade selectors
    const bladeSelectors = [
      '.ui-stack',
      '[class*="ui-stack"]',
      '[class*="blade"]',
      '[class*="panel"]',
      '[class*="sidebar"]',
      '.dui-stack',
      '[class*="stack"]'
    ];
    
    let foundBlades = false;
    for (const selector of bladeSelectors) {
      const elements = await page.locator(selector).all();
      if (elements.length > 0) {
        console.log(`   Found ${elements.length} elements with selector "${selector}"`);
        foundBlades = true;
        
        // Examine the first few elements
        for (let i = 0; i < Math.min(elements.length, 3); i++) {
          try {
            const isVisible = await elements[i].isVisible();
            const classes = await elements[i].getAttribute('class');
            console.log(`     Element ${i + 1}: Visible: ${isVisible}, Classes: ${classes}`);
            
            if (isVisible) {
              // Check for RTA - Claimant within this element
              const rtaContent = await elements[i].locator('*:has-text("RTA - Claimant")').count();
              if (rtaContent > 0) {
                console.log(`       ✅ Contains "RTA - Claimant" content!`);
              }
            }
          } catch (e) {
            console.log(`     Element ${i + 1}: Error examining - ${e.message}`);
          }
        }
      }
    }
    
    if (!foundBlades) {
      console.log('   ❌ No blade elements found with common selectors');
    }

    // Step 4: Examine the 32 "RTA - Claimant" elements more closely
    console.log('\n🔍 Step 4: Examining the "RTA - Claimant" elements found...');
    const rtaClaimantElements = page.locator('*:has-text("RTA - Claimant")');
    const count = await rtaClaimantElements.count();
    console.log(`   Found ${count} elements containing "RTA - Claimant"`);
    
    // Look at the first few visible ones
    for (let i = 0; i < Math.min(count, 5); i++) {
      try {
        const element = rtaClaimantElements.nth(i);
        const isVisible = await element.isVisible();
        const isClickable = await element.isEnabled();
        
        if (isVisible && isClickable) {
          const text = await element.textContent();
          const tagName = await element.evaluate(el => el.tagName);
          const classes = await element.getAttribute('class');
          const parentClasses = await element.evaluate(el => el.parentElement?.className || 'no-parent');
          
          console.log(`\n   Clickable Element ${i + 1}:`);
          console.log(`     Tag: ${tagName}, Text: "${text?.trim()}"`);
          console.log(`     Classes: ${classes}`);
          console.log(`     Parent Classes: ${parentClasses}`);
          
          // Check if this looks like it's in a blade/panel
          if (parentClasses.includes('ui-stack') || parentClasses.includes('blade') || parentClasses.includes('panel')) {
            console.log('     🎯 This element appears to be in a blade/panel!');
            
            // Try clicking this one
            console.log('     🖱️  Attempting to click this element...');
            await element.click();
            await page.waitForTimeout(3000);
            
            // Check what happened after clicking
            console.log('     📱 Checking for new blades after click...');
            const newUiStacks = await page.locator('.ui-stack, [class*="ui-stack"], [class*="blade"], [class*="panel"]').all();
            console.log(`     Found ${newUiStacks.length} potential blade elements after click`);
            
            // Look for form elements
            const formElements = await page.locator('form, input[type="text"], textarea, select').all();
            console.log(`     Found ${formElements.length} form elements on page`);
            
            if (formElements.length > 0) {
              console.log('     ✅ Form elements detected - likely in instruction creation blade!');
            }
            
            break; // Stop after first successful click
          }
        }
      } catch (e) {
        console.log(`   Element ${i + 1}: Error - ${e.message}`);
      }
    }
    
    // Take screenshot for manual review
    await page.screenshot({ 
      path: `claimant-rta-detailed-${Date.now()}.png`, 
      fullPage: true 
    });
    console.log('\n📸 Screenshot taken for manual review');
    
    console.log('\n⏸️  Pausing for manual exploration...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Error exploring Claimant RTA workflow:', error);
    await page.screenshot({ path: 'claimant-rta-workflow-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})(); 