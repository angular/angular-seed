'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
'ngRoute',
'myApp.filters',
'myApp.services',
'myApp.directives',
'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeController'});
	$routeProvider.when('/datasummary', {templateUrl: 'partials/datasummary.html', controller: 'DataSummaryController'});
	$routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
	$routeProvider.otherwise({redirectTo: '/home'});
}]);
