'use strict';

/* Controllers */

angular.module('pkb.controllers', [])
.controller('AppController', function ($scope) {
	$scope.setActiveTab = function (page) {
		$scope.homeActive = '';
		$scope.contentsActive = '';
		$scope[page + 'Active'] = 'active';
	}
})
.controller('HomeController', function($scope) {
	$scope.setActiveTab('home');
})
.controller('ContentsController', function($scope) {
	$scope.setActiveTab('contents');
});
