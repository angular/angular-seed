Cucumber Usage
==============

## Feature Files

The first step is to create a directory named "features".  Cucumber will look for
*.feature files contained in this directory.

After putting a couple of files in there (based on the end-to-end tests written in
Karma with Protractor), Cucumber will produce output like this:

<pre>
$ ./node_modules/cucumber/bin/cucumber.js --format pretty
</pre>
```gherkin
Feature: View1

  This is the place where you justify the View1 feature and put it in context of the
  whole product.


  Scenario: User navigates to View1    # features/view1.feature:6
    Given the browser is open          # features/view1.feature:7
    And the node server is running     # features/view1.feature:8
    When the user navigates to /view1  # features/view1.feature:9
    Then we see text indicating view 1 # features/view1.feature:10


Feature: View2

  This is the place where you justify the View2 feature and put it in context of the
  whole product.


  Scenario: User navigates to View2    # features/view2.feature:6
    Given the browser is open          # features/view2.feature:7
    And the node server is running     # features/view2.feature:8
    When the user navigates to /view2  # features/view2.feature:9
    Then we see text indicating view 2 # features/view2.feature:10
```
<pre>
2 scenarios (2 undefined)
8 steps (8 undefined)

You can implement step definitions for undefined steps with these snippets:
</pre>
```js
this.Given(/^the browser is open$/, function (callback) {
  // Write code here that turns the phrase above into concrete actions
  callback.pending();
});

this.Given(/^the node server is running$/, function (callback) {
  // Write code here that turns the phrase above into concrete actions
  callback.pending();
});

this.When(/^the user navigates to \/view(\d+)$/, function (arg1, callback) {
  // Write code here that turns the phrase above into concrete actions
  callback.pending();
});

this.Then(/^we see text indicating view (\d+)$/, function (arg1, callback) {
  // Write code here that turns the phrase above into concrete actions
  callback.pending();
});
```

One thing to notice is that Cucumber detected some opportunities for making
parameterized steps.  For example, the following two steps in the original feature
files ...

* When the user navigates to /view1
* When the user navigates to /view2

... were combined into a single parameterized step stub:

```js
this.When(/^the user navigates to \/view(\d+)$/, function (arg1, callback) {
  // Write code here that turns the phrase above into concrete actions
  callback.pending();
});
```

Similarly, Cucumber combined the "Then we see text..." steps.

## Step Definition Stubs

Step definitions are maintained in the subdirectory features/step_definitions.  You
can put them in any Javascript file (*.js).  The stubs shown above can be
copy-pasted into a step definition file stub that looks like this:

```js
'use strict';

var wrapper = function() {
    // TODO: Paste step stubs here
};

module.exports = wrapper;
```

Once the stubs are pasted into this stub, Cucumber will report "pending" steps
(which are not yet implemented), and subsequent "skipped" steps that could not be
executed because they follow a "pending" step.

```
$ ./node_modules/cucumber/bin/cucumber.js
P---P---

2 scenarios (2 pending)
8 steps (2 pending, 6 skipped)
```

### Protractor World

In order to use Cucumber with Protractor, we use the
[protractor-cucumber](https://github.com/andrewkeig/protractor-cucumber) package.

```
npm install protractor-cucumber --save-dev
```

This module (features/step_definitions/browser-world.js) creates a World class that
connects to an external Selenium server.

```js
// features/step_definitions/browser-world.js
// Creates a Cucumber World object that is connected to Selenium.

var pc = require('protractor-cucumber');

var steps = function() {
  var seleniumAddress = 'http://localhost:4444/wd/hub';
  var options = { browser : 'chrome', timeout : 100000 };
  this.World = pc.world(seleniumAddress, options);
};

module.exports = steps;
```

With this in place, we can now start to implement the steps in view-steps.js.  In
particular, we can refer to `this.browser` to refer to the Selenium WebDriver
object.  A new browser is instantiated for each scenario.
