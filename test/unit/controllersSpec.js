'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
  beforeEach(module('myApp.controllers'));
  
  describe('MyCtrl1', function() {
   it('should have the $scope.one set to 1', inject(function($rootScope, $controller) {
     var scope = $rootScope.$new(),
         ctrl  = $controller('MyCtrl1', {$scope: scope});
     expect(scope.one).toEqual(1);
   })) 
  });
  
  describe('MyCtrl2', function() {
   it('should have the $scope.two set to 2', inject(function($rootScope, $controller) {
     var scope = $rootScope.$new(),
         ctrl  = $controller('MyCtrl2', {$scope: scope});
     expect(scope.two).toEqual(2);
   })) 
  });
});