'use strict';

describe('myApp.view1 module', function() {

  beforeEach(module('myApp.view1'));

  describe('view1 controller', function(){
    var scope;
    var controller;
    
    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('View1Ctrl', {
            '$scope': scope
        });
    }));
    
    it('should be created', function() {
      expect(controller).toBeDefined();
    });

    it('should populate message', function() {
      expect(scope.message).toBeDefined();
    });

    it('should populate message exactly', function() {
      expect(scope.message).toEqual('angular fun');
    });

  });
});