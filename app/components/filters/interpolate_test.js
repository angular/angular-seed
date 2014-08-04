'use strict';

/* jasmine specs for filters go here */

describe('the interpolate filter', function() {
  beforeEach(function(){
    angular.mock.module('interpolate');
    angular.mock.module(function($provide) {
      $provide.value('version', 'TEST_VER');
    })
  });


  it('should replace VERSION', inject(function(interpolateFilter) {
    expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
  }));
});
