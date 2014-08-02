'use strict';

/* jasmine specs for services go here */

describe('the app version service', function() {
  beforeEach(angular.mock.module('appVersionService'));


  describe('version', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
