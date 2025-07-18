Feature: Sharedo Login
  As a user of the Sharedo platform
  I want to log in to the system
  So that I can access my dashboard

  Background:
    Given I navigate to the Sharedo platform

  Scenario: Successful login with valid credentials
    When I enter my username "pwshizz"
    And I enter my password
    And I click the login button
    Then I should be successfully logged in
    And I should not see the login page

  Scenario: Login with invalid credentials
    When I enter my username "invalid_user"
    And I enter an invalid password
    And I click the login button
    Then I should see an error message
    And I should remain on the login page

  Scenario: Login with empty username field
    When I enter my username ""
    And I enter my password
    Then the login button should be disabled
    And I should remain on the login page

  Scenario: Login with empty password field
    When I enter my username "pwshizz"
    And I enter an empty password
    Then the login button should be disabled
    And I should remain on the login page

  Scenario: Login with both fields empty
    When I enter my username ""
    And I enter an empty password
    Then the login button should be disabled
    And I should remain on the login page

  Scenario: Login with valid username but invalid password
    When I enter my username "pwshizz"
    And I enter an invalid password
    And I click the login button
    Then I should see an authentication error message
    And I should remain on the login page

  Scenario: Login with case-sensitive username
    When I enter my username "PWSHIZZ"
    And I enter my password
    And I click the login button
    Then I should see an error message
    And I should remain on the login page

  Scenario: Login with spaces in username
    When I enter my username " pwshizz "
    And I enter my password
    And I click the login button
    Then I should see an error message
    And I should remain on the login page

  Scenario: Login form keyboard navigation
    When I navigate to username field using keyboard
    And I enter my username "pwshizz" using keyboard
    And I navigate to password field using tab key
    And I enter my password using keyboard
    And I submit the form using enter key
    Then I should be successfully logged in

  Scenario: Password field security - characters are masked
    When I enter my username "pwshizz"
    And I enter my password
    Then the password field should display masked characters
    And the actual password should not be visible in the field 