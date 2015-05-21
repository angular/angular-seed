'use strict';

/* Services */

angular.module('pkb.services', ['ngResource'])
	.value('version', '0.1')
	.factory('EntityPresence', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/entity/presence', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('EntityAbsence', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/entity/absence', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('AnatomicalTermSearch', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/entity/search', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('TermSearch', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/term/search', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('OntologyTermSearch', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/term/search_classes', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('GeneSearch', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/gene/search', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('CharacterStateSearch', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/characterstate/search', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Label', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/term/label', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Labels', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/term/labels', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Term', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/term', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Taxon', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/taxon', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('TaxonCommonGroup', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/taxon/group', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Gene', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/gene', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('GenePhenotypes', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/gene/phenotypic_profile', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('GeneExpression', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/gene/expression_profile', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('EntityPhenotypeGenes', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/gene/affecting_entity_phenotype', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('EntityExpressionGenes', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/gene/expressed_within_entity', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('CharacterStateQuery', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/characterstate/query', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('TaxonQuery', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/taxon/query', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('GeneQuery', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/gene/query', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('OntoTraceQuery', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/ontotrace', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('SimilarityMatches', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/similarity/query', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('SimilaritySubsumers', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/similarity/best_subsumers', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('SimilarityAnnotationMatches', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/similarity/best_matches', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('SubsumedAnnotations', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/similarity/subsumed_annotations', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('SimilarityCorpusSize', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/similarity/corpus_size', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('ProfileSize', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/similarity/profile_size', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('ICDisparity', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/similarity/ic_disparity', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('TaxonPhenotypesQuery', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/taxon/phenotypes', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('VariationProfileQuery', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/taxon/variation_profile', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Classification', function ($resource) {
		return $resource('http://kb.phenoscape.org/kb/term/classification', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
    .factory('Vocab', function () {
        return {
            OWLThing: "http://www.w3.org/2002/07/owl#Thing",
            VTO: "http://purl.obolibrary.org/obo/vto.owl",
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
