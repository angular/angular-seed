'use strict';

/* Controllers */

angular.module('pkb.controllers', [])
.controller('AppController', function ($scope) {
	$scope.setActiveTab = function (page) {
		$scope.homeActive = '';
		$scope.contentsActive = '';
		$scope.presenceAbsenceActive = '';
		$scope[page + 'Active'] = 'active';
	}
})
.controller('HomeController', function($scope) {
	$scope.setActiveTab('home');
})
.controller('ContentsController', function($scope) {
	$scope.setActiveTab('contents');
})
.controller('PresenceAbsenceController', function($scope, EntityPresence) {
	$scope.setActiveTab('presenceAbsence');
	$scope.presenceStates = [];
	$scope.queryPresence = function () {
		if ($scope.taxon && $scope.entity) {
			$scope.presenceStates = EntityPresence.query({'taxon': $scope.taxon, 'entity': $scope.entity});
		} else {
			$scope.presenceStates = [];
		}
		
	}
});
