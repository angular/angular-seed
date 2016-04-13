'use strict';

/* Controllers */

angular.module('pkb.controllers', ['ui.bootstrap'])
.controller('AppController', function ($scope, AnatomicalTermSearch, OntologyTermSearch, GeneSearch, Vocab) {
    $scope.clickLink = function () {
        $scope.clearSearch();
    };
    
    $scope.clearSearch = function () {
        $scope.searchText = null;
        $scope.clearResults();
    };
    $scope.clearResults = function () {
        $scope.anatomyResults = null;
        $scope.taxaResults = null;
        $scope.geneResults = null;
    };
    $scope.performSearches = function () {
        if ($scope.searchText) {
            $scope.anatomyResults = AnatomicalTermSearch.query({text: $scope.searchText, limit: 20});
            $scope.taxaResults = OntologyTermSearch.query({text: $scope.searchText, limit: 20, definedBy: Vocab.VTO});
            $scope.geneResults = GeneSearch.query({text: $scope.searchText, limit: 20});
        }
    };
})
.controller('HomeController', function ($scope, AnatomicalTermSearch, CharacterStateSearch, OntologyTermSearch, GeneSearch, Vocab) {
})
.controller('AboutPhenoscapeKBController', function ($scope, AnnotationSummary) {
    $scope.annotationSummary = AnnotationSummary.query();
})
.controller('AboutPhenoscapeController', function ($scope) {
    
})
.controller('AnnotateTextController', function ($scope, $sce, $http, ScigraphAnnotator) {
    $scope.data = {
        testInput: "",
        inputText: "The caudal skeleton of the catfishes, order Siluriformes. American Museum novitates ; no. 2398\nLundberg, John G.; Baskin, Jonathan N.\n\nTo achieve a better understanding of the evolution of catfishes, comparative studies of single character complexes throughout the entire order is believed to be a rewarding approach. A survey of the caudal skeleton of the Siluriformes reveals 10 basic features which, taken together, distinguish catfishes from other fishes. Of these the most diagnostic are: 1) bases of hypurals 3 and 4 fused with a distinct U[subscript]2 chordacentrum in the young and with a usually reduced second ural centrum in the adults; 2) a secondary hypurapophysis; 3) principal rays of the caudal fin fewer than 10+9, with upper principal rays equal to, or fewer than, the lower rays. Within the Siluriformes four features of the caudal skeleton are found to exhibit group specific patterns of variation and trends from primitive to advanced conditions, and may thus be useful in determining relationships: 1. In the trend from the primitive condition of six separate hypurals to the most advanced condition of complete fusion of caudal elements, various groups have reached different structural levels. In this process the sixth hypural is lost. 2. The trend toward elaboration of the sites of caudal muscle origin (hypurapophysis and secondary hypurapophysis) has involved the formation and elaboration of shelves from originally distinct projections, and a subsequent dorsal shift of these sites. 3. While the most primitive principal caudal fin ray number in siluriforms is 9+9, most groups have 8+9. The trend toward a reduction of principal rays always involves loss of an upper ray before loss of a lower so that upper principal rays are never more numerous than lower ones. 4. A separate U[subscript]2 chordacentrum is present in the young of all Ostariophysi except the Loricariidae, Plotosidae, and probably the Chacidae. In the adults of the majority of catfishes a reduced second ural centrum fused with one or more hypurals lies in the cavity on the posterior face of the compound centrum, PU[subscript]1+ U[subscript]l. In some groups the second ural centrum fuses to the compound centrum. In the Loricariidae and Plotosidae the second ural centrum is fused with PU[subscript]1+U[subscript]l, in early development. A separate, well-developed second ural autocentrum occurs in some members of four specialized and unrelated families. This is interpreted as independent redevelopment of a presumedly primitive pre-ostariophysan condition. The advanced conditions of each of these four features of the caudal skeleton tend to occur together in forms which are also regarded as advanced in most other parts of their anatomy. The primitive character states of these features tend to be retained together in a number of families, i.e. Diplomystidae, Ictaluridae, Bagridae, Cranoglanididae, Schilbeidae, Pangasiidae, and Cetopsidae. Advanced features in the caudal skeleton indicate a relationship between the Clariidae and Heteropneustidae, the Doradidae and Auchenipteridae, the Loricariidae, Astroblepidae, and Callichthyidae, and the Plotosidae and Chacidae. The siluriform caudal skeleton shares many features with that of the cypriniforms but it is consistently more advanced. The ostariophysan caudal skeleton is similar to that of the clupeoids, but it resembles the caudal skeleton of the Gonorynchiformes more closely than that of any other group.",
        annotatedText: "",
        longestOnly: false
    }
    $scope.tabs = {
        input: {active: true},
        output: {active: false}
    }
    $scope.runQuery = function (inputText) {
        $scope.data.annotatedText = "";
        $scope.tabs.output.active = true;
        $scope.annotationPromise = $http.get('http://kb.phenoscape.org/scigraph/annotations', {params: {content: $scope.data.inputText, longestOnly: $scope.data.longestOnly}}).then(function (response) { 
            var text = response.data;
            $scope.data.annotatedText = text;
        }
      );
    };
})
.controller('EntityController', function ($scope, $routeParams, $location, Term, TaxaWithPhenotype, EntityPresence, EntityAbsence, EntityPhenotypeGenes, EntityExpressionGenes, OntologyTermSearch, Vocab, OMN, TaxonPhenotypesQuery) {
    $scope.termID = $routeParams.term;
    $scope.term = Term.query({'iri': $scope.termID});
    
    $scope.tabs = {
        classification: {active: true},
        taxa: {active: false},
        genes: {active: false},
    }
    $scope.taxaTabs = {
        phenotypes: {active: true},
        presence: {active: false},
        absence: {active: false}
    }
    $scope.genesTabs = {
        phenotypes: {active: true},
        expression: {active: false}
    }
    $scope.activateTab = function (tabname) {
        if (_.has($scope.tabs, tabname)) {
            $scope.tabs[tabname].active = true;
            $location.search('tab', tabname);
        }
    }
    $scope.activateTaxaTab = function (tabname) {
        if (_.has($scope.taxaTabs, tabname)) {
            $scope.taxaTabs[tabname].active = true;
            $location.search('taxatab', tabname);
        }
    }
    $scope.activateGenesTab = function (tabname) {
        if (_.has($scope.genesTabs, tabname)) {
            $scope.genesTabs[tabname].active = true;
            $location.search('genestab', tabname);
        }
    }
    // $scope.$on('$routeUpdate', function() {
//         $scope.activateTab($location.search().tab);
//         $scope.activateTaxaTab($location.search().taxatab);
//         $scope.activateGenesTab($location.search().genestab);
//     });
    if ($routeParams.tab && _.has($scope.tabs, $routeParams.tab)) {
        $scope.tabs[$routeParams.tab].active = true;
    }
    if ($routeParams.taxatab && _.has($scope.taxaTabs, $routeParams.taxatab)) {
        $scope.taxaTabs[$routeParams.taxatab].active = true;
    }
    if ($routeParams.genestab && _.has($scope.genesTabs, $routeParams.genestab)) {
        $scope.genesTabs[$routeParams.genestab].active = true;
    }
    
    $scope.autocompleteTaxa = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.VTO
        }).$promise.then(function (response) {
            return response.results;
        });
    };
    
    $scope.autocompleteQuality = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.PATO
        }).$promise.then(function (response) {
            return response.results;
        });
    };
    
    $scope.filters = {
        phenotypesTaxonFilter: null,
        phenotypesQualityFilter: null
    };

    $scope.taxaWithPhenotypesPage = 1;
    $scope.taxaWithPhenotypesMaxSize = 3;
    $scope.taxaWithPhenotypesLimit = 20;
    $scope.taxaWithPhenotypesPageChanged = function (newPage) {
            $scope.taxaWithPhenotypesPage = newPage;
            var params = {entity: OMN.angled($scope.termID), limit: $scope.taxaWithPhenotypesLimit, offset: ($scope.taxaWithPhenotypesPage - 1) * $scope.taxaWithPhenotypesLimit};
            if ($scope.filters.phenotypesTaxonFilter) {
                params.in_taxon = $scope.filters.phenotypesTaxonFilter['@id'];
            }
            if ($scope.filters.phenotypesQualityFilter) {
                params.quality = OMN.angled($scope.filters.phenotypesQualityFilter['@id']);
            }
            $scope.taxaWithPhenotypes = TaxaWithPhenotype.query(params);
    };
    $scope.resetTaxaWithPhenotypes = function() {
        var params = {entity: OMN.angled($scope.termID), total: true};
        if ($scope.filters.phenotypesTaxonFilter) {
            params.in_taxon = $scope.filters.phenotypesTaxonFilter['@id'];
        }
        if ($scope.filters.phenotypesQualityFilter) {
            params.quality = OMN.angled($scope.filters.phenotypesQualityFilter['@id']);
        }
        $scope.taxaWithPhenotypesTotal = TaxaWithPhenotype.query(params);
        $scope.taxaWithPhenotypesPageChanged(1);
    };
    $scope.$watchGroup(['filters.phenotypesTaxonFilter', 'filters.phenotypesQualityFilter'], function (newValues, oldValues) {
        $scope.resetTaxaWithPhenotypes();
    });
    
    $scope.filters.presenceTaxonFilter = null;
    $scope.taxaWithPresencePage = 1;
    $scope.taxaWithPresenceMaxSize = 3;
    $scope.taxaWithPresenceLimit = 20;
    $scope.taxaWithPresencePageChanged = function (newPage) {
            $scope.taxaWithPresencePage = newPage;
            var params = {entity: $scope.termID, limit: $scope.taxaWithPresenceLimit, offset: ($scope.taxaWithPresencePage - 1) * $scope.taxaWithPresenceLimit};
            if ($scope.filters.presenceTaxonFilter) {
                params.in_taxon = $scope.filters.presenceTaxonFilter['@id'];
            }
            $scope.taxaWithPresence = EntityPresence.query(params);
    };
    $scope.resetTaxaWithPresence = function() {
        var params = {entity: $scope.termID, total: true};
        if ($scope.filters.presenceTaxonFilter) {
            params.in_taxon = $scope.filters.presenceTaxonFilter['@id'];
        }
        $scope.taxaWithPresenceTotal = EntityPresence.query(params);
        $scope.taxaWithPresencePageChanged(1);
    };
    $scope.$watch('filters.presenceTaxonFilter', function (value) {
        $scope.resetTaxaWithPresence();
    });
    
    $scope.taxaWithAbsencePage = 1;
    $scope.taxaWithAbsenceMaxSize = 3;
    $scope.taxaWithAbsenceLimit = 20;
    $scope.taxaWithAbsencePageChanged = function (newPage) {
            $scope.taxaWithAbsencePage = newPage;
            var params = {entity: $scope.termID, limit: $scope.taxaWithAbsenceLimit, offset: ($scope.taxaWithPresencePage - 1) * $scope.taxaWithAbsenceLimit};
            if ($scope.filters.absenceTaxonFilter) {
                params.in_taxon = $scope.filters.absenceTaxonFilter['@id'];
            }
            $scope.taxaWithAbsence = EntityAbsence.query(params);
    };
    $scope.resetTaxaWithAbsence = function() {
        var params = {entity: $scope.termID, total: true};
        if ($scope.filters.absenceTaxonFilter) {
            params.in_taxon = $scope.filters.absenceTaxonFilter['@id'];
        }
        $scope.taxaWithAbsenceTotal = EntityAbsence.query(params);
        $scope.taxaWithAbsencePageChanged(1);
    };
    $scope.$watch('filters.absenceTaxonFilter', function (value) {
        $scope.resetTaxaWithAbsence();
    });
    
    $scope.phenotypeGenesPage = 1;
    $scope.phenotypeGenesMaxSize = 3;
    $scope.phenotypeGenesLimit = 20;
    $scope.phenotypeGenesSettings = {};
    $scope.phenotypeGenesSettings.includeParts = false;
    $scope.phenotypeGenesPageChanged = function (newPage) {
            $scope.phenotypeGenesPage = newPage;
            $scope.phenotypeGenes = EntityPhenotypeGenes.query({iri: $scope.termID, limit: $scope.phenotypeGenesLimit, offset: ($scope.phenotypeGenesPage - 1) * $scope.phenotypeGenesLimit, parts: $scope.phenotypeGenesSettings.includeParts});
    };
    $scope.resetPhenotypeGenes = function() {
        $scope.phenotypeGenesTotal = EntityPhenotypeGenes.query({iri: $scope.termID, total: true, parts: $scope.phenotypeGenesSettings.includeParts});
        $scope.phenotypeGenesPageChanged(1);
    };
    
    $scope.expressionGenesPage = 1;
    $scope.expressionGenesMaxSize = 3;
    $scope.expressionGenesLimit = 20;
    $scope.expressionGenesPageChanged = function (newPage) {
            $scope.expressionGenesPage = newPage;
            $scope.expressionGenes = EntityExpressionGenes.query({iri: $scope.termID, limit: $scope.expressionGenesLimit, offset: ($scope.expressionGenesPage - 1) * $scope.expressionGenesLimit});
    };
    $scope.resetExpressionGenes = function() {
        $scope.expressionGenesTotal = EntityExpressionGenes.query({iri: $scope.termID, total: true});
        $scope.expressionGenesPageChanged(1);
    };
    
    $scope.resetTaxaWithPresence();
    $scope.resetTaxaWithAbsence();
    $scope.resetPhenotypeGenes();
    $scope.resetExpressionGenes();
})
.controller('TaxonController', function ($scope, $routeParams, $location, $log, $window, Taxon, TaxonPhenotypesQuery, VariationProfileQuery, EntityPresenceEvidence, EntityAbsenceEvidence, OntologyTermSearch, OMN, Vocab, Label, APIroot) {
    $scope.taxonID = $routeParams.taxon;
    $scope.taxon = Taxon.query({'iri': $scope.taxonID});
    $scope.filters = {
        phenotypesEntityFilter: null,
        phenotypesQualityFilter: null,
        quality_type: null
    };
    if ($routeParams['phenotypes.entity']) {
        Label.query({'iri': $routeParams['phenotypes.entity']}).$promise.then(function (response) {
            $scope.filters.phenotypesEntityFilter = response;
        });
    }
    if ($routeParams['phenotypes.quality_type']) {
        $scope.filters.quality_type = $routeParams['phenotypes.quality_type']
    } else {
        $scope.filters.quality_type = "quality-phenotype";
    }
    if ($routeParams['phenotypes.quality']) {
        Label.query({'iri': $routeParams['phenotypes.quality']}).$promise.then(function (response) {
            $scope.filters.phenotypesQualityFilter = response;
        });
    }
    $scope.autocompleteEntity = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.Uberon
        }).$promise.then(function (response) {
            return response.results;
        });
    };
    $scope.autocompleteQuality = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.PATO
        }).$promise.then(function (response) {
            return response.results;
        });
    };
    
    $scope.phenotypeProfilePage = 1;
    $scope.phenotypeProfileLimit = 20;
    $scope.phenotypeProfileMaxSize = 3;
    
    $scope.phenotypeProfilePageChanged = function (newPage) {
        $scope.phenotypeProfilePage = newPage;
        var params = {taxon: $scope.taxonID, limit: $scope.phenotypeProfileLimit, offset: ($scope.phenotypeProfilePage - 1) * $scope.phenotypeProfileLimit};        
        if ($scope.filters.quality_type == 'quality-phenotype') {
            if ($scope.filters.phenotypesEntityFilter) {
                params.entity = OMN.angled($scope.filters.phenotypesEntityFilter['@id']);
            }
            if ($scope.filters.phenotypesQualityFilter) {
                params.quality = OMN.angled($scope.filters.phenotypesQualityFilter['@id']);
            }
            $scope.phenotypeProfile = TaxonPhenotypesQuery.query(params);
        } else {
            var service = null;
            if ($scope.filters.quality_type == 'entailing-presence') {
                service = EntityPresenceEvidence;
            } else {
                service = EntityAbsenceEvidence;
            }
            if ($scope.filters.phenotypesEntityFilter) {
                params.entity = $scope.filters.phenotypesEntityFilter['@id'];
                $scope.phenotypeProfile = service.query(params);
            } else {
                $scope.phenotypeProfile = null;
            }
        }
    };
    $scope.resetPhenotypeProfile = function () {
        var params = {taxon: $scope.taxonID, total: true};
        if ($scope.filters.quality_type == 'quality-phenotype') {
            if ($scope.filters.phenotypesEntityFilter) {
                params.entity = OMN.angled($scope.filters.phenotypesEntityFilter['@id']);
            }
            if ($scope.filters.phenotypesQualityFilter) {
                params.quality = OMN.angled($scope.filters.phenotypesQualityFilter['@id']);
            }
            $scope.phenotypeProfileTotal = TaxonPhenotypesQuery.query(params);
            var url = APIroot + "/taxon/phenotypes?";
            var urlParams = ["limit=0"];
            if (params.entity) {
                urlParams.push("entity=" + $window.encodeURIComponent(params.entity));
            }
            if (params.quality) {
                urlParams.push("quality=" + $window.encodeURIComponent(params.quality));
            }
            urlParams.push("taxon=" + $window.encodeURIComponent(params.taxon));
            $scope.linkToTaxonPhenotypeProfileDownload = url + urlParams.join("&");
        } else {
            var service = null;
            var url = null;
            if ($scope.filters.quality_type == 'entailing-presence') {
                service = EntityPresenceEvidence;
                url = APIroot + "/entity/presence/evidence?";
            } else {
                service = EntityAbsenceEvidence;
                url = APIroot + "/entity/absence/evidence?";
            }
            if ($scope.filters.phenotypesEntityFilter) {
                params.entity = $scope.filters.phenotypesEntityFilter['@id'];
                $scope.phenotypeProfileTotal = service.query(params);
                var urlParams = ["limit=0"];
                urlParams.push("taxon=" + $window.encodeURIComponent(params.taxon));
                urlParams.push("entity=" + $window.encodeURIComponent(params.entity));
                $scope.linkToTaxonPhenotypeProfileDownload = url + urlParams.join("&");
            } else {
                $scope.phenotypeProfileTotal = null;
                $scope.linkToTaxonPhenotypeProfileDownload = null;
            }
        }
        $scope.phenotypeProfilePageChanged(1);
    }
    $scope.resetPhenotypeProfile();
    
    $scope.$watchGroup(['filters.phenotypesEntityFilter', 'filters.phenotypesQualityFilter', 'filters.quality_type'], function (value) {
        $scope.resetPhenotypeProfile();
    });
    $scope.$watch('filters.phenotypesEntityFilter', function (value) {
        if ($scope.filters.phenotypesEntityFilter) {
            $location.search('phenotypes.entity', $scope.filters.phenotypesEntityFilter['@id']);
        } else {
            $location.search('phenotypes.entity', null);
            // $scope.filters.quality_type = "quality-phenotype";
        }
    });
    $scope.$watch('filters.phenotypesQualityFilter', function (value) {
        if ($scope.filters.phenotypesQualityFilter) {
            $location.search('phenotypes.quality', $scope.filters.phenotypesQualityFilter['@id']);
        } else {
            $location.search('phenotypes.quality', null);
        }
    });
    $scope.$watch('filters.quality_type', function (value) {
        $location.search('phenotypes.quality_type', $scope.filters.quality_type);
    });
    
    $scope.variationProfilePage = 1;
    $scope.variationProfileLimit = 20;
    $scope.variationProfileMaxSize = 3;
    $scope.variationProfileTotal = VariationProfileQuery.query({taxon: $scope.taxonID, total: true});
    $scope.variationProfilePageChanged = function (newPage) {
        $scope.variationProfilePage = newPage;
        $scope.variationProfile = VariationProfileQuery.query({taxon: $scope.taxonID, limit: $scope.variationProfileLimit, offset: ($scope.variationProfilePage - 1) * $scope.variationProfileLimit});
    };
    $scope.variationProfilePageChanged(1);
    
    $scope.tabs = {
        classification: {active: true},
        phenotypes: {active: false},
        variation: {active: false},
        similarity: {active: false}
    }
    $scope.activateTab = function (tabname) {
        if (_.has($scope.tabs, tabname)) {
            $scope.tabs[tabname].active = true;
            $location.search('tab', tabname);
        }
    }
    $scope.$on('$routeUpdate', function() {
      $scope.activateTab($location.search().tab);
    });
    if ($routeParams.tab && _.has($scope.tabs, $routeParams.tab)) {
        $scope.tabs[$routeParams.tab].active = true;
    }
})
.controller('StudyController', function ($scope, $routeParams, $location, $log, $window, Study, StudyTaxa, StudyPhenotypes, Vocab, Label) {
    $scope.studyID = $routeParams.study;
    $scope.study = Study.query({'iri': $scope.studyID});
    
    $scope.phenotypesPage = 1;
    $scope.phenotypesLimit = 20;
    $scope.phenotypesMaxSize = 3;
    $scope.phenotypesPageChanged = function (newPage) {
        $scope.phenotypesPage = newPage;
        var params = {
            iri: $scope.studyID, 
            limit: $scope.phenotypesLimit, 
            offset: ($scope.phenotypesPage - 1) * $scope.phenotypesLimit
        };
        $scope.phenotypes = StudyPhenotypes.query(params);
    };
    $scope.resetPhenotypes = function () {
        var params = {iri: $scope.studyID, total: true};
        $scope.phenotypesTotal = StudyPhenotypes.query(params);
        $scope.phenotypesPageChanged(1);
    }
    $scope.resetPhenotypes();
    
    $scope.taxaPage = 1;
    $scope.taxaLimit = 20;
    $scope.taxaMaxSize = 3;
    $scope.taxaPageChanged = function (newPage) {
        $scope.taxaPage = newPage;
        var params = {
            iri: $scope.studyID, 
            limit: $scope.taxaLimit, 
            offset: ($scope.taxaPage - 1) * $scope.taxaLimit
        };
        $scope.taxa = StudyTaxa.query(params);
    };
    $scope.resetTaxa = function () {
        var params = {iri: $scope.studyID, total: true};
        $scope.taxaTotal = StudyTaxa.query(params);
        $scope.taxaPageChanged(1);
    }
    $scope.resetTaxa();
})
.controller('GeneController', function ($scope, $routeParams, $location, Gene, GenePhenotypes, GeneExpression) {
    $scope.geneID = $routeParams.gene;
    $scope.gene = Gene.query({iri: $scope.geneID});
    $scope.queryPhenotypes = function () {
        $scope.phenotypes = GenePhenotypes.query({iri: $scope.geneID});
    }
    $scope.queryExpression = function () {
        $scope.expression = GeneExpression.query({iri: $scope.geneID});
    }
    $scope.queryPhenotypes();
    $scope.queryExpression();
    $scope.tabs = {
        phenotypes: {active: true},
        expression: {active: false},
        similarity: {active: false}
    }
    $scope.activateTab = function (tabname) {
        if (_.has($scope.tabs, tabname)) {
            $scope.tabs[tabname].active = true;
            $location.search('tab', tabname);
        }
        
    }
    $scope.$on('$routeUpdate', function() {
      $scope.activateTab($location.search().tab);
    });
    if ($routeParams.tab && _.has($scope.tabs, $routeParams.tab)) {
        $scope.tabs[$routeParams.tab].active = true;
    }
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
.controller('OntoTraceController', function ($scope, OntologyTermSearch, $http, Vocab, $filter, APIroot) {
    $scope.ontotraceURL = null;
    $scope.inputType = 'simple';
    $scope.ontotraceSettings = {
        includeParts: false,
        includeAllCharacters: false 
    };
    $scope.queryEntityExpression = null;
    $scope.queryTaxonExpression = null;
    $scope.$watch('queryEntityLabelExpression', function (value) {
        if (value) {
            $http.get(APIroot + '/term/resolve_label_expression', {params: {expression: value}}).then(
            function (response) { 
                $scope.entityExpressionErrorMessage = null;
                $scope.queryEntityExpression = response.data;
            },
            function (error) {
                $scope.entityExpressionErrorMessage = error.data;
                $scope.queryEntityExpression = null;
            }
          );
        } else {
            $scope.queryEntityExpression = null;
        }
    });
    $scope.$watch('queryTaxonLabelExpression', function (value) {
        if (value) {
            $http.get(APIroot + '/term/resolve_label_expression', {params: {expression: value}}).then(
            function (response) { 
                $scope.taxonExpressionErrorMessage = null;
                $scope.queryTaxonExpression = response.data;
            },
            function (error) {
                $scope.taxonExpressionErrorMessage = error.data;
                $scope.queryTaxonExpression = null;
            }
          );
        } else {
            $scope.queryTaxonExpression = null;
        }
    });
    $scope.searchTaxa = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.VTO
        }).$promise.then(function (response) {
            return response.results;
        });
    };
    $scope.searchEntities = function (text) {
        return OntologyTermSearch.query({
            limit: 20,
            text: text,
            definedBy: Vocab.Uberon
        }).$promise.then(function (response) {
            return response.results;
        });
    };
    function prepareTerm(term) {
        return $filter('encodeURI')($filter('angled')(term['@id']));
    }
    $scope.$watchGroup(['queryEntity', 'queryTaxon', 'queryEntityExpression', 'queryTaxonExpression', 'inputType', 'ontotraceSettings.includeAllCharacters', 'ontotraceSettings.includeParts'], function (value) {
        if ($scope.inputType == 'simple' && $scope.queryEntity && $scope.queryTaxon) {
            $scope.ontotraceURL = APIroot + "/ontotrace?entity=" + prepareTerm($scope.queryEntity) + "&taxon=" + prepareTerm($scope.queryTaxon) + "&variable_only=" + !$scope.ontotraceSettings.includeAllCharacters + "&parts=" + $scope.ontotraceSettings.includeParts;
        } else if ($scope.inputType == 'expression' && $scope.queryEntityExpression && $scope.queryTaxonExpression) {
            $scope.ontotraceURL = APIroot + "/ontotrace?entity=" + $filter('encodeURI')($scope.queryEntityExpression) + "&taxon=" + $filter('encodeURI')($scope.queryTaxonExpression) + "&variable_only=" + !$scope.ontotraceSettings.includeAllCharacters + "&parts=false";
        } else {
            $scope.ontotraceURL = null;
        }
    });
})
.controller('SimilarityController', function ($scope, $routeParams, $q, $location, Gene, GeneSearch) {
    $scope.searchGenes = function (text) {
        return GeneSearch.query({
            limit: 20,
            text: text
        }).$promise.then(function (response) {
            return response.results;
        });
    };
    $scope.$watch('geneToQuery', function (value) {
        if (_.has(value, '@id')) {
            $location.search('gene', value['@id']);
        }
    });
    if ($routeParams.gene) {
        Gene.query({iri: $routeParams.gene}).$promise.then(function (value) {
            $scope.geneToQuery = value;
        });
    }
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
.controller('TaxonNameController', function ($scope, Taxon) {
    $scope.$watch('iri', function (value) {
        if ($scope.iri) {
            $scope.taxonInfo = Taxon.query({iri: $scope.iri});
        }
    });
    $scope.isGenusOrSpecies = function (taxon) {
        if (taxon) {
            if (taxon.rank) {
                return (taxon.rank['@id'] == "http://purl.obolibrary.org/obo/TAXRANK_0000005") || (taxon.rank['@id'] == "http://purl.obolibrary.org/obo/TAXRANK_0000006");
            } else {
                return false;
            }
        }
    };
})
.controller('TermNameController', function ($scope, Label) {
    $scope.$watch('iri', function (value) {
        if ($scope.iri) {
            $scope.term = Label.query({iri: $scope.iri});
        }
    });
})
.controller('CountedPhenotypesForTaxonController', function ($scope, TaxonPhenotypesQuery, OMN) {
    var params = {total: true};
    params.taxon = $scope.taxon['@id'];
    params.entity = OMN.angled($scope.entity['@id']);
    if ($scope.quality) {
        params.quality = OMN.angled($scope.quality['@id']);
    }
    $scope.count = TaxonPhenotypesQuery.query(params);
})
.controller('CountedPresenceOrAbsenceForTaxonController', function ($scope, EntityPresenceEvidence, EntityAbsenceEvidence, OMN) {
    var params = {total: true,
        taxon: $scope.taxon['@id'],
        entity: $scope.entity['@id']};
    if ($scope.kind == 'presence') {
        $scope.count = EntityPresenceEvidence.query(params);
    } else {
        $scope.count = EntityAbsenceEvidence.query(params);
    }
    
})
.controller('CharacterDescriptionAnnotationController', function ($scope, Label, PhenotypeAnnotations, CharacterDescriptionWithAnnotation) {
    $scope.description = CharacterDescriptionWithAnnotation.query({iri: $scope.iri});
//    $scope.phenotype = Label.query({iri: $scope.iri});
    $scope.eqs = PhenotypeAnnotations.query({iri: $scope.iri});
})
.controller('ClassificationController', function ($scope, $filter, Classification) {
    $scope.classification = Classification.query({iri: $scope.iri, definedBy: $scope.definedBy});
    $scope.linkMaker = $filter($scope.linkFilter);
})
.controller('SimilarityViewController', function ($scope, SimilarityMatches, SimilarityAnnotationMatches, ProfileSize, SimilarityCorpusSize) {
    $scope.maxSize = 3;
    $scope.matchesPage = 1;
    $scope.matchesLimit = 20;
    $scope.pageChanged = function () {
        $scope.queryTopMatches();
    }
    $scope.matchesTotal = SimilarityCorpusSize.query({corpus_graph: $scope.corpusGraph}); //FIXME this query is too slow!
    //$scope.matchesTotal = {total: 1000};
    $scope.queryTopMatches = function () {
        $scope.queryProfileSize = ProfileSize.query({iri: $scope.subject['@id']});
        $scope.selectedMatch = null;
        $scope.topMatches = SimilarityMatches.query({
            corpus_graph: $scope.corpusGraph,
            iri: $scope.subject['@id'],
            limit: $scope.matchesLimit,
            offset: ($scope.matchesPage - 1) * $scope.matchesLimit
        });
    };   
    $scope.selectMatch = function (match) {
        $scope.selectedMatch = match;
        $scope.annotationMatches = null;
        $scope.selectedMatchProfileSize = ProfileSize.query({iri: match.match_profile['@id']});
        $scope.annotationMatches = SimilarityAnnotationMatches.query({
            corpus_graph: $scope.corpusGraph,
            query_graph: $scope.queryGraph,
            query_iri: $scope.subject['@id'], 
            corpus_iri: match.match_profile['@id']}
        );
    };
//    $scope.selectedMatch = null;
//    $scope.annotationMatches = null;
//    $scope.queryProfileSize = null;
//    $scope.matchesPage = 1;
//    $scope.selectedMatchProfileSize = null;
    
    $scope.$watch("subject['@id']", function (value) {
        if (value) {
            $scope.queryTopMatches();
        }
    });
})
.controller('VisualizationController', function ($scope, $q, TaxaWithPhenotype, OMN) {
    $scope.$watch('structures', function (newValue, oldValue) {
        queryNewData();
    });
    $scope.$watch('values', function (newValue, oldValue) {
        updateSpec();
    });
    $scope.structures = [
        {'@id': "http://purl.obolibrary.org/obo/UBERON_0003097", label: "dorsal fin"},
        {'@id': "http://purl.obolibrary.org/obo/UBERON_4000164", label: "caudal fin"},
        {'@id': "http://purl.obolibrary.org/obo/UBERON_2000251", label: "adipose fin"},
        {'@id': "http://purl.obolibrary.org/obo/UBERON_4000163", label: "anal fin"}
    ];
    function queryNewData() {
        var allTaxonCounts = $scope.structures.map(function (item) {
            return {
                structure: item,
                result: TaxaWithPhenotype.query({
                    entity: OMN.angled(item['@id']), 
                    total: true})};
            });
            var allTaxonCountPromises = allTaxonCounts.map(function (item) {
                return item.result.$promise;
            });
            $q.all(allTaxonCountPromises).then(function (data) {
                $scope.values = allTaxonCounts.map(function (item) {
                    return {
                        category: item.structure.label,
                        amount: item.result.total
                    };
                });
            });
        }
        
        function updateSpec() {
            $scope.spec = {
            "width": 400,
            "height": 200,
            "padding": {"top": 10, "left": 50, "bottom": 20, "right": 10},

            "data": [
                {
                    "name": "table",
                    "values": $scope.values
                }
            ],

            "signals": [
                {
                    "name": "tooltip",
                    "init": {},
                    "streams": [
                        {"type": "rect:mouseover", "expr": "datum"},
                        {"type": "rect:mouseout", "expr": "{}"}
                    ]
                }
            ],

            "predicates": [
                {
                    "name": "tooltip", "type": "==", 
                    "operands": [{"signal": "tooltip._id"}, {"arg": "id"}]
                }
            ],

            "scales": [
                { "name": "xscale", "type": "ordinal", "range": "width",
                "domain": {"data": "table", "field": "category"} },
                { "name": "yscale", "range": "height", "nice": true,
                "domain": {"data": "table", "field": "amount"} }
            ],

            "axes": [
                { "type": "x", "scale": "xscale" },
                { "type": "y", "scale": "yscale" }
            ],

            "marks": [
                {
                    "type": "rect",
                    "from": {"data":"table"},
                    "properties": {
                        "enter": {
                            "x": {"scale": "xscale", "field": "category"},
                            "width": {"scale": "xscale", "band": true, "offset": -1},
                            "y": {"scale": "yscale", "field": "amount"},
                            "y2": {"scale": "yscale", "value":0}
                        },
                        "update": { "fill": {"value": "steelblue"} },
                        "hover": { "fill": {"value": "red"} }
                    }
                },
                {
                    "type": "text",
                    "properties": {
                        "enter": {
                            "align": {"value": "center"},
                            "fill": {"value": "#333"}
                        },
                        "update": {
                            "x": {"scale": "xscale", "signal": "tooltip.category"},
                            "dx": {"scale": "xscale", "band": true, "mult": 0.5},
                            "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -5},
                            "text": {"signal": "tooltip.amount"},
                            "fillOpacity": {
                                "rule": [
                                    {
                                        "predicate": {"name": "tooltip", "id": {"value": null}},
                                        "value": 0
                                    },
                                    {"value": 1}
                                ]
                            }
                        }
                    }
                }
            ]
        };
    
    }
})
;
