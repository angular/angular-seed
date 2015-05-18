'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/feature1");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser.get('index.html#/feature1');
    });


    it('should render view1 when user navigates to /feature1', function() {
      expect(element.all(by.css('body > div.container > div > div > div.jumbotron > p')).first().getText()).
        toMatch(/This is a template showcasing/);
    });

  });


  describe('view2', function() {

    beforeEach(function() {
      browser.get('index.html#/feature2');
    });


    it('should render view2 when user navigates to /feature2', function() {
      expect(element.all(by.css('[ui-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
