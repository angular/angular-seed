'use strict';

/* Controllers */

angular.module('pkb.controllers', ['ui.bootstrap'])
.controller('AppController', function ($scope) {
	
})
.controller('HomeController', function ($scope, AnatomicalTermSearch, CharacterStateSearch) {
    $scope.performSearches = function () {
        $scope.anatomyResults = {};
        $scope.statesResults = {};
        if ($scope.searchText) {
            $scope.anatomyResults = AnatomicalTermSearch.query({'text': $scope.searchText, 'limit': 20});
            $scope.statesResults = CharacterStateSearch.query({'text': $scope.searchText, 'limit': 20});
        }
    };
})
.controller('EntityController', function ($scope, $routeParams, Label, EntityPresence, EntityAbsence) {
    $scope.termID = $routeParams.term;
    $scope.termLabel = Label.query({'iri': $scope.termID});
    $scope.queryPresentInTaxa = function () {
        $scope.presentInTaxa = EntityPresence.query({'entity': $scope.termID, 'limit': 20});
    };
    $scope.queryAbsentInTaxa = function() {
        $scope.absentInTaxa = EntityAbsence.query({'entity': $scope.termID, 'limit': 20});
    };
    
    $scope.queryPresentInTaxa();
})
.controller('CharacterStateController', function ($scope, $routeParams, Label) {
    $scope.stateID = $routeParams.state;
    $scope.termLabel = Label.query({'iri': $scope.stateID});
})
.controller('ContentsController', function ($scope) {
})
.controller('PresenceAbsenceController', function ($scope, EntityPresence) {
	$scope.presenceStates = [];
	$scope.queryPresence = function () {
		if ($scope.taxon && $scope.entity) {
			$scope.presenceStates = EntityPresence.query({'taxon': $scope.taxon, 'entity': $scope.entity});
		} else {
			$scope.presenceStates = [];
		}
		
	}
});
