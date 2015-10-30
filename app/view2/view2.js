
(function() {
	"use strict";

	angular
		.module('myApp.view2', [
			'ngRoute'
		])
		.config(Config)
		.controller('View2Ctrl', View2Ctrl);

	Config.$inject = ['$routeProvider'];

	function Config($routeProvider) {
		$routeProvider
			.when('/view2', {
				templateUrl: 'view2/view2.html',
				controller: 'View2Ctrl'
			});
	}

	function View2Ctrl() {

	}

})();