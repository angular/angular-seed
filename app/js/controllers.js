'use strict';

/* Controllers */

angular.module('pkb.controllers', [])
.controller('AppController', function ($scope) {
	$scope.setActiveTab = function (page) {
		$scope.homeActive = '';
		$scope.datasummaryActive = '';
		$scope[page + 'Active'] = 'active';
	}
})
.controller('MyCtrl1', function($scope) {

})
.controller('MyCtrl2', function() {

})
.controller('HomeController', function($scope) {
	$scope.setActiveTab('home');
})
.controller('DatasummaryController', function($scope) {
	$scope.setActiveTab('datasummary');
});
