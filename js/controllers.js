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
.controller('QueryCharacterStatesController', function ($scope, CharacterStateQuery, Vocab, OMN) {
    $scope.queryParams = {
        taxa: [],
        entities: [],
        matchAllEntities: false,
    };
    $scope.maxSize = 5;
    $scope.itemsPage = 1;
    $scope.itemsLimit = 20;
    $scope.pageChanged = function () {
        $scope.queryCharacterStates();
    }
    function webServiceParams(queryParams) {
        var result = {};
        var taxa = queryParams.taxa.map(function (item) {
            return OMN.angled(item['@id']);
        });
        if (taxa.length > 0) {
            if (queryParams.matchAllTaxa) {
                result.taxon = OMN.intersection(taxa);
            } else {
                result.taxon = OMN.union(taxa);
            }
        }
        var entities = queryParams.entities.map(function (item) {
            return OMN.angled(item['@id']);
        });
        if (entities.length > 0) {
            if (queryParams.matchAllEntities) {
                result.entity = OMN.intersection(entities);
            } else {
                result.entity = OMN.union(entities);
            }
        }        
        return result;
    }
    $scope.queryCharacterStates = function () {
        $scope.statesResults = CharacterStateQuery.query(_.extend({
            limit: $scope.itemsLimit,
            offset: ($scope.itemsPage - 1) * $scope.itemsLimit
        }, 
        webServiceParams($scope.queryParams)));
    };
    $scope.queryTotal = function () {
        $scope.itemsTotal = CharacterStateQuery.query(_.extend({total: true}, webServiceParams($scope.queryParams)));
    };
    $scope.applyQueryFilter = function() {
        $scope.itemsPage = 1;
        $scope.queryCharacterStates();
        $scope.queryTotal();
    }
    $scope.queryCharacterStates();
    $scope.queryTotal();
})
.controller('QueryTaxaController', function ($scope, TaxonQuery, Vocab, OMN) {
    $scope.queryParams = {
        taxa: [],
        entities: [],
        matchAllEntities: false,
    };
    $scope.maxSize = 5;
    $scope.itemsPage = 1;
    $scope.itemsLimit = 20;
    $scope.pageChanged = function () {
        $scope.queryTaxa();
    }
    function webServiceParams(queryParams) {
        var result = {};
        var taxa = queryParams.taxa.map(function (item) {
            return OMN.angled(item['@id']);
        });
        if (taxa.length > 0) {
            if (queryParams.matchAllTaxa) {
                result.taxon = OMN.intersection(taxa);
            } else {
                result.taxon = OMN.union(taxa);
            }
        }
        var entities = queryParams.entities.map(function (item) {
            return OMN.angled(item['@id']);
        });
        if (entities.length > 0) {
            if (queryParams.matchAllEntities) {
                result.entity = OMN.intersection(entities);
            } else {
                result.entity = OMN.union(entities);
            }
        }        
        return result;
    }
    $scope.queryTaxa = function () {
        $scope.taxaResults = TaxonQuery.query(_.extend({
            limit: $scope.itemsLimit,
            offset: ($scope.itemsPage - 1) * $scope.itemsLimit
        }, 
        webServiceParams($scope.queryParams)));
    };
    $scope.queryTotal = function () {
        $scope.itemsTotal = TaxonQuery.query(_.extend({total: true}, webServiceParams($scope.queryParams)));
    };
    $scope.applyQueryFilter = function() {
        $scope.itemsPage = 1;
        $scope.queryTaxa();
        $scope.queryTotal();
    }
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
.controller('SimilarityController', function ($scope, TermSearch, SimilarityMatches, SimilaritySubsumers, SubsumedAnnotations, Vocab) {
    $scope.searchGenes = function (text) {
        return TermSearch.query({
            limit: 20,
            text: text,
            type: Vocab.Gene
        }).$promise.then(function (response) {
            return response.results;
        });
    };
    $scope.queryTopMatches = function () {
        $scope.topMatches = SimilarityMatches.query({'iri': $scope.geneToQuery['@id']});
    };
    $scope.$watch('geneToQuery', function (value) {
        $scope.selectedMatch = null;
        $scope.topSubsumers = null;
        if (value) {
            $scope.queryTopMatches();
        }
    });    
    $scope.selectMatch = function (match) {
        $scope.selectedMatch = match;
        SimilaritySubsumers.query({
            query_iri: $scope.geneToQuery['@id'], 
            corpus_iri: match.match_profile['@id']}
        ).$promise.then(function (response) {
            var filteredResults = response.results.filter(function (item) {
                return item.ic > 0.0;
            });
            response.results = filteredResults;
            response.results.forEach(function (item) {
                var subsumerIRI = item.term['@id'];
                item.query_annotations = SubsumedAnnotations.query({'subsumer': subsumerIRI, 'instance': $scope.geneToQuery['@id']});
                item.match_annotations = SubsumedAnnotations.query({'subsumer': subsumerIRI, 'instance': $scope.selectedMatch.match_profile['@id']});
            });
            response.results.sort(function (a, b) {
                return b.ic - a.ic;
            });
            $scope.topSubsumers = response;
        });
    };
})
.controller('QueryPanelController', function ($scope, $location, Autocomplete, OMN, Vocab) {
    $scope.queryPages = [
        {label: "Taxa", href: "/query_taxa", key: "taxa"},
        {label: "Character states", href: "/query_characters", key: "character_states"}
    ];
    $scope.selectedPage = _.findWhere($scope.queryPages, {key: $scope.configuration});
    $scope.queryTaxonValues = $scope.parameters.taxa.map(function (item) {
        return {term: item};
    });
    $scope.queryEntityValues = $scope.parameters.entities.map(function (item) {
        return {term: item};
    });
    function collectTerms(list) {
        var terms = list.filter(function (item) {
            return item.term;
        }).map(function (item) {
            return item.term;
        });
        return terms;
    }
    $scope.queryParams = function () {
        var taxa = collectTerms($scope.queryTaxonValues);
        var entities = collectTerms($scope.queryEntityValues);
        var matchAllEntities;
        return {
            taxa: taxa,
            matchAllTaxa: false,
            entities: entities,
            matchAllEntities: $scope.parameters.matchAllEntities
        };
    }
    $scope.searchTaxa = Autocomplete.taxa;
    $scope.searchEntities = Autocomplete.entities;
    $scope.applyQueryFilter = function () {
        $scope.queryDirty = false;
        $scope.applyQuery();
    }
    var initiallyClean = true;
    $scope.$watch('queryParams() | json', function (value) {
        if (!initiallyClean) {
            $scope.queryDirty = true;
        }
        initiallyClean = false;
        $scope.parameters = _.extend($scope.parameters, $scope.queryParams());
    });
    $scope.$watch('selectedPage', function (value) {
        $location.path(value.href);
    });
    $scope.queryDirty = false;
});
