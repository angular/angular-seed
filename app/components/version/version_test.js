'use strict';

describe('hereiam.version module', function() {
  beforeEach(module('hereiam.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
