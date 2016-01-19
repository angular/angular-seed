'use strict';

/* Services */

angular.module('pkb.services', ['ngResource'])
	.constant('APIroot', 'http://kb.phenoscape.org/api')
	.factory('EntityPresence', function ($resource, APIroot) {
		return $resource(APIroot + '/entity/presence', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('EntityAbsence', function ($resource, APIroot) {
		return $resource(APIroot + '/entity/absence', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('EntityPresenceEvidence', function ($resource, APIroot) {
		return $resource(APIroot + '/entity/presence/evidence', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('EntityAbsenceEvidence', function ($resource, APIroot) {
		return $resource(APIroot + '/entity/absence/evidence', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('TaxaWithPhenotype', function ($resource, APIroot) {
		return $resource(APIroot + '/taxon/with_phenotype', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('AnatomicalTermSearch', function ($resource, APIroot) {
		return $resource(APIroot + '/entity/search', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('TermSearch', function ($resource, APIroot) {
		return $resource(APIroot + '/term/search', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('OntologyTermSearch', function ($resource, APIroot) {
		return $resource(APIroot + '/term/search_classes', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('GeneSearch', function ($resource, APIroot) {
		return $resource(APIroot + '/gene/search', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('CharacterStateSearch', function ($resource, APIroot) {
		return $resource(APIroot + '/characterstate/search', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('CharacterDescriptionWithAnnotation', function ($resource, APIroot) {
		return $resource(APIroot + '/characterstate/with_annotation', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Label', function ($resource, APIroot) {
		return $resource(APIroot + '/term/label', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Labels', function ($resource, APIroot) {
		return $resource(APIroot + '/term/labels', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Term', function ($resource, APIroot) {
		return $resource(APIroot + '/term', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Taxon', function ($resource, APIroot) {
		return $resource(APIroot + '/taxon', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Study', function ($resource, APIroot) {
		return $resource(APIroot + '/study', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('TaxonCommonGroup', function ($resource, APIroot) {
		return $resource(APIroot + '/taxon/group', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Gene', function ($resource, APIroot) {
		return $resource(APIroot + '/gene', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('GenePhenotypes', function ($resource, APIroot) {
		return $resource(APIroot + '/gene/phenotypic_profile', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('GeneExpression', function ($resource, APIroot) {
		return $resource(APIroot + '/gene/expression_profile', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('EntityPhenotypeGenes', function ($resource, APIroot) {
		return $resource(APIroot + '/gene/affecting_entity_phenotype', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('EntityExpressionGenes', function ($resource, APIroot) {
		return $resource(APIroot + '/gene/expressed_within_entity', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('CharacterStateQuery', function ($resource, APIroot) {
		return $resource(APIroot + '/characterstate/query', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('TaxonQuery', function ($resource, APIroot) {
		return $resource(APIroot + '/taxon/query', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('GeneQuery', function ($resource, APIroot) {
		return $resource(APIroot + '/gene/query', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('OntoTraceQuery', function ($resource, APIroot) {
		return $resource(APIroot + '/ontotrace', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('SimilarityMatches', function ($resource, APIroot) {
		return $resource(APIroot + '/similarity/query', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('SimilaritySubsumers', function ($resource, APIroot) {
		return $resource(APIroot + '/similarity/best_subsumers', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('SimilarityAnnotationMatches', function ($resource, APIroot) {
		return $resource(APIroot + '/similarity/best_matches', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('SubsumedAnnotations', function ($resource, APIroot) {
		return $resource(APIroot + '/similarity/subsumed_annotations', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('SimilarityCorpusSize', function ($resource, APIroot) {
		return $resource(APIroot + '/similarity/corpus_size', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('ProfileSize', function ($resource, APIroot) {
		return $resource(APIroot + '/similarity/profile_size', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('ICDisparity', function ($resource, APIroot) {
		return $resource(APIroot + '/similarity/ic_disparity', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('TaxonPhenotypesQuery', function ($resource, APIroot) {
		return $resource(APIroot + '/taxon/phenotypes', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('VariationProfileQuery', function ($resource, APIroot) {
		return $resource(APIroot + '/taxon/variation_profile', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Classification', function ($resource, APIroot) {
		return $resource(APIroot + '/term/classification', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('ResolveLabelExpression', function ($resource, APIroot) {
		return $resource(APIroot + '/term/resolve_label_expression', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('AnnotationSummary', function ($resource, APIroot) {
		return $resource(APIroot + '/kb/annotation_summary', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
    .factory('ScigraphAnnotator', function ($resource, APIroot) {
        return $resource('http://kb.phenoscape.org/scigraph/annotations/entities', {}, {
            query: {
                method: 'GET',
                headers: {'Accept': 'application/json'},
                isArray: true
        }})
    })
    .factory('StudyTaxa', function ($resource, APIroot) {
        return $resource(APIroot + '/study/taxa', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
    })
    .factory('StudyPhenotypes', function ($resource, APIroot) {
        return $resource(APIroot + '/study/phenotypes', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
    })
    .factory('Vocab', function () {
        return {
            OWLThing: "http://www.w3.org/2002/07/owl#Thing",
            VTO: "http://purl.obolibrary.org/obo/vto.owl",
            PATO: "http://purl.obolibrary.org/obo/pato.owl",
            Uberon: "http://purl.obolibrary.org/obo/uberon.owl",
            Gene: "http://purl.obolibrary.org/obo/SO_0000704"
        }
    })
    .factory('OMN', function () {
        function parens (items) {
            return items.map(function (item) {
                return "(" + item + ")";
            });
        }
        return {
            angled: function (uri) {
                return "<" + uri + ">";
            },
            union: function (uris) {
                return parens(uris).join(" or ");
            },
            intersection: function (uris) {
                return parens(uris).join(" and ")
            }
        }
    })
    .factory('Autocomplete', function (OntologyTermSearch, Vocab) {
        return {
            taxa: function (text) {
                return OntologyTermSearch.query({
                    limit: 20,
                    text: text,
                    definedBy: Vocab.VTO
                }).$promise.then(function (response) {
                    return response.results;
                });
            },
            entities: function (text) {
                return OntologyTermSearch.query({
                    limit: 20,
                    text: text,
                    definedBy: Vocab.Uberon
                }).$promise.then(function (response) {
                    return response.results;
                });
            }
        }
    });
