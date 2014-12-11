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
.controller('EntityController', function ($scope, $routeParams, Term, EntityPresence, EntityAbsence) {
    $scope.termID = $routeParams.term;
    $scope.term = Term.query({'iri': $scope.termID});
    $scope.queryPresentInTaxa = function () {
        $scope.presentInTaxa = EntityPresence.query({'entity': $scope.termID, 'limit': 20});
    };
    $scope.queryAbsentInTaxa = function () {
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
	};
})
.controller('QueryCharacterStatesController', function ($scope, CharacterStateQuery, Vocab) {
    $scope.charactersTotal = 4000;
    $scope.maxSize = 5;
    $scope.itemsPage = 1;
    $scope.itemsLimit = 20;
    $scope.pageChanged = function () {
        $scope.queryCharacterStates();
    }
    function params() {
        return {
            taxon: "<" + Vocab.OWLThing + ">",
            entity: "<" + Vocab.OWLThing + ">",
            limit: 20,
            offset: ($scope.itemsPage - 1) * $scope.itemsLimit
        };
    }
    $scope.queryCharacterStates = function () {
        $scope.statesResults = CharacterStateQuery.query(params());
    };
    $scope.queryCharacterStates();
    $scope.itemsTotal = CharacterStateQuery.query(_.extend({total: true}, params()));
})
.controller('QueryTaxaController', function ($scope, TaxonQuery, Vocab, OntologyTermSearch) {
    $scope.maxSize = 5;
    $scope.itemsPage = 1;
    $scope.itemsLimit = 20;
    $scope.pageChanged = function () {
        $scope.queryTaxa();
    }
    function params() {
        var t = Vocab.OWLThing;
        if ($scope.queryTaxon) { t = $scope.queryTaxon["@id"]; }
        var e = Vocab.OWLThing;
        if ($scope.queryEntity) { e = $scope.queryEntity["@id"]; }
        return {
            taxon: "<" + t + ">",
            entity: "<" + e + ">",
            limit: 20,
            offset: ($scope.itemsPage - 1) * $scope.itemsLimit
        };
    }
    $scope.queryTaxa = function () {
        $scope.taxaResults = TaxonQuery.query(params());
    };
    $scope.queryTotal = function () {
        $scope.itemsTotal = TaxonQuery.query(_.extend({total: true}, params()));
    }
    $scope.searchTaxa = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.VTO
        }).$promise.then(function (response) {
            return response.results;
        });
    }
    $scope.searchEntities = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.Uberon
        }).$promise.then(function (response) {
            return response.results;
        });
    }
    $scope.applyQueryFilter = function() {
        $scope.queryDirty = false;
        $scope.queryTaxa();
        $scope.queryTotal();
    }
    var initiallyClean = true;
    $scope.$watchGroup(['queryTaxon', 'queryEntity'], function (value) {
        if (!initiallyClean) {
            $scope.queryDirty = true;
        }
        initiallyClean = false;
    });
    $scope.queryDirty = false;
    $scope.queryTaxa();
    $scope.queryTotal();
})
.controller('OntoTraceController', function ($scope, OntologyTermSearch, Vocab) {
    $scope.searchTaxa = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.VTO
        }).$promise.then(function (response) {
            return response.results;
        });
    }
    $scope.searchEntities = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.Uberon
        }).$promise.then(function (response) {
            return response.results;
        });
    }
})
;
