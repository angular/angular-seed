'use strict';

describe('version service', function() {
  beforeEach(module('myApp.version'));

  describe('version', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
