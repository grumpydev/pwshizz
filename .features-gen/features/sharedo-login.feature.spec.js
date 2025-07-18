// Generated from: features\sharedo-login.feature
import { test } from "../../tests/test-config.ts";

test.describe('Sharedo Login', () => {

  test.beforeEach('Background', async ({ Given, page }) => {
    await Given('I navigate to the Sharedo platform', null, { page }); 
  });
  
  test('Successful login with valid credentials', async ({ When, page, And, currentUser, Then }) => { 
    await When('I enter my username "pwshizz"', null, { page }); 
    await And('I enter my password', null, { page, currentUser }); 
    await And('I click the login button', null, { page }); 
    await Then('I should be successfully logged in', null, { page }); 
    await And('I should not see the login page', null, { page }); 
  });

  test('Login with invalid credentials', async ({ When, page, And, Then }) => { 
    await When('I enter my username "invalid_user"', null, { page }); 
    await And('I enter an invalid password', null, { page }); 
    await And('I click the login button', null, { page }); 
    await Then('I should see an error message', null, { page }); 
    await And('I should remain on the login page', null, { page }); 
  });

  test('Login with empty username field', async ({ When, page, And, currentUser, Then }) => { 
    await When('I enter my username ""', null, { page }); 
    await And('I enter my password', null, { page, currentUser }); 
    await Then('the login button should be disabled', null, { page }); 
    await And('I should remain on the login page', null, { page }); 
  });

  test('Login with empty password field', async ({ When, page, And, Then }) => { 
    await When('I enter my username "pwshizz"', null, { page }); 
    await And('I enter an empty password', null, { page }); 
    await Then('the login button should be disabled', null, { page }); 
    await And('I should remain on the login page', null, { page }); 
  });

  test('Login with both fields empty', async ({ When, page, And, Then }) => { 
    await When('I enter my username ""', null, { page }); 
    await And('I enter an empty password', null, { page }); 
    await Then('the login button should be disabled', null, { page }); 
    await And('I should remain on the login page', null, { page }); 
  });

  test('Login with valid username but invalid password', async ({ When, page, And, Then }) => { 
    await When('I enter my username "pwshizz"', null, { page }); 
    await And('I enter an invalid password', null, { page }); 
    await And('I click the login button', null, { page }); 
    await Then('I should see an authentication error message', null, { page }); 
    await And('I should remain on the login page', null, { page }); 
  });

  test('Login with case-sensitive username', async ({ When, page, And, currentUser, Then }) => { 
    await When('I enter my username "PWSHIZZ"', null, { page }); 
    await And('I enter my password', null, { page, currentUser }); 
    await And('I click the login button', null, { page }); 
    await Then('I should see an error message', null, { page }); 
    await And('I should remain on the login page', null, { page }); 
  });

  test('Login with spaces in username', async ({ When, page, And, currentUser, Then }) => { 
    await When('I enter my username " pwshizz "', null, { page }); 
    await And('I enter my password', null, { page, currentUser }); 
    await And('I click the login button', null, { page }); 
    await Then('I should see an error message', null, { page }); 
    await And('I should remain on the login page', null, { page }); 
  });

  test('Login form keyboard navigation', async ({ When, page, And, currentUser, Then }) => { 
    await When('I navigate to username field using keyboard', null, { page }); 
    await And('I enter my username "pwshizz" using keyboard', null, { page }); 
    await And('I navigate to password field using tab key', null, { page }); 
    await And('I enter my password using keyboard', null, { page, currentUser }); 
    await And('I submit the form using enter key', null, { page }); 
    await Then('I should be successfully logged in', null, { page }); 
  });

  test('Password field security - characters are masked', async ({ When, page, And, currentUser, Then }) => { 
    await When('I enter my username "pwshizz"', null, { page }); 
    await And('I enter my password', null, { page, currentUser }); 
    await Then('the password field should display masked characters', null, { page }); 
    await And('the actual password should not be visible in the field', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('features\\sharedo-login.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":9,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I navigate to the Sharedo platform","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I enter my username \"pwshizz\"","stepMatchArguments":[{"group":{"start":20,"value":"\"pwshizz\"","children":[{"start":21,"value":"pwshizz","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"And I enter my password","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"And I click the login button","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I should be successfully logged in","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And I should not see the login page","stepMatchArguments":[]}]},
  {"pwTestLine":18,"pickleLine":16,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I navigate to the Sharedo platform","isBg":true,"stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I enter my username \"invalid_user\"","stepMatchArguments":[{"group":{"start":20,"value":"\"invalid_user\"","children":[{"start":21,"value":"invalid_user","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"And I enter an invalid password","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"And I click the login button","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then I should see an error message","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And I should remain on the login page","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":23,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I navigate to the Sharedo platform","isBg":true,"stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"When I enter my username \"\"","stepMatchArguments":[{"group":{"start":20,"value":"\"\"","children":[{"start":21,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"And I enter my password","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Then the login button should be disabled","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"And I should remain on the login page","stepMatchArguments":[]}]},
  {"pwTestLine":33,"pickleLine":29,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I navigate to the Sharedo platform","isBg":true,"stepMatchArguments":[]},{"pwStepLine":34,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"When I enter my username \"pwshizz\"","stepMatchArguments":[{"group":{"start":20,"value":"\"pwshizz\"","children":[{"start":21,"value":"pwshizz","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":35,"gherkinStepLine":31,"keywordType":"Action","textWithKeyword":"And I enter an empty password","stepMatchArguments":[]},{"pwStepLine":36,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"Then the login button should be disabled","stepMatchArguments":[]},{"pwStepLine":37,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"And I should remain on the login page","stepMatchArguments":[]}]},
  {"pwTestLine":40,"pickleLine":35,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I navigate to the Sharedo platform","isBg":true,"stepMatchArguments":[]},{"pwStepLine":41,"gherkinStepLine":36,"keywordType":"Action","textWithKeyword":"When I enter my username \"\"","stepMatchArguments":[{"group":{"start":20,"value":"\"\"","children":[{"start":21,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":42,"gherkinStepLine":37,"keywordType":"Action","textWithKeyword":"And I enter an empty password","stepMatchArguments":[]},{"pwStepLine":43,"gherkinStepLine":38,"keywordType":"Outcome","textWithKeyword":"Then the login button should be disabled","stepMatchArguments":[]},{"pwStepLine":44,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"And I should remain on the login page","stepMatchArguments":[]}]},
  {"pwTestLine":47,"pickleLine":41,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I navigate to the Sharedo platform","isBg":true,"stepMatchArguments":[]},{"pwStepLine":48,"gherkinStepLine":42,"keywordType":"Action","textWithKeyword":"When I enter my username \"pwshizz\"","stepMatchArguments":[{"group":{"start":20,"value":"\"pwshizz\"","children":[{"start":21,"value":"pwshizz","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":49,"gherkinStepLine":43,"keywordType":"Action","textWithKeyword":"And I enter an invalid password","stepMatchArguments":[]},{"pwStepLine":50,"gherkinStepLine":44,"keywordType":"Action","textWithKeyword":"And I click the login button","stepMatchArguments":[]},{"pwStepLine":51,"gherkinStepLine":45,"keywordType":"Outcome","textWithKeyword":"Then I should see an authentication error message","stepMatchArguments":[]},{"pwStepLine":52,"gherkinStepLine":46,"keywordType":"Outcome","textWithKeyword":"And I should remain on the login page","stepMatchArguments":[]}]},
  {"pwTestLine":55,"pickleLine":48,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I navigate to the Sharedo platform","isBg":true,"stepMatchArguments":[]},{"pwStepLine":56,"gherkinStepLine":49,"keywordType":"Action","textWithKeyword":"When I enter my username \"PWSHIZZ\"","stepMatchArguments":[{"group":{"start":20,"value":"\"PWSHIZZ\"","children":[{"start":21,"value":"PWSHIZZ","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":57,"gherkinStepLine":50,"keywordType":"Action","textWithKeyword":"And I enter my password","stepMatchArguments":[]},{"pwStepLine":58,"gherkinStepLine":51,"keywordType":"Action","textWithKeyword":"And I click the login button","stepMatchArguments":[]},{"pwStepLine":59,"gherkinStepLine":52,"keywordType":"Outcome","textWithKeyword":"Then I should see an error message","stepMatchArguments":[]},{"pwStepLine":60,"gherkinStepLine":53,"keywordType":"Outcome","textWithKeyword":"And I should remain on the login page","stepMatchArguments":[]}]},
  {"pwTestLine":63,"pickleLine":55,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I navigate to the Sharedo platform","isBg":true,"stepMatchArguments":[]},{"pwStepLine":64,"gherkinStepLine":56,"keywordType":"Action","textWithKeyword":"When I enter my username \" pwshizz \"","stepMatchArguments":[{"group":{"start":20,"value":"\" pwshizz \"","children":[{"start":21,"value":" pwshizz ","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":65,"gherkinStepLine":57,"keywordType":"Action","textWithKeyword":"And I enter my password","stepMatchArguments":[]},{"pwStepLine":66,"gherkinStepLine":58,"keywordType":"Action","textWithKeyword":"And I click the login button","stepMatchArguments":[]},{"pwStepLine":67,"gherkinStepLine":59,"keywordType":"Outcome","textWithKeyword":"Then I should see an error message","stepMatchArguments":[]},{"pwStepLine":68,"gherkinStepLine":60,"keywordType":"Outcome","textWithKeyword":"And I should remain on the login page","stepMatchArguments":[]}]},
  {"pwTestLine":71,"pickleLine":62,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I navigate to the Sharedo platform","isBg":true,"stepMatchArguments":[]},{"pwStepLine":72,"gherkinStepLine":63,"keywordType":"Action","textWithKeyword":"When I navigate to username field using keyboard","stepMatchArguments":[]},{"pwStepLine":73,"gherkinStepLine":64,"keywordType":"Action","textWithKeyword":"And I enter my username \"pwshizz\" using keyboard","stepMatchArguments":[{"group":{"start":20,"value":"\"pwshizz\"","children":[{"start":21,"value":"pwshizz","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":74,"gherkinStepLine":65,"keywordType":"Action","textWithKeyword":"And I navigate to password field using tab key","stepMatchArguments":[]},{"pwStepLine":75,"gherkinStepLine":66,"keywordType":"Action","textWithKeyword":"And I enter my password using keyboard","stepMatchArguments":[]},{"pwStepLine":76,"gherkinStepLine":67,"keywordType":"Action","textWithKeyword":"And I submit the form using enter key","stepMatchArguments":[]},{"pwStepLine":77,"gherkinStepLine":68,"keywordType":"Outcome","textWithKeyword":"Then I should be successfully logged in","stepMatchArguments":[]}]},
  {"pwTestLine":80,"pickleLine":70,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I navigate to the Sharedo platform","isBg":true,"stepMatchArguments":[]},{"pwStepLine":81,"gherkinStepLine":71,"keywordType":"Action","textWithKeyword":"When I enter my username \"pwshizz\"","stepMatchArguments":[{"group":{"start":20,"value":"\"pwshizz\"","children":[{"start":21,"value":"pwshizz","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":82,"gherkinStepLine":72,"keywordType":"Action","textWithKeyword":"And I enter my password","stepMatchArguments":[]},{"pwStepLine":83,"gherkinStepLine":73,"keywordType":"Outcome","textWithKeyword":"Then the password field should display masked characters","stepMatchArguments":[]},{"pwStepLine":84,"gherkinStepLine":74,"keywordType":"Outcome","textWithKeyword":"And the actual password should not be visible in the field","stepMatchArguments":[]}]},
]; // bdd-data-end