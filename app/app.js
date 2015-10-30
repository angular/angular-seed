(function () {

	'use strict';

	// Declare app level module which depends on views, and components
	angular
		.module('myApp', [
			'ngRoute',
			'myApp.view1',
			'myApp.view2',
			'myApp.version'
		])
		.config(Config);

	Config.$inject = ['$routeProvider'];

	function Config($routeProvider) {
		$routeProvider
			.otherwise({
				redirectTo: '/view1'
			});
	}

})();
