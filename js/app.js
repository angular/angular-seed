'use strict';


// Declare app level module which depends on filters, and services
angular.module('pkb', [
'ngRoute',
'cgBusy',
'pkb.filters',
'pkb.services',
'pkb.directives',
'pkb.controllers'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeController'});
    $routeProvider.when('/entity/:term*', {templateUrl: 'partials/entity.html', controller: 'EntityController'});
    $routeProvider.when('/taxon/:taxon*', {templateUrl: 'partials/taxon.html', controller: 'TaxonController'});
    $routeProvider.when('/characterstate/:state*', {templateUrl: 'partials/characterstate.html', controller: 'CharacterStateController'});
	$routeProvider.when('/contents', {templateUrl: 'partials/contents.html', controller: 'ContentsController'});
	$routeProvider.when('/presence_absence', {templateUrl: 'partials/presence_absence.html', controller: 'PresenceAbsenceController'});
    $routeProvider.when('/query_characters', {templateUrl: 'partials/query_characters.html', controller: 'QueryCharacterStatesController'});
    $routeProvider.when('/query_taxa', {templateUrl: 'partials/query_taxa.html', controller: 'QueryTaxaController'});
    $routeProvider.when('/query_genes', {templateUrl: 'partials/query_genes.html', controller: 'QueryGenesController'});
    $routeProvider.when('/query_variation_profile', {templateUrl: 'partials/query_variation_profile.html', controller: 'QueryVariationProfileController'});
    $routeProvider.when('/ontotrace', {templateUrl: 'partials/ontotrace.html', controller: 'OntoTraceController'});
    $routeProvider.when('/similarity', {templateUrl: 'partials/similarity.html', controller: 'SimilarityController'});
	$routeProvider.otherwise({redirectTo: '/home'});
}]);
