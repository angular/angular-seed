'use strict';

/* jasmine specs for directives go here */

describe('the version directive', function() {
  beforeEach(angular.mock.module('appVersion'));

  describe('app-version', function() {
    it('should print current version', function() {
      angular.mock.module(function($provide) {
        $provide.value('version', 'TEST_VER');
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span app-version></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VER');
      });
    });
  });
});
