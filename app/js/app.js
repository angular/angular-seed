'use strict';

// Declare app level module which depends on filters, and services
angular.module('taggedList', ['taggedList.controller', 'taggedList.filter']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {templateUrl: 'partials/list.html'});
		$routeProvider.when('/new', 
			{
				templateUrl: 'partials/edit.html'
			});
		//$routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
		$routeProvider.otherwise({redirectTo: '/'});
	}]);