'use strict';

describe('module: myApp.view1', function() {
	beforeEach(module('myApp.view1'));

	describe('controller: View1Ctrl', function() {
		var ctrl;

		beforeEach(inject(function($controller) {
			ctrl = $controller('View1Ctrl');
		}));

		it('should be defined', function() {
			expect(ctrl).toBeDefined();
		});
	});
});