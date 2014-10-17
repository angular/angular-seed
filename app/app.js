/*global angular */
'use strict';

// Declare app level module which depends on views, and components
angular.module('mainModule', [
    'ngRoute',
    'mainModule.home',
    'mainModule.directives',
    'mainModule.services'
]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/home'});
}]);
