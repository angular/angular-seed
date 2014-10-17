'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */
describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /home when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/home");
  });
});
