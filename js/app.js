'use strict';


// Declare app level module which depends on filters, and services
angular.module('pkb', [
'ngRoute',
'cgBusy',
'ngScientificNotation',
'swd.inspector-gadget',
'pkb.filters',
'pkb.services',
'pkb.directives',
'pkb.controllers'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeController'});
    $routeProvider.when('/about/phenoscape/kb', {templateUrl: 'partials/about_phenoscape_kb.html', controller: 'AboutPhenoscapeKBController'});
    $routeProvider.when('/about/phenoscape', {templateUrl: 'partials/about_phenoscape.html', controller: 'AboutPhenoscapeController'});
    $routeProvider.when('/entity/:term*', {templateUrl: 'partials/entity.html', controller: 'EntityController'});
    $routeProvider.when('/taxon/:taxon*', {templateUrl: 'partials/taxon.html', controller: 'TaxonController', reloadOnSearch: false});
    $routeProvider.when('/gene/:gene*', {templateUrl: 'partials/gene.html', controller: 'GeneController', reloadOnSearch: false});
    $routeProvider.when('/study/:study*', {templateUrl: 'partials/study.html', controller: 'StudyController', reloadOnSearch: false});
    $routeProvider.when('/characterstate/:state*', {templateUrl: 'partials/characterstate.html', controller: 'CharacterStateController'});
	$routeProvider.when('/contents', {templateUrl: 'partials/contents.html', controller: 'ContentsController'});
	$routeProvider.when('/presence_absence', {templateUrl: 'partials/presence_absence.html', controller: 'PresenceAbsenceController'});
    $routeProvider.when('/query_characters', {templateUrl: 'partials/query_characters.html', controller: 'QueryCharacterStatesController'});
    $routeProvider.when('/query_taxa', {templateUrl: 'partials/query_taxa.html', controller: 'QueryTaxaController'});
    $routeProvider.when('/query_genes', {templateUrl: 'partials/query_genes.html', controller: 'QueryGenesController'});
    $routeProvider.when('/query_variation_profile', {templateUrl: 'partials/query_variation_profile.html', controller: 'QueryVariationProfileController'});
    $routeProvider.when('/ontotrace', {templateUrl: 'partials/ontotrace.html', controller: 'OntoTraceController'});
    $routeProvider.when('/similarity', {templateUrl: 'partials/similarity.html', controller: 'SimilarityController'});
    $routeProvider.when('/annotate_text', {templateUrl: 'partials/annotate_text.html', controller: 'AnnotateTextController'});
	$routeProvider.otherwise({redirectTo: '/home'});
}]);
