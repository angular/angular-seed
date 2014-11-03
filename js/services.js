'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('pkb.services', ['ngResource'])
	.value('version', '0.1')
	.factory('EntityPresence', function ($resource) {
		return $resource('/kb/entity/presence', {}, {
			query: {
				method: 'GET',
				isArray: true,
				headers: {'Accept': 'application/sparql-results+json'},
				transformResponse:  function (data, headerGet) {
					return angular.fromJson(data).results.bindings;
				}
		}})
	});
