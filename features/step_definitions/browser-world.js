// features/step_definitions/browser-world.js
// Creates a Cucumber World object that is connected to Selenium.

var pc = require('protractor-cucumber');

var steps = function() {
  var seleniumAddress = 'http://localhost:4444/wd/hub';
  var options = { browser : 'chrome', timeout : 100000 };
  this.World = pc.world(seleniumAddress, options);
};

module.exports = steps;
