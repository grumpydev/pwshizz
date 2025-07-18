const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🎯 Finding RTA Blade After Clicking Claimant RTA...');

    // Login
    console.log('📝 Logging in...');
    await page.goto('https://core1-release.sharedo.co.uk/');
    await page.locator('#username').waitFor();
    await page.locator('#username').fill('pwshizz');
    await page.locator('#password').fill('q4ruleZZZ');
    await page.locator('button:has-text("Login")').click();
    await page.waitForLoadState('networkidle');

    // Open launchpad and click Claimant RTA
    console.log('🚀 Opening launchpad and clicking Claimant RTA...');
    const launchpadTrigger = page.locator('#launchpad-widget-menu .fa-plus');
    await launchpadTrigger.click();
    await page.waitForTimeout(1000);
    
    const claimantRtaOption = page.locator('#launchpad-widget-menu *:has-text("Claimant RTA")').first();
    await claimantRtaOption.click();
    await page.waitForTimeout(4000); // Wait for blade

    console.log('🔍 Looking for ui-stack blades...');
    
    // Look for ui-stack elements more specifically
    const uiStacks = await page.locator('.ui-stack').all();
    console.log(`Found ${uiStacks.length} .ui-stack elements`);
    
    if (uiStacks.length > 0) {
      // Check each ui-stack for visibility and RTA content
      for (let i = 0; i < uiStacks.length; i++) {
        const isVisible = await uiStacks[i].isVisible();
        const hasRtaContent = await uiStacks[i].locator('*:has-text("RTA - Claimant")').count() > 0;
        
        console.log(`\nUI-Stack ${i + 1}: Visible=${isVisible}, HasRTA=${hasRtaContent}`);
        
        if (isVisible && hasRtaContent) {
          console.log('✅ Found the RTA blade!');
          
          // Look for the clickable "RTA - Claimant" option
          const rtaOptions = await uiStacks[i].locator('*:has-text("RTA - Claimant")').all();
          console.log(`Found ${rtaOptions.length} RTA - Claimant options in this blade`);
          
          for (let j = 0; j < rtaOptions.length; j++) {
            const option = rtaOptions[j];
            const isClickable = await option.isEnabled();
            const isOptionVisible = await option.isVisible();
            const text = await option.textContent();
            const tagName = await option.evaluate(el => el.tagName);
            
            console.log(`  Option ${j + 1}: ${tagName} "${text?.trim()}" - Visible: ${isOptionVisible}, Clickable: ${isClickable}`);
            
            // If this looks like the right option, click it
            if (isClickable && isOptionVisible && text?.trim() === 'RTA - Claimant') {
              console.log('🎯 Clicking on RTA - Claimant option...');
              await option.click();
              await page.waitForTimeout(3000);
              
              // Check for new blade/form
              console.log('📱 Looking for instruction creation form...');
              const formBlade = await page.locator('.ui-stack form, .ui-stack input[type="text"], .ui-stack textarea').all();
              
              if (formBlade.length > 0) {
                console.log('✅ Instruction creation form found!');
                
                // Show some form details
                const inputs = await page.locator('.ui-stack input[type="text"]').all();
                console.log(`Found ${inputs.length} text input fields in form`);
                
                for (let k = 0; k < Math.min(inputs.length, 3); k++) {
                  const placeholder = await inputs[k].getAttribute('placeholder');
                  const name = await inputs[k].getAttribute('name');
                  console.log(`  Input ${k + 1}: name="${name}" placeholder="${placeholder}"`);
                }
              } else {
                console.log('❌ No form found after clicking RTA - Claimant');
              }
              
              break;
            }
          }
          
          break; // Found the blade with RTA content
        }
      }
    } else {
      console.log('❌ No .ui-stack elements found');
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: `rta-blade-final-${Date.now()}.png`, 
      fullPage: true 
    });
    console.log('📸 Screenshot saved');
    
    console.log('\n⏸️  Pausing for manual inspection...');
    await page.waitForTimeout(20000);

  } catch (error) {
    console.error('❌ Error:', error);
    await page.screenshot({ path: 'rta-blade-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})(); 