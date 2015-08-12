'use strict';

describe('myApp.view2 module', function() {

  beforeEach(module('myApp.view2'));

  describe('view2 controller', function(){

      it('should ....', inject(function($controller, $rootScope) {
      //spec body
      var scope = $rootScope.$new()
      var view2Ctrl = $controller('View2Ctrl', {$scope: scope});
      expect(view2Ctrl).toBeDefined();
    }));

  });
});
