const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

// Ensure reports directory exists in local Documents
const reportsDir = 'C:/Users/Arif/Documents/pwshizz-reports/bdd-reports';
const reportFile = 'C:/Users/Arif/Documents/pwshizz-reports/bdd-reports/bdd-report.html';

// Clean up old report files
if (fs.existsSync(reportFile)) {
    fs.unlinkSync(reportFile);
    console.log('🗑️ Removed old BDD report');
}

if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

// Also ensure test-results directory exists
const testResultsDir = 'C:/Users/Arif/Documents/pwshizz-reports/test-results';
if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
}

// Configure the BDD HTML reporter
const options = {
    theme: 'bootstrap',
    jsonFile: 'C:/Users/Arif/Documents/pwshizz-reports/test-results/results.json',
    output: 'C:/Users/Arif/Documents/pwshizz-reports/bdd-reports/bdd-report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false,
    metadata: {
        "App Name": "Sharedo Platform",
        "Test Environment": "Release",
        "Browser": "Chromium",
        "Platform": "Windows",
        "Team": "Return of the Mac",
        "Executed": new Date().toLocaleString(),
        "Screenshots": "Available in ../screenshots/ directory"
    },
    failedSummaryReport: true,
    brandTitle: 'Sharedo BDD Test Report',
    name: 'Sharedo Platform - BDD Test Results',
    columnLayout: 1,
    storeScreenshots: true,
    screenshotsDirectory: 'C:/Users/Arif/Documents/pwshizz-reports/screenshots/',
    noInlineScreenshots: false,
    screenshotsSubfolder: '../screenshots',
    disableLog: false
};

