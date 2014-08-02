'use strict';

/* jasmine specs for the view2 module go here */

describe('view2 module', function(){
  var scope, ctrl;

  beforeEach(angular.mock.module('myApp'));

  beforeEach(inject(function($rootScope, $controller){
    scope = $rootScope.$new();
    ctrl = $controller('MyCtrl2', { $scope: scope });
  }));

  it('should ....', function() {
    expect(ctrl).toBeDefined();
  });
});
