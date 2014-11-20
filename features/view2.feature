Feature: View2

This is the place where you justify the View2 feature and put it in context of the
whole product.

  Scenario: User navigates to View2
    Given the browser is open
    And the node server is running
    When the user navigates to /view2
    Then we see text indicating view 2
