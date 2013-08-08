Feature: Homepage
  As a user of super angular-seed project
  I want to see some information on home page
  So that I can concentrate on building awesome applications

  Scenario: Reading documentation
    Given I am no homepage
    When I click "view2"
    Then I should see "This is the partial for view 2."
