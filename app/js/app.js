'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ngCookies',
    'angular-md5',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/editor', {templateUrl: 'partials/editor.html', controller: 'EditorCtrl'});
  $routeProvider.when('/tasks', {templateUrl: 'partials/tasks.html', controller: 'TasksCtrl'});
  $routeProvider.when('/monitor', {templateUrl: 'partials/monitor.html', controller: 'MonitorCtrl'});
  $routeProvider.when('/registration', {templateUrl: '../partials/registration.html', controller: 'RegistrationCtrl'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]).constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        editor: 'editor',
        guest: 'guest'
    });
angular.module('myApp')
    .directive('bsActiveLink', ['$location', function ($location) {
    return {
        restrict: 'A', //use as attribute 
        replace: false,
        link: function (scope, elem) {
            //after the route has changed
            scope.$on("$routeChangeSuccess", function () {
                var selectors = ['li > [href="/#' + $location.path() + '"]',
                    'li > [href="#' + $location.path() + '"]', //html5: false
                'li > [href="' + $location.path() + '"]']; //html5: true
                $(elem).find(selectors.join(',')) //find the matching link
                .parent('li').addClass('active') //add active class to the matching element
                .siblings('li').removeClass('active'); //remove it from the sibling elements
            });
        }
    }
}]);
