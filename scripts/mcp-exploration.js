const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function exploreSharedo() {
  console.log('🎭 MCP-Enhanced Exploration: Starting Sharedo application discovery...');
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false, // Run in headed mode to see what's happening
    viewport: { width: 1536, height: 864 }
  });
  
  try {
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: { width: 1536, height: 864 }
    });
    
    const page = await context.newPage();
    
    // Ensure screenshots directory exists
    const screenshotsDir = 'C:/Users/Arif/Documents/pwshizz-reports/screenshots';
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    // Step 1: Navigate and capture initial state
    console.log('📍 MCP Step 1: Navigate to Sharedo platform');
    await page.goto('https://core1-release.sharedo.co.uk/');
    await page.waitForLoadState('networkidle');
    
    const initialUrl = page.url();
    const initialTitle = await page.title();
    console.log(`🌐 Initial URL: ${initialUrl}`);
    console.log(`📄 Initial Title: ${initialTitle}`);
    
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mcp-01-initial-page.png'),
      fullPage: true 
    });
    
    // Step 2: Discover all form elements systematically
    console.log('🔍 MCP Step 2: Systematic form element discovery');
    
    // Discover input fields with all their properties
    const inputs = await page.locator('input').all();
    console.log(`🔍 Found ${inputs.length} input elements:`);
    
    const inputData = [];
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const boundingBox = await input.boundingBox();
      const inputInfo = {
        index: i,
        type: await input.getAttribute('type') || 'text',
        name: await input.getAttribute('name') || '',
        id: await input.getAttribute('id') || '',
        placeholder: await input.getAttribute('placeholder') || '',
        className: await input.getAttribute('class') || '',
        value: await input.getAttribute('value') || '',
        visible: await input.isVisible(),
        enabled: await input.isEnabled(),
        boundingBox: boundingBox || { x: 0, y: 0, width: 0, height: 0 },
        selector: {
          byName: await input.getAttribute('name') ? `[name="${await input.getAttribute('name')}"]` : null,
          byId: await input.getAttribute('id') ? `#${await input.getAttribute('id')}` : null,
          byType: `input[type="${await input.getAttribute('type') || 'text'}"]`,
          byClass: await input.getAttribute('class') ? `.${(await input.getAttribute('class')).split(' ')[0]}` : null
        }
      };
      inputData.push(inputInfo);
      console.log(`  Input ${i + 1}:`, JSON.stringify(inputInfo, null, 2));
    }
    
    // Discover buttons with all their properties
    const buttons = await page.locator('button').all();
    console.log(`🔘 Found ${buttons.length} button elements:`);
    
    const buttonData = [];
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const boundingBox = await button.boundingBox();
      const buttonInfo = {
        index: i,
        text: await button.textContent(),
        type: await button.getAttribute('type') || '',
        className: await button.getAttribute('class') || '',
        id: await button.getAttribute('id') || '',
        visible: await button.isVisible(),
        enabled: await button.isEnabled(),
        boundingBox: boundingBox || { x: 0, y: 0, width: 0, height: 0 },
        selector: {
          byText: await button.textContent() ? `button:has-text("${await button.textContent()}")` : null,
          byClass: await button.getAttribute('class') ? `.${(await button.getAttribute('class')).split(' ')[0]}` : null,
          byType: await button.getAttribute('type') ? `button[type="${await button.getAttribute('type')}"]` : null,
          byId: await button.getAttribute('id') ? `#${await button.getAttribute('id')}` : null
        }
      };
      buttonData.push(buttonInfo);
      console.log(`  Button ${i + 1}:`, JSON.stringify(buttonInfo, null, 2));
    }
    
    // Step 3: Identify the optimal selectors for login elements
    console.log('🎯 MCP Step 3: Identifying optimal login element selectors');
    
    const usernameField = inputData.find(input => 
      input.type === 'text' || 
      input.name.toLowerCase().includes('username') || 
      input.placeholder.toLowerCase().includes('username') ||
      input.id.toLowerCase().includes('username')
    );
    
    const passwordField = inputData.find(input => 
      input.type === 'password'
    );
    
    const loginButton = buttonData.find(button => 
      button.text && (
        button.text.toLowerCase().includes('login') || 
        button.text.toLowerCase().includes('sign in') ||
        button.type === 'submit'
      )
    );
    
    console.log('🎯 Optimal selectors identified:');
    console.log('  Username field:', usernameField?.selector);
    console.log('  Password field:', passwordField?.selector);
    console.log('  Login button:', loginButton?.selector);
    
    // Step 4: Test the actual login flow with discovered elements
    if (usernameField && passwordField && loginButton) {
      console.log('🚀 MCP Step 4: Testing actual login flow with discovered elements');
      
      // Determine best selector for username
      const usernameSelector = usernameField.selector.byName || 
                               usernameField.selector.byId || 
                               usernameField.selector.byType;
      
      // Determine best selector for password
      const passwordSelector = passwordField.selector.byName || 
                               passwordField.selector.byId || 
                               passwordField.selector.byType;
      
      // Determine best selector for login button
      const loginSelector = loginButton.selector.byText || 
                            loginButton.selector.byClass || 
                            loginButton.selector.byType;
      
      console.log(`🎯 Using selectors: username="${usernameSelector}", password="${passwordSelector}", login="${loginSelector}"`);
      
      // Test with valid credentials
      await page.fill(usernameSelector, 'pwshizz');
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'mcp-02-username-filled.png') 
      });
      
      await page.fill(passwordSelector, 'q4ruleZZZ');
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'mcp-03-password-filled.png') 
      });
      
      // Check if login button is enabled before clicking
      const buttonEnabled = await page.locator(loginSelector).isEnabled();
      console.log(`🔘 Login button enabled: ${buttonEnabled}`);
      
      if (buttonEnabled) {
        await page.click(loginSelector);
        await page.screenshot({ 
          path: path.join(screenshotsDir, 'mcp-04-login-clicked.png') 
        });
        
        // Wait and observe the result
        await page.waitForTimeout(3000);
        await page.waitForLoadState('networkidle');
        
        const newUrl = page.url();
        const newTitle = await page.title();
        
        console.log(`🌐 After login URL: ${newUrl}`);
        console.log(`📄 After login Title: ${newTitle}`);
        
        // Check if we're still on login page or moved to dashboard
        const stillOnLogin = newUrl.includes('login') || newUrl === initialUrl;
        console.log(`🔍 Still on login page: ${stillOnLogin}`);
        
        // Look for success indicators
        const possibleSuccessElements = await page.locator('[class*="dashboard"], [class*="home"], [class*="main"], h1, h2').all();
        for (const element of possibleSuccessElements) {
          const text = await element.textContent();
          if (text) {
            console.log(`📋 Found heading/main element: "${text}"`);
          }
        }
        
        await page.screenshot({ 
          path: path.join(screenshotsDir, 'mcp-05-final-state.png'),
          fullPage: true 
        });
      }
      
      // Step 5: Test error scenarios
      console.log('🧪 MCP Step 5: Testing error scenarios');
      
      // Navigate back to login if needed
      if (page.url() !== initialUrl) {
        await page.goto('https://core1-release.sharedo.co.uk/');
        await page.waitForLoadState('networkidle');
      }
      
      // Test with invalid credentials
      await page.fill(usernameSelector, 'invalid_user');
      await page.fill(passwordSelector, 'wrong_password');
      
      const invalidButtonEnabled = await page.locator(loginSelector).isEnabled();
      console.log(`🔘 Login button enabled with invalid credentials: ${invalidButtonEnabled}`);
      
      if (invalidButtonEnabled) {
        await page.click(loginSelector);
        await page.waitForTimeout(2000);
        
        // Look for error messages
        const errorSelectors = [
          '[class*="error"]',
          '[class*="alert"]',
          '[class*="message"]',
          '.error',
          '.alert-danger',
          '.validation-error'
        ];
        
        for (const selector of errorSelectors) {
          try {
            const errorElements = await page.locator(selector).all();
            for (const element of errorElements) {
              if (await element.isVisible()) {
                const errorText = await element.textContent();
                console.log(`❌ Found error message with selector "${selector}": "${errorText}"`);
              }
            }
          } catch (e) {
            // Continue to next selector
          }
        }
        
        await page.screenshot({ 
          path: path.join(screenshotsDir, 'mcp-06-error-scenario.png') 
        });
      }
      
      // Step 6: Test empty field behavior
      console.log('🔍 MCP Step 6: Testing empty field behavior');
      
      await page.fill(usernameSelector, '');
      await page.fill(passwordSelector, '');
      
      const emptyFieldsButtonEnabled = await page.locator(loginSelector).isEnabled();
      console.log(`🔘 Login button enabled with empty fields: ${emptyFieldsButtonEnabled}`);
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'mcp-07-empty-fields.png') 
      });
      
    } else {
      console.log('❌ Could not identify all required login elements');
      console.log(`Username field found: ${!!usernameField}`);
      console.log(`Password field found: ${!!passwordField}`);
      console.log(`Login button found: ${!!loginButton}`);
    }
    
    // Step 7: Generate enhanced selector recommendations
    console.log('📝 MCP Step 7: Generating selector recommendations for BDD enhancement');
    
    const recommendations = {
      usernameField: usernameField ? {
        primary: usernameField.selector.byName || usernameField.selector.byId,
        fallback: usernameField.selector.byType,
        properties: {
          type: usernameField.type,
          name: usernameField.name,
          id: usernameField.id,
          placeholder: usernameField.placeholder
        }
      } : null,
      passwordField: passwordField ? {
        primary: passwordField.selector.byName || passwordField.selector.byId,
        fallback: passwordField.selector.byType,
        properties: {
          type: passwordField.type,
          name: passwordField.name,
          id: passwordField.id,
          placeholder: passwordField.placeholder
        }
      } : null,
      loginButton: loginButton ? {
        primary: loginButton.selector.byText || loginButton.selector.byClass,
        fallback: loginButton.selector.byType,
        properties: {
          text: loginButton.text,
          type: loginButton.type,
          className: loginButton.className,
          id: loginButton.id
        }
      } : null
    };
    
    console.log('📋 Selector Recommendations:', JSON.stringify(recommendations, null, 2));
    
    // Store recommendations for BDD enhancement
    const recommendationsPath = 'C:/Users/Arif/Documents/pwshizz-reports/mcp-selector-recommendations.json';
    fs.writeFileSync(recommendationsPath, JSON.stringify(recommendations, null, 2));
    console.log(`💾 Selector recommendations saved to: ${recommendationsPath}`);
    
    // Store all discovered data for analysis
    const explorationData = {
      initialUrl,
      initialTitle,
      inputData,
      buttonData,
      recommendations,
      timestamp: new Date().toISOString()
    };
    
    const explorationDataPath = 'C:/Users/Arif/Documents/pwshizz-reports/mcp-exploration-data.json';
    fs.writeFileSync(explorationDataPath, JSON.stringify(explorationData, null, 2));
    console.log(`💾 Full exploration data saved to: ${explorationDataPath}`);
    
  } catch (error) {
    console.error('❌ Error during exploration:', error);
  } finally {
    await browser.close();
  }
}

// Run the exploration
exploreSharedo().then(() => {
  console.log('✅ MCP exploration completed!');
}).catch(error => {
  console.error('❌ MCP exploration failed:', error);
}); 