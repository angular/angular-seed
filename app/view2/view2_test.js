'use strict';

describe('module: myApp.view2', function() {
	beforeEach(module('myApp.view2'));

	describe('controller: View2Ctrl', function() {
		var ctrl;

		beforeEach(inject(function($controller) {
			ctrl = $controller('View2Ctrl');
		}));

		it('should be defined', function() {
			expect(ctrl).toBeDefined();
		});
	});
});