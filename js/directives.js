'use strict';

/* Directives */


angular.module('pkb.directives', [])
.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}])
.directive('commonGroup', function () {
    return {
        require: 'ngModel',
        restrict: 'E',
        controller: 'CommonGroupController',
        templateUrl: 'partials/common_group.html',
        scope: {
            taxon: '='
        }
    }
})
.directive('taxonName', function () {
    return {
        require: 'ngModel',
        restrict: 'E',
        controller: 'TaxonNameController',
        templateUrl: 'partials/taxon_name.html',
        scope: {
            iri: '='
        }
    }
})
.directive('termName', function () {
    return {
        require: 'ngModel',
        restrict: 'E',
        controller: 'TermNameController',
        templateUrl: 'partials/term_name.html',
        scope: {
            iri: '='//,
            //linker: '='
        }
    }
})
.directive('termSearchList', function () {
    return {
        require: 'ngModel',
        restrict: 'E',
        templateUrl: 'partials/term_search_list.html',
        scope: {
            terms: '=',
            query: '=',
            placeholder: '@'
        }
    }
})
.directive('queryPanel', function () {
    return {
        restrict: 'E',
        controller: 'QueryPanelController',
        templateUrl: 'partials/query_panel.html',
        scope: {
            parameters: '=',
            applyQuery: '=',
            configuration: '@',
            options: '='
        }
    }
})
.directive('similarityView', function () {
    return {
        restrict: 'E',
        controller: 'SimilarityViewController',
        templateUrl: 'partials/similarity_view.html',
        scope: {
            gene: '='
        }
    }
});
