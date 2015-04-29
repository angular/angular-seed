'use strict';

/* Controllers */

angular.module('pkb.controllers', ['ui.bootstrap'])
.controller('AppController', function ($scope) {
	
})
.controller('HomeController', function ($scope, AnatomicalTermSearch, CharacterStateSearch, OntologyTermSearch, GeneSearch, Vocab) {
    $scope.clearResults = function () {
        $scope.anatomyResults = null;
        $scope.statesResults = null;
        $scope.taxaResults = null;
        $scope.geneResults = null;
    };
    $scope.performSearches = function () {
        if ($scope.searchText) {
            $scope.anatomyResults = AnatomicalTermSearch.query({text: $scope.searchText, limit: 20});
            $scope.statesResults = CharacterStateSearch.query({text: $scope.searchText, limit: 20});
            $scope.taxaResults = OntologyTermSearch.query({text: $scope.searchText, limit: 20, definedBy: Vocab.VTO});
            $scope.geneResults = GeneSearch.query({text: $scope.searchText, limit: 20});
        }
    };
})
.controller('AboutPhenoscapeKBController', function ($scope) {
    
})
.controller('AboutPhenoscapeController', function ($scope) {
    
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
.controller('TaxonController', function ($scope, $routeParams, Taxon) {
    $scope.taxonID = $routeParams.taxon;
    $scope.taxon = Taxon.query({'iri': $scope.taxonID});
})
.controller('GeneController', function ($scope, $routeParams, Gene, GenePhenotypes) {
    $scope.geneID = $routeParams.gene;
    $scope.gene = Gene.query({'iri': $scope.geneID});
    $scope.queryPhenotypes = function () {
        $scope.phenotypes = GenePhenotypes.query({'iri': $scope.geneID});
    }
    $scope.queryPhenotypes();
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
    $scope.queryPanelOptions = {
        includeTaxonGroup: true, 
        includeEntity: true
    };
    $scope.queryParams = {
        taxa: [],
        entities: [],
        expressionEntities: [],
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
.controller('QueryVariationProfileController', function ($scope, $routeParams, VariationProfileQuery, Vocab, OMN, Label) {
    $scope.queryPanelOptions = {
        includeTaxonGroup: true, 
        includeEntity: false
    };
    // $scope.queryParams = {
//         taxa: [],
//         entities: [],
//         expressionEntities: [],
//         matchAllEntities: false,
//     };
    $scope.maxSize = 5;
    $scope.itemsPage = 1;
    $scope.itemsLimit = 20;
    $scope.pageChanged = function () {
        $scope.queryVariationProfile();
    }
    function webServiceParams(queryParams) {
        var result = {};
        var taxa = queryParams.taxa.map(function (item) {
            return item['@id'];
        });
        if (taxa.length > 0) {
            result.taxon = angular.toJson(taxa);
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
    $scope.queryVariationProfile = function () {
        $scope.profileResults = VariationProfileQuery.query(_.extend({
            limit: $scope.itemsLimit,
            offset: ($scope.itemsPage - 1) * $scope.itemsLimit
        }, 
        webServiceParams($scope.queryParams)));
    };
    $scope.queryTotal = function () {
        $scope.itemsTotal = VariationProfileQuery.query(_.extend({total: true}, webServiceParams($scope.queryParams)));
    };
    $scope.applyQueryFilter = function() {
        $scope.itemsPage = 1;
        $scope.queryVariationProfile();
        $scope.queryTotal();
    }
    
    var urlQueryParams = {
        taxa: [],
        entities: [],
        matchAllEntities: false,
    };
    var taxa = [];
    if ($routeParams.taxa) {
        var taxa = angular.fromJson($routeParams.taxa);
    }
    urlQueryParams.taxa = taxa.map(function (item) {
        return {'@id': item};
    });
    $scope.queryParams = urlQueryParams;
    $scope.queryVariationProfile();
    $scope.queryTotal();
    
    
    // if (angular.isDefined(taxa)) {
//         urlQueryParams.taxa = taxa.map(function (item) {
//             return Label.query({iri: item});
//         });
//     }
//     $q.all(urlQueryParams.taxa.map(function (item) {
//         return item.$promise;
//     })).then(function (data) {
//         $scope.queryParams = urlQueryParams;
//         $scope.queryVariationProfile();
//         $scope.queryTotal();
//     });
})
.controller('QueryTaxaController', function ($scope, TaxonQuery, Vocab, OMN) {
    $scope.queryPanelOptions = {
        includeTaxonGroup: true, 
        includeEntity: true,
        includeExpressionEntity: false
    };
    $scope.queryParams = {
        taxa: [],
        entities: [],
        expressionEntities: [],
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
.controller('QueryGenesController', function ($scope, GeneQuery, Vocab, OMN) {
    $scope.queryPanelOptions = {
        includeTaxonGroup: false, 
        includeEntity: true,
        includeExpressionEntity: false //not yet working on service side
    };
    $scope.queryParams = {
        taxa: [],
        entities: [],
        expressionEntities: [],
        matchAllEntities: false,
    };
    $scope.maxSize = 5;
    $scope.itemsPage = 1;
    $scope.itemsLimit = 20;
    $scope.pageChanged = function () {
        $scope.queryGenes();
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
        var expressionEntities = queryParams.expressionEntities.map(function (item) {
            return OMN.angled(item['@id']);
        });
        if (expressionEntities.length > 0) {
            if (queryParams.matchAllExpressionEntities) {
                result.expression_entity = OMN.intersection(expressionEntities);
            } else {
                result.expression_entity = OMN.union(expressionEntities);
            }
        }
        return result;
    }
    $scope.queryGenes = function () {
        $scope.genesResults = GeneQuery.query(_.extend({
            limit: $scope.itemsLimit,
            offset: ($scope.itemsPage - 1) * $scope.itemsLimit
        }, 
        webServiceParams($scope.queryParams)));
    };
    $scope.queryTotal = function () {
        $scope.itemsTotal = GeneQuery.query(_.extend({total: true}, webServiceParams($scope.queryParams)));
    };
    $scope.applyQueryFilter = function() {
        $scope.itemsPage = 1;
        $scope.queryGenes();
        $scope.queryTotal();
    }
    $scope.queryGenes();
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
.controller('SimilarityController', function ($scope, GeneSearch, SimilarityMatches, SimilarityAnnotationMatches, ProfileSize, SimilarityCorpusSize, Vocab) {
    $scope.maxSize = 3;
    $scope.matchesPage = 1;
    $scope.matchesLimit = 20;
    $scope.pageChanged = function () {
        $scope.queryTopMatches();
    }
    //$scope.matchesTotal = SimilarityCorpusSize.query(); //FIXME this query is too slow!
    $scope.matchesTotal = {total: 1000};
    $scope.searchGenes = function (text) {
        return GeneSearch.query({
            limit: 20,
            text: text
        }).$promise.then(function (response) {
            return response.results;
        });
    };
    $scope.queryTopMatches = function () {
        $scope.selectedMatch = null;
        $scope.topMatches = SimilarityMatches.query({
            iri: $scope.geneToQuery['@id'],
            limit: $scope.matchesLimit,
            offset: ($scope.matchesPage - 1) * $scope.matchesLimit
        });
    };
    $scope.$watch('geneToQuery', function (value) {
        $scope.selectedMatch = null;
        $scope.annotationMatches = null;
        $scope.queryProfileSize = null;
        $scope.matchesPage = 1;
        $scope.selectedMatchProfileSize = null;
        if (value) {
            $scope.queryTopMatches();
            $scope.queryProfileSize = ProfileSize.query({iri: $scope.geneToQuery['@id']});
        }
    });    
    $scope.selectMatch = function (match) {
        $scope.selectedMatch = match;
        $scope.annotationMatches = null;
        $scope.selectedMatchProfileSize = ProfileSize.query({iri: match.match_profile['@id']});
        $scope.annotationMatches = SimilarityAnnotationMatches.query({
            query_iri: $scope.geneToQuery['@id'], 
            corpus_iri: match.match_profile['@id']}
        );
    };
})
.controller('QueryPanelController', function ($scope, $location, Autocomplete, OMN, Vocab, Label, $q) {
    $scope.queryPages = [
        {label: "Taxa", href: "/query_taxa", key: "taxa"},
        {label: "Character states", href: "/query_characters", key: "character_states"},
        {label: "Genes", href: "/query_genes", key: "genes"},
        {label: "Variation profile", href: "/query_variation_profile", key: "variation_profile"}
    ];
    $scope.queryTaxonValues = [];
    $scope.queryEntityValues = [];
    $scope.queryExpressionEntityValues = [];
    $scope.selectedPage = _.findWhere($scope.queryPages, {key: $scope.configuration});
    function maybeGetLabel(term) {
        if (!term.label && !term.$promise) {
            return Label.query({iri: term['@id']}).$promise;
        } else {
            return $q.when(term);
        }
    }
    function mapParameters() {
        _.defaults($scope.parameters, {taxa: [], entities: [], expressionEntities: []});
        $q.all($scope.parameters.taxa.map(function (item) {
            return maybeGetLabel(item);
        })).then(function (items) {
            $scope.queryTaxonValues.splice(0, $scope.queryTaxonValues.length);
            items.forEach(function (item) {
                $scope.queryTaxonValues.push({term: item});
            });
        });
        $q.all($scope.parameters.entities.map(function (item) {
            return maybeGetLabel(item);
        })).then(function (items) {
            $scope.queryEntityValues.splice(0, $scope.queryTaxonValues.length);
            items.forEach(function (item) {
                $scope.queryEntityValues.push({term: item});
            });
        });
        $q.all($scope.parameters.expressionEntities.map(function (item) {
            return maybeGetLabel(item);
        })).then(function (items) {
            $scope.queryExpressionEntityValues.splice(0, $scope.queryTaxonValues.length);
            items.forEach(function (item) {
                $scope.queryExpressionEntityValues.push({term: item});
            });
        });
    }
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
    $scope.$watch('parameters', function (value) {
        mapParameters();
    });
    $scope.queryDirty = false;
    mapParameters();
})
.controller('CommonGroupController', function ($scope, TaxonCommonGroup) {
    $scope.smallImage = function (iri) {
        if (iri) {
            var uuid = iri.replace("http://phylopic.org/image/", "").replace("/", "");
            return "http://phylopic.org/assets/images/submissions/" + uuid + ".64.png";
        } else {
            return "";
        }
        
    };
    $scope.group = TaxonCommonGroup.query({iri: $scope.taxon});
})
.controller('SimilarityViewController', function ($scope, SimilarityMatches, SimilarityAnnotationMatches, ProfileSize, SimilarityCorpusSize) {
    $scope.maxSize = 3;
    $scope.matchesPage = 1;
    $scope.matchesLimit = 20;
    $scope.pageChanged = function () {
        $scope.queryTopMatches();
    }
    //$scope.matchesTotal = SimilarityCorpusSize.query(); //FIXME this query is too slow!
    $scope.matchesTotal = {total: 1000};
    $scope.queryTopMatches = function () {
        $scope.queryProfileSize = ProfileSize.query({iri: $scope.gene['@id']});
        $scope.selectedMatch = null;
        $scope.topMatches = SimilarityMatches.query({
            iri: $scope.gene['@id'],
            limit: $scope.matchesLimit,
            offset: ($scope.matchesPage - 1) * $scope.matchesLimit
        });
    };   
    $scope.selectMatch = function (match) {
        $scope.selectedMatch = match;
        $scope.annotationMatches = null;
        $scope.selectedMatchProfileSize = ProfileSize.query({iri: match.match_profile['@id']});
        $scope.annotationMatches = SimilarityAnnotationMatches.query({
            query_iri: $scope.gene['@id'], 
            corpus_iri: match.match_profile['@id']}
        );
    };
//    $scope.selectedMatch = null;
//    $scope.annotationMatches = null;
//    $scope.queryProfileSize = null;
//    $scope.matchesPage = 1;
//    $scope.selectedMatchProfileSize = null;
    
    $scope.$watch('gene', function (value) {
        if ($scope.gene['@id']) {
            $scope.queryTopMatches();
        }
    });
    
    
})
;
