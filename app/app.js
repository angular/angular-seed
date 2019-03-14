'use strict';

angular.module('todomvc', ['ngRoute', 'ngResource', 'ngAnimate'])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
				controller: 'TodoCtrl',
				templateUrl: 'todomvc-index.html',
				css: 'app.css',
				resolve: {
					store: function (todoStorage) {
						return todoStorage.then(function (module) {
							module.get();
							return module;
						});
					}
				}
			})
			.otherwise({
				redirectTo: '/'
			});
	}])

	.controller('TodoCtrl', [function () {

	}]);