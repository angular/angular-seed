// view-steps.js
// Cucumber step definitions supporting the view features.

'use strict';

var assert = require('assert');
var http = require('http');
var nodeStatic = require('node-static');

var wrapper = function() {
  var baseUrl = 'http://localhost:8000/app/#';

  this.Given(/^the browser is open$/, function (callback) {
    // The browser is open in the "browser-world.js", so we don't have to do anything.
    callback();
  });

  this.Given(/^the node server is running$/, function (callback) {
    // We will launch the server in the "Around" function defined below, so we have nothing to do at this step.
    callback();
  });

  this.Around(function (runScenario) {
    // Create a node-static server instance to serve the project root directory.
    var staticServer = new nodeStatic.Server('./');
    // Create an HTTP server.
    console.log('Launching HTTP server.');
    var httpServer = http.createServer(function (request, response) {
      request.addListener('end', function() {
        staticServer.serve(request, response);
      }).resume();
    }).listen(8000);

    // Now run the scenario, with our clean-up "after" code as a callback.
    runScenario(function (callback) {
      // Shut down the browser.
      console.log('Quitting the browser.');
      this.browser.quit()
        .then(function () {
          // Shut down the HTTP server.
          console.log('Shutting down HTTP server.');
          httpServer.close(callback);
        });
    });
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
