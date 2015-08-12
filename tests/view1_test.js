'use strict';

describe('myApp.view1 module', function() {

  beforeEach(module('myApp.view1'));

  describe('view1 controller', function(){

    it('should ....', inject(function($controller, $rootScope) {
      //spec body
      var scope = $rootScope.$new()
      var view1Ctrl = $controller('View1Ctrl', {$scope: scope});
      expect(view1Ctrl).toBeDefined();
    }));

  });
});
