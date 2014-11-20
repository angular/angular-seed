Feature: View1

This is the place where you justify the View1 feature and put it in context of the
whole product.

  Scenario: User navigates to View1
    Given the browser is open
    And the node server is running
    When the user navigates to /view1
    Then we see text indicating view 1
