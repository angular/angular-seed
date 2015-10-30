
(function() {

	'use strict';

	angular
		.module('myApp.view1', [
			'ngRoute'
		])
		.config(Config)
		.controller('View1Ctrl', View1Ctrl);

	Config.$inject = ['$routeProvider'];

	function Config($routeProvider) {
		$routeProvider.when('/view1', {
			templateUrl: 'view1/view1.html',
			controller: 'View1Ctrl'
		});
	}

	function View1Ctrl() {

	}

})();
