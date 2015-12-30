'use strict';

describe('myApp.view1 module', function() {

  beforeEach(module('myApp.view1'));
  beforeEach(module('myApp.services'));

  describe('view1 controller', function(){
    var scope, ctrl, $httpBackend;
	
	beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
		$httpBackend = _$httpBackend_;
		$httpBackend.expectGET('https://api.imgur.com/3/gallery/search/viral/0/?q=cat%20gif').
			respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
		scope = $rootScope.$new();
		ctrl = $controller('View1Ctrl', {$scope: scope});
	}));

    it('should create itself', inject(function() {
      //spec body
      
      expect(ctrl).toBeDefined();
    }));

  });
});