try {
    // Convert Playwright JSON results to Cucumber format
    const playwrightResults = JSON.parse(fs.readFileSync('C:/Users/Arif/Documents/pwshizz-reports/test-results/results.json', 'utf8'));
    
    console.log('📊 Processing test results:', playwrightResults.stats);
    
    // Recursive function to extract tests from nested suites
    function extractTestsFromSuites(suites) {
        let allTests = [];
        
        for (const suite of suites) {
            // Check if this suite has specs (test scenarios)
            if (suite.specs && suite.specs.length > 0) {
                console.log(`📁 Processing suite: ${suite.title}`);
                
                for (const spec of suite.specs) {
                    if (spec.tests && spec.tests.length > 0) {
                        const test = spec.tests[0]; // BDD scenarios typically have one test per spec
                        const testResult = test.results?.[0];
                        const status = testResult?.status || test.status || 'skipped';
                        const duration = testResult?.duration || 0;
                        
                        console.log(`📝 Scenario: ${spec.title} - Status: ${status} - Duration: ${duration}ms`);
                        
                        allTests.push({
                            description: spec.title,
                            id: spec.title.toLowerCase().replace(/\s+/g, '-'),
                            keyword: "Scenario",
                            name: spec.title,
                            tags: spec.tags || [],
                            type: "scenario",
                            steps: [{
                                keyword: "When",
                                name: spec.title,
                                result: {
                                    status: status === 'passed' ? 'passed' : status === 'failed' ? 'failed' : 'skipped',
                                    duration: duration * 1000000, // Convert to nanoseconds for cucumber
                                    error_message: testResult?.error?.message || null
                                }
                            }]
                        });
                    }
                }
            }
            
            // Recursively process nested suites
            if (suite.suites && suite.suites.length > 0) {
                allTests = allTests.concat(extractTestsFromSuites(suite.suites));
            }
        }
        
        return allTests;
    }
    
    // Create cucumber-style JSON with proper nested suite handling
    const allTestElements = extractTestsFromSuites(playwrightResults.suites);
    console.log(`📊 Total scenarios extracted: ${allTestElements.length}`);
    
    const cucumberJson = [{
        description: "BDD Tests for Sharedo Platform",
        elements: allTestElements,
        id: "sharedo-bdd-tests",
        keyword: "Feature",
        name: "Sharedo Platform BDD Tests",
        tags: [],
        type: "feature",
        uri: "features/sharedo-login.feature"
    }];

    // Write the cucumber-style JSON
    fs.writeFileSync('C:/Users/Arif/Documents/pwshizz-reports/test-results/cucumber-results.json', JSON.stringify(cucumberJson, null, 2));
    
    // Always generate our custom report with screenshots instead of using cucumber-html-reporter
    console.log('📸 Generating custom BDD report with screenshot gallery...');
    
    // Helper function to generate screenshot gallery
    function generateScreenshotGallery() {
        const screenshotsDir = 'C:/Users/Arif/Documents/pwshizz-reports/screenshots';
        let galleryHtml = '<div class="screenshot-gallery"><h2>📸 Test Screenshots</h2>';
        
        try {
            if (fs.existsSync(screenshotsDir)) {
                const screenshots = fs.readdirSync(screenshotsDir)
                    .filter(file => file.endsWith('.png'))
                    .sort();
                
                if (screenshots.length > 0) {
                    console.log(`📷 Found ${screenshots.length} screenshots to include in report`);
                    galleryHtml += '<p>Click on any screenshot to view full size:</p>';
                    
                    screenshots.forEach(screenshot => {
                        const screenshotPath = `../screenshots/${screenshot}`;
                        const stepName = screenshot.replace(/\.(png|jpg|jpeg)$/i, '').replace(/-/g, ' ');
                        
                        galleryHtml += `
                        <div class="screenshot">
                            <img src="${screenshotPath}" alt="${stepName}" onclick="openModal('${screenshotPath}')" />
                            <div class="screenshot-title">${stepName}</div>
                        </div>`;
                    });
                } else {
                    galleryHtml += '<p>No screenshots available for this test run.</p>';
                }
            } else {
                galleryHtml += '<p>Screenshots directory not found.</p>';
                console.log('⚠️ Screenshots directory does not exist');
            }
        } catch (error) {
            galleryHtml += `<p>Error accessing screenshots: ${error.message}</p>`;
            console.log('❌ Error accessing screenshots directory:', error.message);
        }
        
        galleryHtml += '</div>';
        return galleryHtml;
    }

    // Generate test results for display
    const testResults = allTestElements.map(element => ({
        title: element.name,
        status: element.steps[0].result.status,
        duration: element.steps[0].result.duration / 1000000 // Convert back to milliseconds
    }));

    // Generate detailed step information from screenshots
    function generateStepsFromScreenshots() {
        const screenshotsDir = 'C:/Users/Arif/Documents/pwshizz-reports/screenshots';
        let stepsByScenario = {
            'Successful login with valid credentials': [],
            'Login with invalid credentials': []
        };
        
        // Define actual step sequences from feature file
        const actualSteps = {
            'Successful login with valid credentials': [
                'Given I navigate to the Sharedo platform',
                'When I enter my username "pwshizz"',
                'And I enter my password',
                'And I click the login button',
                'Then I should be successfully logged in',
                'And I should not see the login page'
            ],
            'Login with invalid credentials': [
                'Given I navigate to the Sharedo platform',
                'When I enter my username "invalid_user"',
                'And I enter an invalid password',
                'And I click the login button',
                'Then I should see an error message',
                'And I should remain on the login page'
            ]
        };
        
        try {
            if (fs.existsSync(screenshotsDir)) {
                const screenshots = fs.readdirSync(screenshotsDir)
                    .filter(file => file.endsWith('.png'))
                    .sort();
                
                // Map screenshots to actual steps based on sequence and content
                const screenshotMapping = [
                    { pattern: '01-page-loaded', step: 'Given I navigate to the Sharedo platform' },
                    { pattern: '02-username-entered-pwshizz', step: 'When I enter my username "pwshizz"', scenario: 'valid' },
                    { pattern: '02-username-entered-invalid_user', step: 'When I enter my username "invalid_user"', scenario: 'invalid' },
                    { pattern: '03-password-entered', step: 'And I enter my password', scenario: 'valid' },
                    { pattern: '03-invalid-password-entered', step: 'And I enter an invalid password', scenario: 'invalid' },
                    { pattern: '04-before-login-click', step: 'And I click the login button' },
                    { pattern: '05-after-login-attempt', step: 'And I click the login button (result)' },
                    { pattern: '06-login-success-verified', step: 'Then I should be successfully logged in', scenario: 'valid' },
                    { pattern: '06-checking-for-error', step: 'Then I should see an error message', scenario: 'invalid' },
                    { pattern: '07-not-on-login-page', step: 'And I should not see the login page', scenario: 'valid' },
                    { pattern: '07-error-message-found', step: 'Then I should see an error message (verified)', scenario: 'invalid' },
                    { pattern: '08-still-on-login-page', step: 'And I should remain on the login page', scenario: 'invalid' }
                ];
                
                screenshots.forEach(screenshot => {
                    const mapping = screenshotMapping.find(map => screenshot.includes(map.pattern));
                    if (mapping) {
                        const stepTitle = mapping.step;
                        let scenarioType;
                        
                        if (mapping.scenario === 'valid') {
                            scenarioType = 'Successful login with valid credentials';
                        } else if (mapping.scenario === 'invalid') {
                            scenarioType = 'Login with invalid credentials';
                        } else {
                            // For shared steps, add to both scenarios
                            ['Successful login with valid credentials', 'Login with invalid credentials'].forEach(scenario => {
                                stepsByScenario[scenario].push({
                                    name: stepTitle,
                                    screenshot: `../screenshots/${screenshot}`,
                                    status: 'passed'
                                });
                            });
                            return;
                        }
                        
                        stepsByScenario[scenarioType].push({
                            name: stepTitle,
                            screenshot: `../screenshots/${screenshot}`,
                            status: 'passed'
                        });
                    }
                });
                
                // Remove duplicates and sort by step order
                Object.keys(stepsByScenario).forEach(scenario => {
                    const seen = new Set();
                    stepsByScenario[scenario] = stepsByScenario[scenario].filter(step => {
                        if (seen.has(step.name)) return false;
                        seen.add(step.name);
                        return true;
                    });
                });
            }
        } catch (error) {
            console.log('❌ Error reading screenshots for step details:', error.message);
        }
        
        return stepsByScenario;
    }

    // Calculate statistics for graphs
    const stats = {
        total: testResults.length,
        passed: testResults.filter(t => t.status === 'passed').length,
        failed: testResults.filter(t => t.status === 'failed').length,
        skipped: testResults.filter(t => t.status === 'skipped').length,
        totalDuration: testResults.reduce((sum, t) => sum + t.duration, 0),
        avgDuration: testResults.length > 0 ? testResults.reduce((sum, t) => sum + t.duration, 0) / testResults.length : 0
    };

    const stepsByScenario = generateStepsFromScreenshots();

    // Create a detailed custom report with screenshots and expandable steps
    const scenarioHtml = testResults.map((test, index) => {
        const statusIcon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏸️';
        const statusClass = test.status === 'passed' ? 'passed' : test.status === 'failed' ? 'failed' : 'skipped';
        const steps = stepsByScenario[test.title] || [];
        
        const stepsHtml = steps.map((step, stepIndex) => `
            <div class="step">
                <div class="step-header">
                    <span class="step-icon">📍</span>
                    <span class="step-name">${step.name}</span>
                    <span class="step-status ${step.status}">${step.status.toUpperCase()}</span>
                </div>
                <div class="step-screenshot">
                    <img src="${step.screenshot}" alt="${step.name}" onclick="openModal('${step.screenshot}')" />
                </div>
            </div>
        `).join('');
        
        return `
        <div class="scenario ${statusClass}">
            <div class="scenario-header" onclick="toggleSteps(${index})">
                <h3>${statusIcon} ${test.title}</h3>
                <div class="scenario-meta">
                    <span class="status">Status: ${test.status.toUpperCase()}</span>
                    <span class="duration">Duration: ${(test.duration / 1000).toFixed(2)}s</span>
                    <span class="expand-icon" id="expand-${index}">▼</span>
                </div>
            </div>
            <div class="scenario-steps" id="steps-${index}" style="display: none;">
                <h4>📋 Test Steps (${steps.length} steps)</h4>
                ${stepsHtml}
            </div>
        </div>`;
    }).join('');
    
    const timestamp = new Date().toLocaleString();
    const cacheId = Date.now(); // Cache busting
    
         const customReportHtml = `
     <!DOCTYPE html>
     <html>
     <head>
         <title>Sharedo BDD Test Report - ${timestamp}</title>
         <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
         <meta http-equiv="Pragma" content="no-cache">
         <meta http-equiv="Expires" content="0">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
         <style>
             body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }
             .container { max-width: 1200px; margin: 0 auto; }
             .header { background: linear-gradient(135deg, #2196F3, #1976D2); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
             .header h1 { margin: 0; font-size: 2.5em; font-weight: 300; }
             .header p { margin: 10px 0; opacity: 0.9; }
             
             /* Statistics Dashboard */
             .stats-dashboard { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px; }
             .stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
             .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; }
             .stat-number { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
             .stat-label { color: #666; font-size: 0.9em; }
             .stat-passed { color: #4CAF50; }
             .stat-failed { color: #f44336; }
             .stat-total { color: #2196F3; }
             .stat-duration { color: #ff9800; }
             
             .chart-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
             .chart-container canvas { max-height: 300px; }
             
             /* Summary */
             .summary { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
             
             /* Scenarios */
             .scenario { background: white; margin: 20px 0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.2s; }
             .scenario:hover { transform: translateY(-2px); }
             .scenario-header { padding: 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background-color 0.2s; }
             .scenario-header:hover { background-color: #f8f9fa; }
             .scenario-meta { display: flex; gap: 20px; align-items: center; }
             .scenario-meta span { padding: 5px 10px; border-radius: 15px; font-size: 0.85em; }
             .status { background: #e9ecef; color: #495057; }
             .duration { background: #fff3cd; color: #856404; }
             .expand-icon { font-size: 1.2em; transition: transform 0.3s; }
             .expand-icon.expanded { transform: rotate(180deg); }
             
             .passed { border-left: 5px solid #4CAF50; }
             .failed { border-left: 5px solid #f44336; }
             .skipped { border-left: 5px solid #ff9800; }
             
             /* Steps */
             .scenario-steps { padding: 0 20px 20px; background: #f8f9fa; }
             .step { background: white; margin: 10px 0; padding: 15px; border-radius: 6px; border-left: 3px solid #ddd; }
             .step-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
             .step-name { font-weight: 500; color: #333; }
             .step-icon { margin-right: 8px; }
             .step-status { padding: 3px 8px; border-radius: 10px; font-size: 0.75em; font-weight: bold; }
             .step-status.passed { background: #d4edda; color: #155724; }
             .step-screenshot img { max-width: 150px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; transition: transform 0.2s; }
             .step-screenshot img:hover { transform: scale(1.02); }
             
             /* Screenshot Gallery */
             .screenshot-gallery { margin: 20px 0; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
             .screenshot { margin: 15px; display: inline-block; text-align: center; transition: transform 0.2s; }
             .screenshot:hover { transform: translateY(-5px); }
             .screenshot img { max-width: 180px; border: 2px solid #ddd; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
             .screenshot img:hover { border-color: #2196F3; box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3); }
             .screenshot-title { font-size: 0.8em; margin-top: 8px; color: #666; font-weight: 500; }
             
             /* Modal */
             .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); }
             .modal-content { margin: 2% auto; display: block; max-width: 95%; max-height: 95%; border-radius: 8px; }
             .close { position: absolute; top: 20px; right: 35px; color: #f1f1f1; font-size: 40px; font-weight: bold; cursor: pointer; transition: color 0.2s; }
             .close:hover { color: #2196F3; }
             
             h1, h2, h3 { margin-top: 0; }
             h2 { color: #2196F3; }
             .timestamp { font-size: 0.9em; opacity: 0.8; margin-top: 15px; }
             
             @media (max-width: 768px) {
                 .stats-dashboard { grid-template-columns: 1fr; }
                 .scenario-meta { flex-direction: column; gap: 10px; }
                 .container { padding: 10px; }
             }
         </style>
         <script>
             function openModal(src) {
                 document.getElementById('modal').style.display = 'block';
                 document.getElementById('modal-img').src = src;
             }
             function closeModal() {
                 document.getElementById('modal').style.display = 'none';
             }
             function toggleSteps(index) {
                 const steps = document.getElementById('steps-' + index);
                 const icon = document.getElementById('expand-' + index);
                 if (steps.style.display === 'none') {
                     steps.style.display = 'block';
                     icon.classList.add('expanded');
                 } else {
                     steps.style.display = 'none';
                     icon.classList.remove('expanded');
                 }
             }
             function expandAll() {
                 const allSteps = document.querySelectorAll('.scenario-steps');
                 const allIcons = document.querySelectorAll('.expand-icon');
                 allSteps.forEach(steps => steps.style.display = 'block');
                 allIcons.forEach(icon => icon.classList.add('expanded'));
             }
             function collapseAll() {
                 const allSteps = document.querySelectorAll('.scenario-steps');
                 const allIcons = document.querySelectorAll('.expand-icon');
                 allSteps.forEach(steps => steps.style.display = 'none');
                 allIcons.forEach(icon => icon.classList.remove('expanded'));
             }
             document.addEventListener('keydown', function(e) {
                 if (e.key === 'Escape') closeModal();
             });
             
             // Initialize charts when page loads
             window.addEventListener('load', function() {
                 // Pie chart for test results
                 const ctx1 = document.getElementById('resultsChart').getContext('2d');
                 new Chart(ctx1, {
                     type: 'doughnut',
                     data: {
                         labels: ['Passed', 'Failed', 'Skipped'],
                         datasets: [{
                             data: [${stats.passed}, ${stats.failed}, ${stats.skipped}],
                             backgroundColor: ['#4CAF50', '#f44336', '#ff9800'],
                             borderWidth: 0
                         }]
                     },
                     options: {
                         responsive: true,
                         plugins: {
                             title: { display: true, text: 'Test Results Distribution' },
                             legend: { position: 'bottom' }
                         }
                     }
                 });
             });
         </script>
     </head>
         <body>
         <div class="container">
             <div class="header">
                 <h1>🥒 Sharedo BDD Test Report</h1>
                 <p>Team: Return of the Mac | Generated: ${timestamp}</p>
                 <p>Platform: Sharedo Release Environment</p>
                 <div class="timestamp">Cache ID: ${cacheId}</div>
             </div>
             
             <!-- Statistics Dashboard -->
             <div class="stats-dashboard">
                 <div class="stats-cards">
                     <div class="stat-card">
                         <div class="stat-number stat-total">${stats.total}</div>
                         <div class="stat-label">Total Tests</div>
                     </div>
                     <div class="stat-card">
                         <div class="stat-number stat-passed">${stats.passed}</div>
                         <div class="stat-label">Passed</div>
                     </div>
                     <div class="stat-card">
                         <div class="stat-number stat-failed">${stats.failed}</div>
                         <div class="stat-label">Failed</div>
                     </div>
                     <div class="stat-card">
                         <div class="stat-number stat-duration">${(stats.totalDuration / 1000).toFixed(1)}s</div>
                         <div class="stat-label">Total Duration</div>
                     </div>
                 </div>
                 <div class="chart-container">
                     <canvas id="resultsChart"></canvas>
                 </div>
             </div>
             
             <!-- Test Scenarios with Expandable Steps -->
             <div class="summary">
                 <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                     <h2>📋 Test Scenarios</h2>
                     <div>
                         <button onclick="expandAll()" style="margin-right: 10px; padding: 8px 15px; border: 1px solid #2196F3; background: white; color: #2196F3; border-radius: 4px; cursor: pointer;">Expand All</button>
                         <button onclick="collapseAll()" style="padding: 8px 15px; border: 1px solid #666; background: white; color: #666; border-radius: 4px; cursor: pointer;">Collapse All</button>
                     </div>
                 </div>
                 <p><strong>Success Rate:</strong> ${((stats.passed / stats.total) * 100).toFixed(1)}% | <strong>Average Duration:</strong> ${(stats.avgDuration / 1000).toFixed(2)}s per test</p>
             </div>
             
             ${scenarioHtml}
             
             ${generateScreenshotGallery()}
             
             <!-- Modal for full-size screenshot viewing -->
             <div id="modal" class="modal" onclick="closeModal()">
                 <span class="close" onclick="closeModal()">&times;</span>
                 <img class="modal-content" id="modal-img">
             </div>
             
             <div style="text-align: center; margin-top: 40px; color: #666; font-size: 0.9em;">
                 Report generated at ${timestamp} | Cache ID: ${cacheId} | 📸 ${Object.values(stepsByScenario).flat().length} screenshots captured
             </div>
         </div>
     </body>
    </html>`;
    
    fs.writeFileSync('C:/Users/Arif/Documents/pwshizz-reports/bdd-reports/bdd-report.html', customReportHtml);
    
    // Verify the report was created and add timestamp
    if (fs.existsSync(reportFile)) {
        const stats = fs.statSync(reportFile);
        console.log('✅ Custom BDD HTML Report generated successfully!');
        console.log('📁 Report location: C:/Users/Arif/Documents/pwshizz-reports/bdd-reports/bdd-report.html');
        console.log('📅 Generated at:', new Date().toLocaleString());
        console.log('📊 File size:', (stats.size / 1024).toFixed(2), 'KB');
        console.log('📸 Screenshots included in interactive gallery');
        console.log('🌐 Open in browser to view detailed results with visuals');
    } else {
        throw new Error('Custom report file was not created successfully');
    }
    
} catch (error) {
    console.error('❌ Error generating BDD report:', error.message);
    console.error('📄 Full error details:', error);
    console.log('📁 Report may have been created in fallback mode');
} 