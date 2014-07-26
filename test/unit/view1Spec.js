'use strict';

/* jasmine specs for the view1 module go here */

describe('view1 module', function(){
  var scope, ctrl;

  beforeEach(angular.mock.module('myApp'));

  beforeEach(inject(function($rootScope, $controller){
    scope = $rootScope.$new();
    ctrl = $controller('MyCtrl1', { $scope: scope });
  }));

  it('should ....', function() {
    expect(ctrl).toBeDefined();
  });

});
