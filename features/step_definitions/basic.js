var assert = require("assert");

handler = function () {

  this.World = require("../support/world.js").World; // overwrite default World constructor
  var b = this.browser;

  this.Given(/^I am no homepage$/, function(callback) {
    this.visit('http://localhost:8000/app/index.html', callback);
  });

  this.When(/^I click "([^"]*)"$/, function(linkText, callback) {
    this.browser.clickLink(linkText, callback);
  });

  this.Then(/^I should see "([^"]*)"$/, function(text, callback) {
    assert.equal(this.browser.text("p:first"), text);
    callback();
  });

};
module.exports = handler;
