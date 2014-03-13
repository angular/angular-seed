'use strict';

/* jasmine specs for services go here */

describe('version service', function() {
  beforeEach(module('myApp.version.service'));

  describe('version', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
