// view-steps.js
// Cucumber step definitions supporting the view features.

'use strict';

var assert = require('assert');

var wrapper = function() {
  var baseUrl = 'http://localhost:8000/app/#';

  this.Given(/^the browser is open$/, function (callback) {
    // The browser is open in the "browser-world.js", so we don't have to do anything.
    callback();
  });

  this.Given(/^the node server is running$/, function (callback) {
    // For now, we assume that the server is launched externally via "npm start".
    callback();
  });

  this.When(/^the user navigates to (\/.*)$/, function (url, callback) {
    // Tell the browser to navigate to the specified URL.
    this.browser.get(baseUrl + url)
      .then(function () {
        callback();
      });
  });

  this.Then(/^we see text indicating view (\d+)$/, function (viewNumber, callback) {
    this.browser.findElements(this.by.css('[ng-view] p'))
      .then(function (elements) {
        assert(elements);
        var firstElement = elements[0];
        assert(firstElement);
        return firstElement.getText();
      })
      .then(function (text) {
        console.log('text: ' + text);
        assert(text == 'This is the partial for view ' + viewNumber + '.');
        callback();
      });
  });
};

module.exports = wrapper;
