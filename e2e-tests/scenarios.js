'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

var AxeBuilder = require('axe-webdriverjs');

describe('my app', function() {


  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/view1");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser.get('index.html#!/view1');
    });


    it('should render view1 when user navigates to /view1', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('view2', function() {

    beforeEach(function() {
      browser.get('index.html#!/view2');
    });


    it('should render view2 when user navigates to /view2', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});

describe('accessibility', function() {

  it('should have no violations', function(done) {
    browser.get('index.html').then(function(){
      AxeBuilder(browser).analyze(function(results) {
        if (results.violations.length > 0) {
          console.log(results.violations);
        }
        else {
          console.log('No accessibility violations!');
        }
        expect(results.violations.length).toBe(0);
        done();
      })
    });
  });

});
