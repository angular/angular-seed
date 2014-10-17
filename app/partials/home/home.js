/*global angular*/
'use strict';

angular.module('mainModule.home', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'partials/home/home.html',
            controller: 'HomeCtrl'
        });
    }])
    .controller('HomeCtrl', [function () {

    }]);
