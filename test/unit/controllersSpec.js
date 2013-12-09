'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){

  beforeEach(module('myApp.controllers'));

  it('should increase todo list', inject(function($rootScope, $controller) {
    var scope = $rootScope.$new();
    var ctrl = $controller('MyCtrl2', {$scope: scope});

    expect(scope.todos.length).toBe(2);

    scope.addTodo();
    expect(scope.todos.length).toBe(3);

  }));

  it('should ....', inject(function() {
    expect(true).toBeTruthy();
    expect(1).toBe(1);
    expect(1).toEqual(1);
  }));
});
