// view-steps.js
// Cucumber step definitions supporting the view features.

'use strict';

var wrapper = function() {
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
};

module.exports = wrapper;
