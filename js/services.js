'use strict';

/* Services */

angular.module('pkb.services', ['ngResource'])
	.value('version', '0.1')
	.factory('EntityPresence', function ($resource) {
		return $resource('http://pkb-new.nescent.org/kb/entity/presence', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('EntityAbsence', function ($resource) {
		return $resource('http://pkb-new.nescent.org/kb/entity/absence', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('AnatomicalTermSearch', function ($resource) {
		return $resource('http://pkb-new.nescent.org/kb/entity/search', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('OntologyTermSearch', function ($resource) {
		return $resource('http://pkb-new.nescent.org/kb/term/search_classes', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('CharacterStateSearch', function ($resource) {
		return $resource('http://pkb-new.nescent.org/kb/characterstate/search', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Label', function ($resource) {
		return $resource('http://pkb-new.nescent.org/kb/term/label', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Labels', function ($resource) {
		return $resource('http://pkb-new.nescent.org/kb/term/labels', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('Term', function ($resource) {
		return $resource('http://pkb-new.nescent.org/kb/term', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('CharacterStateQuery', function ($resource) {
		return $resource('http://pkb-new.nescent.org/kb/characterstate/query', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('TaxonQuery', function ($resource) {
		return $resource('http://pkb-new.nescent.org/kb/taxon/query', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
	.factory('OntoTraceQuery', function ($resource) {
		return $resource('http://pkb-new.nescent.org/kb/ontotrace', {}, {
			query: {
				method: 'GET',
				headers: {'Accept': 'application/json'}
		}})
	})
    .factory('Vocab', function () {
        return {
            OWLThing: "http://www.w3.org/2002/07/owl#Thing",
            VTO: "http://purl.obolibrary.org/obo/vto.owl",
            Uberon: "http://purl.obolibrary.org/obo/uberon.owl"
        }
    }).
    factory('OMN', function () {
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
    ;
