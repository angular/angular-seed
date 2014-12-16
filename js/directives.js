'use strict';

/* Directives */


angular.module('pkb.directives', [])
.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}])
.directive('termSearchList', function() {
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
});
