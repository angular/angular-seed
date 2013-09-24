'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

    var ptor, appUrl;
    beforeEach(function() {
        ptor = protractor.getInstance();
        appUrl = ptor.baseUrl + 'app/index.html'; 
        ptor.get(appUrl);
    });


  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    expect(ptor.getCurrentUrl()).toBe(appUrl + "#/view1");
  });


  describe('view1', function() {

    beforeEach(function() {
      ptor.navigate().to(appUrl + '#/view1');
    });


    it('should render view1 when user navigates to /view1', function() {
      var content = ptor.findElement(protractor.By.css('[ng-view] p:first-child'));

      expect(content.getText()).toMatch(/partial for view 1/);
    });

  });


  describe('view2', function() {

    beforeEach(function() {
      ptor.navigate().to(appUrl + '#/view2');
    });


    it('should render view2 when user navigates to /view2', function() {
      var content = ptor.findElement(protractor.By.css('[ng-view] p:first-child'));

      expect(content.getText()).toMatch(/partial for view 2/);
    });

  });
});
